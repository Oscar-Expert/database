const base = require('../airtable')
const end = require('../db/end');
const queries = require('../queries');
const AWARDS_NAMES = require('../constants/awardsNames');
const AWARDS_CATEGORIES = require('../constants/awardsCategories');

// Airtable name goes here
base('Picture').select({
    // maxRecords: 2,
    view: "Grid view"
}).firstPage(async(err, records) => {

    // Create Awards Body entry if not exists
    await queries.createAwardsBody(AWARDS_NAMES.AMPAS);

    // Get Awards Body ID
    const { data: awardsBodyId } = await queries.getAwardsBodyId(AWARDS_NAMES.AMPAS)

    // Create Awards Category entry if not exists
    await queries.createAwardsCategory(AWARDS_CATEGORIES.PICTURE);

    // Get Awards Category ID
    const { data: awardsCategoryId } = await queries.getAwardsCategoryId(AWARDS_CATEGORIES.PICTURE)

    const promises = records.map((record) => {
        return new Promise(async(resolve, reject) => {
            // Gather data from record
            const year = record.get('YEAR');
            const movieWikiUrl = record.get('FILM_UNIQUE');
            const title = record.get('FILM');
            const winner = record.get('WINNER') || false;
            const people = record.get('PRODUCERS').split(/(?:,| and )+/).reduce((acc, cur) => {
                const trimmed = cur.trim();
                if (trimmed.length > 0) {
                    acc.push(trimmed);
                }
                return acc;
            }, [])
            const wikiUrls = record.get('PRODUCERS_UNIQUE').split(' ');

            // Create Award entry if not exists
            await queries.createAward(year, awardsBodyId, awardsCategoryId);
            // Get Award ID
            const { data: awardId } = await queries.getAwardId(year, awardsBodyId, awardsCategoryId);
            // Validate one url per person
            if (people.length !== wikiUrls.length) {
                console.error('THERE IS AN ERROR IN YOUR ENTRY', people, wikiUrls);
                reject();
                return;
            }
            
            // Create Movie entry if not exists
            await queries.createMovie(year, movieWikiUrl, title);

            // Get movie ID
            const { data: movieId } = await queries.getMovieId(movieWikiUrl);

            for (let i=0; i<people.length; i++) {
                // Create Person entry if not exists
                await queries.createPerson(wikiUrls[i], people[i]);

                // Get Person ID
                const { data: personId } = await queries.getPersonId(wikiUrls[i]);

                // Create Nomination entry
                await queries.createNomination(winner, personId, movieId, awardId);
            }
            resolve();
        }).catch(e=>console.error('error',e))
    });
    await Promise.all(promises)
    return end();
});
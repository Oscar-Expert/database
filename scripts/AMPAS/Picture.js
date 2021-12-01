const base = require('../../airtable')
const end = require('../../db/end');
const queries = require('../../queries');

// Airtable name goes here
base('PICTURE').select({
    // maxRecords: 10,
    view: "Grid view"
}).eachPage(async(records, fetchNextPage) => {
    // console.log('records',records)
    const awardsBody = 'AMPAS';
    const awardsCategory = 'PICTURE';

    const promises = records.map((record) => {
        return new Promise(async(resolve, reject) => {
            // Gather data from record
            const year = record.get('YEAR');
            const movieWikiUrl = record.get('FILM_UNIQUE');
            const title = record.get('FILM');
            const winner = record.get('WINNER') || false;

            const maybeProducers = record.get('PRODUCERS');
            const people = maybeProducers
                ? record.get('PRODUCERS').split(/(?:,| and )+/).reduce((acc, cur) => {
                    const trimmed = cur.trim();
                    if (trimmed.length > 0) {
                        acc.push(trimmed);
                    }
                    return acc;
                }, [])
                : undefined;

            const maybeUrls = record.get('PRODUCERS_UNIQUE');
            const wikiUrls = maybeUrls
                ? record.get('PRODUCERS_UNIQUE').split(' ') 
                : undefined;

            // Create Award entry if not exists
            await queries.createAward(year, awardsBody, awardsCategory);
            // Get Award ID
            const { data: awardId } = await queries.getAwardId(year, awardsBody, awardsCategory);
            // Validate one url per person
            if (people && people.length !== wikiUrls.length) {
                console.error('THERE IS AN ERROR IN YOUR ENTRY', people, wikiUrls);
                reject();
                return;
            }
            
            // Create Movie entry if not exists
            await queries.createMovie(year, movieWikiUrl, title);

            // Get movie ID
            const { data: movieId } = await queries.getMovieId(movieWikiUrl);

            if (people) {
                for (let i=0; i<people.length; i++) {
                    // Create Person entry if not exists
                    await queries.createPerson(wikiUrls[i], people[i]);

                    // Get Person ID
                    const { data: personId } = await queries.getPersonId(wikiUrls[i]);

                    // Create Nomination entry
                    await queries.createNomination(winner, personId, movieId, awardId);
                }
            }
            resolve();
        }).catch(e=>console.error('error',e))
    });
    await Promise.all(promises)
    fetchNextPage();
}, (err) => {
    if (err) console.error(err);
    return end();
});
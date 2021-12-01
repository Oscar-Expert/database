const base = require('../../airtable')
const end = require('../../db/end');
const queries = require('../../queries');

// Airtable name goes here
base('DIRECTOR').select({
    // maxRecords: 10,
    view: "Grid view"
}).eachPage(async(records, fetchNextPage) => {
    const awardsBody = 'AMPAS';
    const awardsCategory = 'DIRECTOR';

    const promises = records.map((record) => {
        return new Promise(async(resolve, reject) => {

            // Gather data from record
            const year = record.get('YEAR');
            const movieWikiUrl = record.get('FILM_UNIQUE');
            const movie = record.get('FILM');
            const winner = record.get('WINNER') || false;
            const directors = record.get('DIRECTOR').split('&').reduce((acc, cur) => {
                const trimmed = cur.trim();
                if (trimmed.length > 0) {
                    acc.push(trimmed);
                }
                return acc;
            }, [])
            const directorWikiUrls = record.get('DIRECTOR_UNIQUE').split(' ');

            // Create Award entry if not exists
            await queries.createAward(year, awardsBody, awardsCategory);
            // Get Award ID
            const { data: awardId } = await queries.getAwardId(year, awardsBody, awardsCategory);
            // Validate one url per person
            if (directors.length !== directorWikiUrls.length) {
                console.error('THERE IS AN ERROR IN YOUR ENTRY', directors, directorWikiUrls);
                reject();
                return;
            }
            
            // Create Movie entry if not exists
            await queries.createMovie(year, movieWikiUrl, movie);

            // Get movie ID
            const { data: movieId } = await queries.getMovieId(movieWikiUrl);

            for (let i=0; i<directors.length; i++) {
                // Create Person entry if not exists
                await queries.createPerson(directorWikiUrls[i], directors[i]);

                // Get Person ID
                const { data: personId } = await queries.getPersonId(directorWikiUrls[i]);

                // Create Nomination entry
                await queries.createNomination(winner, personId, movieId, awardId);
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
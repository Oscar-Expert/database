const base = require('../airtable')
const end = require('../db/end');
const queries = require('../queries');

/**
 * Inserts data from _PROD_LOCK table into database
 * Note: we shouldn't insert data from here into the database
 */

const insertData = () => {
    // Airtable name goes here
    base('_PROD_LOCK').select({
        // maxRecords: 10,
        view: "Grid view"
    }).eachPage(async(records, fetchNextPage) => {

        const promises = records.map((record) => {
            return new Promise(async(resolve) => {
                // Gather data from record
                const AWARDS_BODY = record.get('AWARDS_BODY')
                const CATEGORY = record.get('CATEGORY')
                const YEAR = record.get('YEAR');
                const FILM = record.get('FILM');
                const FILM_UNIQUE = record.get('FILM_UNIQUE');
                const WINNER = record.get('WINNER') || false;
                const NOMINEE = record.get('NOMINEE') || '';
                const NOMINEE_UNIQUE = record.get('NOMINEE_UNIQUE') || '';

                // use for debugging
                // .then(res => console.log('res',res))
                // .catch(err => console.log('err',err))

                // Create Award entry if not exists
                await queries.createAward(YEAR, AWARDS_BODY, CATEGORY)
                // Create Movie entry if not exists
                await queries.createMovie(YEAR, FILM_UNIQUE, FILM);
                // Create Person entry if not exists
                await queries.createPerson(NOMINEE_UNIQUE, NOMINEE);

                // Get Award ID
                const { data: awardId } = await queries.getAwardId(YEAR, AWARDS_BODY, CATEGORY)
                // Get movie ID
                const { data: movieId } = await queries.getMovieId(FILM_UNIQUE);
                // Get Person ID
                const { data: personId } = await queries.getPersonId(NOMINEE_UNIQUE);

                // Create Nomination entry
                await queries.createNomination(WINNER, personId, movieId, awardId);
                
                resolve();
            }).catch(e=>console.error('error', record, e))
        });
        await Promise.all(promises)
        fetchNextPage();
    }, (err) => {
        if (err) console.error(err);
        // return end();
    });
}

insertData();
const base = require('../../airtable')
const end = require('../../db/end');
const queries = require('../../queries');

/**
 * Inserts data from CATEGORY table into database
 * Note: we shouldn't insert data from here into the database
 */

const AWARDS_BODY = 'AMPAS'; // SET MANUALLY
const CATEGORY = 'PICTURE'; // SET MANUALLY

const uploadCategory = () => {
    // Airtable name goes here
    base('CATEGORY').select({
        // maxRecords: 10,
        view: "Grid view"
    }).eachPage(async(records, fetchNextPage) => {

        const promises = records.map((record) => {
            return new Promise(async(resolve, reject) => {
                // Gather data from record
                const year = record.get('YEAR');
                const filmUnique = record.get('FILM_UNIQUE');
                const film = record.get('FILM');
                const winner = record.get('WINNER') || false;
                const maybeNominees = record.get('NOMINEES');
                const nominees = maybeNominees
                    ? maybeNominees
                        .split(/(?:,| and |&)+/)
                        .reduce((acc, cur) => {
                        const trimmed = cur.trim();
                        if (trimmed.length > 0) {
                            acc.push(trimmed);
                        }
                        return acc;
                    }, [])
                    : undefined;

                const maybeNomineesUnique = record.get('NOMINEES_UNIQUE');
                const nomineesUnique = maybeNomineesUnique
                    ? record.get('NOMINEES_UNIQUE').split(' ').filter((s) => s.length>1)
                    : undefined;

                // Create Award entry if not exists
                await queries.createAward(year, AWARDS_BODY, CATEGORY)
                    // .then(res => console.log('res',res))
                    // .catch(err => console.log('err',err))

                // Get Award ID
                const { data: awardId } = await queries.getAwardId(year, AWARDS_BODY, CATEGORY)
                    // .then(res => console.log('res',res))
                    // .catch(err => console.log('err',err))

                // Validate one url per person
                if (nominees && nominees.length !== nomineesUnique.length) {
                    console.error('THERE IS AN ERROR IN YOUR ENTRY', nominees, nomineesUnique);
                    console.error('Awards Body:', AWARDS_BODY, 'Category:', CATEGORY)
                    reject();
                    return;
                }
                
                // Create Movie entry if not exists
                await queries.createMovie(year, filmUnique, film);

                // Get movie ID
                const { data: movieId } = await queries.getMovieId(filmUnique);

                if (nominees) {
                    for (let i=0; i<nominees.length; i++) {
                        // Create Person entry if not exists
                        await queries.createPerson(nomineesUnique[i], nominees[i]);

                        // Get Person ID
                        const { data: personId } = await queries.getPersonId(nomineesUnique[i]);

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
        // return end();
    });
}

uploadCategory();
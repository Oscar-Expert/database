const end = require('../db/end');
const queries = require('../queries');

/**
 * Delete all entries from the database
 * - Empties it but doesn't destroy table structure
 */

const promises = [
    queries.deleteAllMovies(),
    queries.deleteAllPeople(),
    queries.deleteAllAwards(),
    queries.deleteAllNominations(),
];

Promise.all(promises)
    .then(() => {
        console.log('success');
    })
    .catch((err) => console.log(err))
    .finally(() => end())
const end = require('../db/end');
const queries = require('../queries');

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
const end = require('../db/end');
const queries = require('../queries');

/**
 * Completely erases tables AND their structure
 * Substitutes for a migration
 * Creates tables according to db/db.sql
 */

const promises = [
    queries.dropAllTables(),
    queries.refreshAllTables(),
];
 
for (let i=0; i<promises.length; i++){
    const executePromise = async() => {
        await Promise.resolve(promises[i]).
            then(() => {
                console.log('success');
            })
            .catch((err) => console.log(err))
    };
    executePromise();
}
end();
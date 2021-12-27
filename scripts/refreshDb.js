const end = require('../db/end');
const queries = require('../queries');

const promises = [
    queries.dropAllTables(),
    queries.refreshAllTables(),
];

// Promise.all(promises)
//     .then(() => {
//         console.log('success');
//     })
//     .catch((err) => console.log(err))
//     .finally(() => end())
 
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
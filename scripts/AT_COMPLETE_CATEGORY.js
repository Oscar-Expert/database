const base = require('../airtable')
const end = require('../db/end');
const queries = require('../queries');

/**
 * Finds unique urls of nominees who are already in the database 
 * to save time on data entry
 * NOTE: sort by nominees A-Z for fastest results
 */

const uploadCategory = () => {
    // Airtable name goes here
    base('CATEGORY').select({
        // maxRecords: 10,
        view: "Grid view",
        sort: [{field: "NOMINEES", direction: "asc"}],
    }).eachPage(async(records, fetchNextPage) => {

        const promises = records.map((record) => {
            return new Promise(async(resolve, reject) => {
                // Gather data from record
                const maybeNominees = record.get('NOMINEES');
                const nominees = maybeNominees
                    ? maybeNominees.split('&')
                    : [];

                const maybeNomineesUnique = record.get('NOMINEES_UNIQUE');
                const nomineesUnique = maybeNomineesUnique
                    ? maybeNomineesUnique.split('&')
                    : [];

                nomineesUnique.forEach(async(nomineeId, i) => {
                    if (!nominees[i]) return;
                    const name = nominees[i].trim(); // O'niel has to be O''neil
                    if (nomineeId.trim() === 'EMPTY') {
                        const res = await queries.getNominee(name.replace(/'/g,`''`))
                        if (res.status === 'error') {
                            return console.log('There was an error', res)
                        }
                        if (res.data.length === 0) {
                            console.log(name)
                            console.log('NEEDS ENTRY')
                            console.log('===========')
                        } else {
                            const categories = {};
                            res.data.forEach((d)=>categories[d.awardsCategory] = true)
                            const years = res.data.map((d)=>d.year);
                            console.log(name)
                            console.log(res.unique)
                            console.log('Categories:', Object.keys(categories))
                            console.log('Years:', Math.min.apply(null, years), ' - ', Math.max.apply(null, years))
                            console.log('===========')
                        }
                    }
                })
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
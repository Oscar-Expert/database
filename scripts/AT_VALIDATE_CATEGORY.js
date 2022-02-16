const base = require('../airtable')
const end = require('../db/end');

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
                const maybeNominees = record.get('NOMINEES');
                const nominees = maybeNominees
                    ? maybeNominees
                        .split('&')
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
                    ? record.get('NOMINEES_UNIQUE').split('&').filter((s) => s.length>1)
                    : undefined;

                // Validate one url per person
                if (nominees && nominees.length !== nomineesUnique.length) {
                    console.error('THERE IS AN ERROR IN YOUR ENTRY', nominees, nomineesUnique);
                    console.error('Awards Body:', AWARDS_BODY, 'Category:', CATEGORY)
                    reject();
                    return;
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
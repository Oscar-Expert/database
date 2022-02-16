const base = require('../airtable')
const end = require('../db/end');

/**
 * Validates _PROD values to make sure names are consistent with unique ids
 */

const validateNomineeNames = (CATEGORY) => {
    // Airtable name goes here
    base(CATEGORY).select({
        // maxRecords: 10,
        view: "Grid view",
        sort: [{field: "NOMINEE", direction: "desc"}],
    }).eachPage(async(records, fetchNextPage) => {

        let lastNominee = '';
        let lastUnique = '';

        records.map((record) => {
            // Gather data from record
            const NOMINEE = record.get('NOMINEE') || undefined;
            const NOMINEE_UNIQUE = record.get('NOMINEE_UNIQUE') || undefined;
            
            // check that unique points to the same nominee
            if (lastNominee === NOMINEE) {
                if (lastUnique !== NOMINEE_UNIQUE) {
                    console.error('CHECK ENTRY: ', NOMINEE, NOMINEE_UNIQUE)
                    console.error('unique compare: ', lastUnique.split(), NOMINEE_UNIQUE.split())
                    console.error('name compare: ', lastNominee.split(), NOMINEE.split())
                }
            }

            lastNominee = NOMINEE
            lastUnique = NOMINEE_UNIQUE
        });
        fetchNextPage();
    }, (err) => {
        if (err) console.error('err', err);
        // return end();
    });
}

validateNomineeNames('_PROD');
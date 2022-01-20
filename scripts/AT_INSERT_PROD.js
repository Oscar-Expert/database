const base = require('../airtable')
const end = require('../db/end');

/**
 * Inserts all entries from _STAGING into _PROD
 */

// Airtable name goes here
base('_STAGING').select({
    // maxRecords: 10,
    view: "Grid view"
}).eachPage(async(records, fetchNextPage) => {

    const allRecords = [];

    records.map((record) => {
        // Gather data from record
        const AWARDS_BODY = record.get('AWARDS_BODY')
        const CATEGORY = record.get('CATEGORY')
        const YEAR = record.get('YEAR');
        const FILM = record.get('FILM');
        const FILM_UNIQUE = record.get('FILM_UNIQUE');
        const WINNER = record.get('WINNER') || false;
        const NOMINEE = record.get('NOMINEE');
        const NOMINEE_UNIQUE = record.get('NOMINEE_UNIQUE');

        const rec = {
            YEAR,
            AWARDS_BODY,
            CATEGORY,
            FILM,
            FILM_UNIQUE,
            NOMINEE,
            NOMINEE_UNIQUE,
            WINNER,
        };
        allRecords.push({ fields: rec })
    });

    let startCount = 0;
        endCount = 10;
    while (endCount < allRecords.length+10) {
        await base('_PROD')
            .create(allRecords.slice(startCount, endCount), (err,records) => {
                if (err) {
                    console.error('create err', err)
                }
            })
        startCount += 10;
        endCount += 10;
    }
    fetchNextPage();
}, (err) => {
    if (err) console.error('err', err);
    // return end();
});
    
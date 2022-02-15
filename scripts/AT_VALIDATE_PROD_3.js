const base = require('../airtable')
const end = require('../db/end');

/**
 * Validates _PROD values to make sure names are consistent with unique ids
 */

const validateMovieUniques = (CATEGORY) => {
    // Airtable name goes here
    base(CATEGORY).select({
        // maxRecords: 10,
        view: "Grid view",
        sort: [{field: "FILM_UNIQUE", direction: "desc"}],
    }).eachPage(async(records, fetchNextPage) => {

        let lastMovie = '';
        let lastUnique = '';

        records.map((record) => {
            // Gather data from record
            const FILM = record.get('FILM') || undefined;
            const FILM_UNIQUE = record.get('FILM_UNIQUE') || undefined;
            
            // check that unique points to the same nominee
            if (lastUnique === FILM_UNIQUE) {
                if (lastMovie !== FILM) {
                    console.error('CHECK ENTRY: ', FILM, FILM_UNIQUE)
                }
            }

            lastMovie = FILM
            lastUnique = FILM_UNIQUE
        });
        fetchNextPage();
    }, (err) => {
        if (err) console.error('err', err);
        // return end();
    });
}

validateMovieUniques('_PROD');
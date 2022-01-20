const base = require('../../airtable')
const end = require('../../db/end');

/**
 * Legacy script that loops through a list of tables and inserts into _STAGING
 */

const AWARDS_BODY = 'AMPAS';

const uploadCategory = (CATEGORY) => {
    // Airtable name goes here
    base(CATEGORY).select({
        // maxRecords: 10,
        view: "Grid view"
    }).eachPage(async(records, fetchNextPage) => {

        const allRecords = [];

        records.map((record) => {
            // Gather data from record
            const YEAR = record.get('YEAR');
            const FILM = record.get('FILM');
            const FILM_UNIQUE = record.get('FILM_UNIQUE');
            const WINNER = record.get('WINNER') || false;
            const maybeNominees = record.get('NOMINEES');
            const maybeNomineesUnique = record.get('NOMINEES_UNIQUE');
            const NOMINEES = maybeNominees
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
            const NOMINEES_UNIQUE = maybeNomineesUnique
                ? record.get('NOMINEES_UNIQUE').split(' ').filter((s) => s.length>1)
                : undefined;
            
            // Validate one url per person
            if (NOMINEES && NOMINEES.length !== NOMINEES_UNIQUE.length) {
                console.error('THERE IS AN ERROR IN YOUR ENTRY', NOMINEES, NOMINEES_UNIQUE);
                console.error('Awards Body:', AWARDS_BODY, 'Category:', CATEGORY)
                reject();
                return;
            }

            if (NOMINEES) {
                for (let i=0; i<NOMINEES.length; i++) {
                    const rec = {
                        YEAR,
                        AWARDS_BODY,
                        CATEGORY,
                        FILM,
                        FILM_UNIQUE,
                        NOMINEE: NOMINEES[i],
                        NOMINEE_UNIQUE: NOMINEES_UNIQUE[i],
                        WINNER,
                    };
                    allRecords.push({ fields: rec })
                }
            } else {
                const rec = {
                    YEAR,
                    AWARDS_BODY,
                    CATEGORY,
                    FILM,
                    FILM_UNIQUE,
                    NOMINEE: '', // undefined
                    NOMINEE_UNIQUE: '', // undefined
                    WINNER,
                };
                allRecords.push({ fields: rec })
            }
        });

        let startCount = 0;
            endCount = 10;
        while (endCount < allRecords.length+10) {
            await base('_STAGING')
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
}

const CATEGORIES = [
    'PICTURE',
    'DIRECTOR',
    'ACTOR',
    'ACTRESS',
    'SUPP_ACTOR',
    'SUPP_ACTRESS',
    'OG_SP',
    'AD_SP',
    'CINEMATOGRAPHY',
    'EDITING',
    'PD',
    'COSTUME',
    'SOUND',
    'VFX',
    'SONG',
    'SCORE',
    'MAKEUP',
    'INTERNATIONAL',
    'DOCUMENTARY',
    'ANIMATED'
];

const loopThroughCategories = async () => {
    for (let i=0; i<CATEGORIES.length; i++) {
        console.log('Awards Body:', AWARDS_BODY)
        console.log('Category:', CATEGORIES[i]);
        await uploadCategory(CATEGORIES[i]);
    }
}

loopThroughCategories();

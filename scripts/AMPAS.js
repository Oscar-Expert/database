const base = require('../airtable')
const end = require('../db/end');
const queries = require('../queries');

const AWARDS_BODY = 'AMPAS';

const uploadCategory = (category) => {
    // Airtable name goes here
    base(category).select({
        // maxRecords: 10,
        view: "Grid view"
    }).eachPage(async(records, fetchNextPage) => {

        const promises = records.map((record) => {
            return new Promise(async(resolve, reject) => {
                // Gather data from record
                const year = record.get('YEAR');
                const movieWikiUrl = record.get('FILM_UNIQUE');
                const title = record.get('FILM');
                const winner = record.get('WINNER') || false;

                // "1,2 3".split(/,| /) 
                // ["1", "2", "3"]

                const maybePeople = record.get('NOMINEES');
                const people = maybePeople
                    ? maybePeople
                        .split(/(?:,| and |&)+/)
                        .reduce((acc, cur) => {
                        const trimmed = cur.trim();
                        if (trimmed.length > 0) {
                            acc.push(trimmed);
                        }
                        return acc;
                    }, [])
                    : undefined;

                // console.log('people',people)

                const maybeUrls = record.get('NOMINEES_UNIQUE');
                const wikiUrls = maybeUrls
                    ? record.get('NOMINEES_UNIQUE').split(' ') 
                    : undefined;
                
                // console.log('wikiUrls',wikiUrls)

                // console.log('year',year)

                // Create Award entry if not exists
                await queries.createAward(year, AWARDS_BODY, category)
                    // .then(res => console.log('res',res))
                    // .catch(err => console.log('err',err))

                // console.log('createAward')

                // Get Award ID
                const { data: awardId } = await queries.getAwardId(year, AWARDS_BODY, category)
                    // .then(res => console.log('res',res))
                    // .catch(err => console.log('err',err))

                // console.log('awardId',a)

                // Validate one url per person
                if (people && people.length !== wikiUrls.length) {
                    console.error('THERE IS AN ERROR IN YOUR ENTRY', people, wikiUrls);
                    reject();
                    return;
                }
                
                // Create Movie entry if not exists
                await queries.createMovie(year, movieWikiUrl, title);

                // Get movie ID
                const { data: movieId } = await queries.getMovieId(movieWikiUrl);

                if (people) {
                    for (let i=0; i<people.length; i++) {
                        // Create Person entry if not exists
                        await queries.createPerson(wikiUrls[i], people[i]);

                        // Get Person ID
                        const { data: personId } = await queries.getPersonId(wikiUrls[i]);

                        // Create Nomination entry
                        await queries.createNomination(winner, personId, movieId, awardId);
                    }
                }
                resolve();
            }).catch(e=>console.error('error',e))
        });
        await Promise.all(promises)
        fetchNextPage();
    }, (err) => {
        if (err) console.error(err);
        return end();
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
        console.log('Category: ', CATEGORIES[i]);
        await uploadCategory(CATEGORIES[i]);
    }
}

loopThroughCategories();

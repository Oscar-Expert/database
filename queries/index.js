const db = require('../db/connect');

const queries = {};

////////////
// CREATE //
////////////

queries.createMovie = (year, movieWikiUrl, title) => new Promise((resolve, reject) => {
    db.query(`
        INSERT IGNORE INTO Movie
        (wikiUrl, title, year)
        VALUES
        ("${movieWikiUrl}", "${title}", ${year});
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes', data: res });
    })
}).catch(e=>console.error('error',e))


queries.createPerson = (wikiUrl, person) => new Promise((resolve, reject) => {
    db.query(`
        INSERT IGNORE INTO Person
        (wikiUrl, name)
        VALUES
        ("${wikiUrl}", "${person}")
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes', data: res });
    });
}).catch(e=>console.error('error',e))


queries.createNomination = (winner, personId, movieId, awardId) => new Promise((resolve, reject) => {
    db.query(`
        INSERT IGNORE INTO Nomination
        (winner, personId, movieId, awardId)
        VALUES
        (${winner}, ${personId}, ${movieId}, ${awardId})
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes', data: res });
    });
}).catch(e=>console.error('error',e))


queries.createAwardsBody = (name) => new Promise((resolve, reject) => {
    db.query(`
        INSERT IGNORE INTO AwardsBody
        (name)
        VALUES
        ("${name}")
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes', data: res });
    });
}).catch(e=>console.error('error',e))


queries.createAwardsCategory = (name) => new Promise((resolve, reject) => {
    db.query(`
        INSERT IGNORE INTO AwardsCategory
        (name)
        VALUES
        ("${name}")
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes', data: res });
    });
}).catch(e=>console.error('error',e))


queries.createAward = (year, awardsBodyId, awardsCategoryId) => new Promise((resolve, reject) => {
    db.query(`
        INSERT IGNORE INTO Award
        (year, awardsBodyId, awardsCategoryId)
        VALUES
        (${year}, ${awardsBodyId}, ${awardsCategoryId})
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes', data: res });
    });
}).catch(e=>console.error('error',e))


/////////
// GET //
/////////

queries.getMovieId = (wikiUrl) => new Promise((resolve, reject) => {
    db.query(`
        SELECT id FROM Movie
        WHERE wikiUrl="${wikiUrl}"
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        const id = Object.values(res[0])[0];
        if (res) resolve({ status: 'succes', data: id });
    })
}).catch(e=>console.error('error',e))

queries.getPersonId = (wikiUrl) => new Promise((resolve, reject) => {
    db.query(`
        SELECT id FROM Person
        WHERE wikiUrl="${wikiUrl}"
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        const id = Object.values(res[0])[0];
        if (res) resolve({ status: 'succes', data: id });
    })
}).catch(e=>console.error('error',e))

queries.getAwardsBodyId = (name) => new Promise((resolve, reject) => {
    db.query(`
        SELECT id FROM AwardsBody
        WHERE name="${name}"
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        const id = Object.values(res[0])[0];
        if (res) resolve({ status: 'succes', data: id });
    })
}).catch(e=>console.error('error',e))

queries.getAwardsCategoryId = (name) => new Promise((resolve, reject) => {
    db.query(`
        SELECT id FROM AwardsCategory
        WHERE name="${name}"
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        const id = Object.values(res[0])[0];
        if (res) resolve({ status: 'succes', data: id });
    })
}).catch(e=>console.error('error',e))

queries.getAwardId = (year, awardsBodyId, awardsCategoryId) => new Promise((resolve, reject) => {
    db.query(`
        SELECT * FROM Award
        WHERE year=${year}
        AND awardsBodyId=${awardsBodyId}
        AND awardsCategoryId=${awardsCategoryId}
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        const id = Object.values(res[0])[0];
        if (res) resolve({ status: 'succes', data: id });
    })
}).catch(e=>console.error('error',e))

module.exports = queries;
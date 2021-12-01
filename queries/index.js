const db = require('../db/connect');

const queries = {};

//////////////////////////
///////// CREATE /////////
//////////////////////////

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


queries.createAward = (year, awardsBody, awardsCategory) => new Promise((resolve, reject) => {
    db.query(`
        INSERT IGNORE INTO Award
        (year, awardsBody, awardsCategory)
        VALUES
        (${year}, "${awardsBody}", "${awardsCategory}")
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes', data: res });
    });
}).catch(e=>console.error('error',e))

///////////////////////////////
///////////// GET /////////////
///////////////////////////////

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


queries.getAwardId = (year, awardsBody, awardsCategory) => new Promise((resolve, reject) => {
    db.query(`
        SELECT * FROM Award
        WHERE year=${year}
        AND awardsBody="${awardsBody}"
        AND awardsCategory="${awardsCategory}"
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        const id = Object.values(res[0])[0];
        if (res) resolve({ status: 'succes', data: id });
    })
}).catch(e=>console.error('error',e))


///////////////////////////////
/////////// DELETE ////////////
///////////////////////////////

queries.deleteAllMovies = () => new Promise((resolve, reject) => {
    db.query(`
        DELETE FROM Movie
        WHERE id>0
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes' });
    })
}).catch(e=>console.error('error',e))


queries.deleteAllPeople = () => new Promise((resolve, reject) => {
    db.query(`
        DELETE FROM Person
        WHERE id>0
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes' });
    })
}).catch(e=>console.error('error',e))


queries.deleteAllAwards = () => new Promise((resolve, reject) => {
    db.query(`
        DELETE FROM Award
        WHERE id>0
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes' });
    })
}).catch(e=>console.error('error',e))


queries.deleteAllNominations = () => new Promise((resolve, reject) => {
    db.query(`
        DELETE FROM Nomination
        WHERE id>0
    `, (err, res) => {
        if (err) reject({ status: 'error', data: err });
        if (res) resolve({ status: 'succes' });
    })
}).catch(e=>console.error('error',e))


module.exports = queries;
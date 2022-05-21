
const frisby = require('frisby');

let SERVER_URL=""
if (process.env.CITIES_SERVER) {
    SERVER_URL=`http://${process.env.CITIES_SERVER}`
} else {
    SERVER_URL=`http://localhost:3000`
}

//Empties the current database.
const emptyDb = async () => {
    let res = await frisby.get(SERVER_URL);
    res.json.forEach(async continent => {
        await frisby.del(SERVER_URL + '/' + continent);
    })        
}


module.exports = {
    SERVER_URL: SERVER_URL,
    emptyDb: emptyDb
}

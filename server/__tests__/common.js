
let SERVER_URL=""
if (process.env.CITIES_SERVER) {
    SERVER_URL=`http://${process.env.CITIES_SERVER}`
} else {
    SERVER_URL=`http://localhost:3000`
}

module.exports = {
    SERVER_URL: SERVER_URL
}

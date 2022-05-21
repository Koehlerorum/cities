const frisby = require('frisby');
const Joi = require('joi');

let SERVER_URL=""
if (process.env.CITIES_SERVER) {
    SERVER_URL=`http://${process.env.CITIES_SERVER}`
} else {
    SERVER_URL=`http://localhost:3000`
}

describe('getContinents', function () {
    it('Returns a list of all continents', function () {
        return frisby.get(SERVER_URL)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', []);
    });

    it('Add a continent', function () {
        const continent = "africa";
        return frisby.post(SERVER_URL, continent)
            .expect('status', 200)
            .expect('header', 'Location', `/${continent}`)
            .then(res => {
                console.log("Res:", res);
            });
    });
});

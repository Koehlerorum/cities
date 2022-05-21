const frisby = require('frisby');
const Joi = require('joi');

let SERVER_URL=""
if (process.env.CITIES_SERVER) {
    SERVER_URL=`http://${process.env.CITIES_SERVER}`
} else {
    SERVER_URL=`http://localhost:3000`
}

describe('getContinents', function () {

    beforeAll(async () => {
        let res = await frisby.get(SERVER_URL);
        res.json.forEach(async continent => {
            await frisby.del(SERVER_URL + '/' + continent);
        })        
    });
    
    it('Returns a list of all continents', function () {
        return frisby.get(SERVER_URL)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', []);
    });

    it('Add a continent', function () {
        const continent = "africa";
        return frisby.post(SERVER_URL +`/?continentName=${continent}` )
            .expect('status', 200)
            .expect('header', 'Location', `/${continent}`)
            .then(res => {
                return frisby.get(SERVER_URL)
            })
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', [ continent ]);
    });

    it('Add a continent missing continentName', function () {
        return frisby.post(SERVER_URL)
            .expect('status', 400)
            .expect('json', {error:"Query parameter continentName missing"})
    });


    it('Add an existing continent', function () {
        const continent = "africa";
        return frisby.post(SERVER_URL +`/?continentName=${continent}` )
            .expect('status', 409)
            .expect('json', {error: `Continent ${continent} already exists.`} )
            .inspectBody()
    });

});

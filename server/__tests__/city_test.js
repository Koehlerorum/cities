const frisby = require('frisby')
const Joi = frisby.Joi;
const { SERVER_URL, emptyDb } = require('./common.js')


describe('CityTests', function () {

    const continent = "Europe"

    const country1 = "Sweden"
    const country2 = "France"

    beforeAll(async () => {
        await emptyDb();

        //Create a continent and two countries
        await frisby.post(`${SERVER_URL}/?continentName=${continent}` ).expect('status', 201)
        await frisby.post(`${SERVER_URL}/${continent}/?countryName=${country1}` ).expect('status', 201)
        await frisby.post(`${SERVER_URL}/${continent}/?countryName=${country2}` ).expect('status', 201)

        return frisby.get(`${SERVER_URL}/${continent}`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', Joi.array().length(2))
            .expect('json', [ country1, country2 ])
    });
    afterAll(emptyDb);

    it('Get an empty list of cities', function () {
        return frisby.get(`${SERVER_URL}/${continent}/${country1}`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', Joi.array().length(0))
    });


    it('Get a list of cities from unknown country', function () {
        const unknownCountry = "Spain";
        return frisby.get(`${SERVER_URL}/${continent}/${unknownCountry}`)
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', {error: `Country ${unknownCountry} does not exists.`})
    });


    it('Add a city to unknown country', function () {
        const unknownCountry = "Spain";
        return frisby.post(`${SERVER_URL}/${continent}/${unknownCountry}/?cityName=Stockholm`)
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', {error: `Country ${unknownCountry} does not exists.`})
    });

    it('Add a city missing city name', function () {
        const unknownCountry = "Spain";
        return frisby.post(`${SERVER_URL}/${continent}/${country1}/`)
            .expect('status', 400)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', {error: "Invalid parameter cityName"})
    });

    it('Add a city', function () {
        const city="Stockholm"
        return frisby.post(`${SERVER_URL}/${continent}/${country1}/?cityName=${city}`)
            .expect('status', 201)
            .expect('header', 'Location', `/${continent}/${country1}/${city}`)
            .then(res => {
                return frisby.get(`${SERVER_URL}/${continent}/${country1}`)
                    .expect('status', 200)
                    .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                    .expect('jsonTypes', Joi.array().length(1))
                    .expect('json', [ city ])
                    .then(res => {
                        //Makes sure the city is not shown under a wrong country.
                        return frisby.get(`${SERVER_URL}/${continent}/${country2}`)
                            .expect('status', 200)
                            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                            .expect('jsonTypes', Joi.array().length(0))
                    });
            });
    });

    it('Delete a city, unknown continent', function () {
        const unknownContinent="Asia"
        const city="Stockholm";
        return frisby.del(`${SERVER_URL}/${unknownContinent}/${country1}/${city}`)
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', {error: `Continent ${unknownContinent} does not exists.`})
    });

    it('Delete a city, unknown country', function () {
        const unknownCountry = "Spain";
        const city="Stockholm";
        return frisby.del(`${SERVER_URL}/${continent}/${unknownCountry}/${city}`)
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', {error: `Country ${unknownCountry} does not exists.`})
    });

    it('Delete a city, unknown country', function () {
        const unknownCity="Uppsala";
        return frisby.del(`${SERVER_URL}/${continent}/${country1}/${unknownCity}`)
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', {error: `City ${unknownCity} does not exists.`})
    });


    it('delete a city', function () {
        const city="Stockholm"
        return frisby.del(`${SERVER_URL}/${continent}/${country1}/${city}`)
            .expect('status', 200)
            .then(res => {
                return frisby.get(`${SERVER_URL}/${continent}/${country1}`)
                    .expect('status', 200)
                    .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                    .expect('jsonTypes', Joi.array().length(0))
                    .expect('json', [])
            });
    });

});

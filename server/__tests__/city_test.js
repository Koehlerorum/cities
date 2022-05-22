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
        await frisby.post(`${SERVER_URL}/?continentName=${continent}` )
        await frisby.post(`${SERVER_URL}/${continent}/?countryName=${country1}` )
        await frisby.post(`${SERVER_URL}/${continent}/?countryName=${country2}` )

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
            .expect('json', {error: "Query parameter cityName missing"})
    });

});

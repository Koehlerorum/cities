const frisby = require('frisby')
const Joi = frisby.Joi;
const { SERVER_URL, emptyDb } = require('./common.js')


describe('CountryTests', function () {

    const continent1 = "Europe"
    const continent2 = "Asia"

    const country1 = "Sweden"
    const country2 = "India"
    
    beforeAll(async () => {
        await emptyDb();
        //Create two continents
        await frisby.post(SERVER_URL +`/?continentName=${continent1}` )
        await frisby.post(SERVER_URL +`/?continentName=${continent2}` )
        return frisby.get(SERVER_URL)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', [ continent1, continent2 ])
    });
    afterAll(emptyDb);
    
    it('Get an empty list of countries', function () {
        return frisby.get(SERVER_URL + '/' + continent1)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', Joi.array().length(0))
    });

    it('Add countries', function () {
        return frisby.post(`${SERVER_URL}/${continent1}/?countryName=${country1}`)
            .expect('status', 200)
            .expect('header', 'Location', `/${continent1}/${country1}`)
            .then(res => {
                return frisby.post(`${SERVER_URL}/${continent2}/?countryName=${country2}`)
                    .expect('status', 200)
                    .expect('header', 'Location', `/${continent2}/${country2}`)
            })
    });

    it('get countries of continent1', function () {
        return frisby.get(`${SERVER_URL}/${continent1}`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', Joi.array().length(1))
            .expect('json', [ country1 ])
    });

    it('get countries of continent2', function () {
        return frisby.get(`${SERVER_URL}/${continent2}`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', Joi.array().length(1))
            .expect('json', [ country2 ])
    });

    it('Add country already exists', function () {
        return frisby.post(`${SERVER_URL}/${continent1}/?countryName=${country1}`)
            .expect('status', 409)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', {error: `Country ${country1} already exists.`} )
    });
});

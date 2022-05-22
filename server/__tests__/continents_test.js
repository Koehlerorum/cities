
const frisby = require('frisby');
const Joi = frisby.Joi;
const { SERVER_URL, emptyDb } = require('./common.js')


describe('ContinentsTests', function () {

    beforeAll(emptyDb);
    afterAll(emptyDb);

    it('Get a list of all continents (empty)', function () {
        return frisby.get(SERVER_URL)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', Joi.array().length(0));
    });

    it('Add a continent', function () {
        const continent = "africa";
        return frisby.post(`${SERVER_URL}/?continentName=${continent}` )
            .expect('status', 201)
            .expect('header', 'Location', `/${continent}`)
            .then(res => {
                return frisby.get(SERVER_URL)
                    .expect('status', 200)
                    .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                    .expect('jsonTypes', Joi.array().length(1))
                    .expect('json', [ continent ])
            })
    });

    it('Add a continent missing continentName', function () {
        return frisby.post(SERVER_URL)
            .expect('status', 400)
            .expect('json', {error:"Query parameter continentName missing"})
    });


    it('Add an existing continent', function () {
        const continent = "africa";
        return frisby.post(`${SERVER_URL}/?continentName=${continent}` )
            .expect('status', 409)
            .expect('json', {error: `Continent ${continent} already exists.`} )
    });

    it('Delete an existing continent', function () {
        const continent = "africa";
        return frisby.del(`${SERVER_URL}/${continent}` )
            .expect('status', 200)
            .then(res => {
                return frisby.get(SERVER_URL)
                    .expect('status', 200)
                    .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                    .expect('jsonTypes', Joi.array().length(0));
            });
    });

    it('Delete non existing continent', function () {
        const continent = "africa";
        return frisby.del(`${SERVER_URL}/${continent}` )
            .expect('status', 404)
            .expect('json', {error: `Continent ${continent} does not exists.`} )
    });

    it('Add multiple continents', function () {
        const continent1 = "asia";
        const continent2 = "africa";
        return frisby.post(`${SERVER_URL}/?continentName=${continent1}` )
            .expect('status', 201)
            .expect('header', 'Location', `/${continent1}`)
            .then(res => {
                return frisby.post(`${SERVER_URL}/?continentName=${continent2}` )
                    .expect('status', 201)
                    .expect('header', 'Location', `/${continent2}`)
                    .then(res => {
                        return frisby.get(SERVER_URL)
                            .expect('status', 200)
                            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                            .expect('jsonTypes', Joi.array().length(2))
                            .expect('json', [ continent1, continent2 ])
                    })
            });
    });
});

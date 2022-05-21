const frisby = require('frisby');
const { SERVER_URL, emptyDb } = require('./common.js')


describe('ContinentsTests', function () {
    
    beforeAll(emptyDb);
    afterAll(emptyDb);
    
    it('Returns a list of all continents', function () {
        return frisby.get(SERVER_URL)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('json', []);
    });

});

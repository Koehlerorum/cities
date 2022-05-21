const express = require('express');
const { World, Continent, Country } = require('./model.js')

const app = express();
const port = 3000;

class ExpressError extends Error {
    constructor(status, statusMessage){
        super(statusMessage);
        this.status = status;
    }
}
class InvalidParameter extends ExpressError {
    constructor(statusMessage){
        super(400, statusMessage);
    }
};

class AlreadyExists extends ExpressError {
    constructor(statusMessage){
        super(409, statusMessage);
    }
};

class NotFound extends ExpressError {
    constructor(statusMessage){
        super(404, statusMessage);
    }
};

let world = new World();

app.get('/', (req, res) => {
    res.json(world.continents());
})


app.post('/', (req, res) => {
    if(!req.query.continentName){
        throw new InvalidParameter("Query parameter continentName missing");            
    }
    world.addContinent(req.query.continentName);
    res.set("Location", `/${req.query.continentName}`);
    res.send("");
})

app.get('/:continent', (req, res) => {
    let continent = world.continent(req.params.continent);
    res.json(continent.countries());
})

app.post('/:continent', (req, res) => {
    let continent = world.continent(req.params.continent);
    continent.addCountry(req.query.countryName);
    res.set("Location", `/${req.params.continent}/${req.query.countryName}`);
    res.send("");
})

app.delete('/:continent', (req, res) => {
    world.deleteContinent(req.params.continent);
    res.send("");
})

app.get('/:continent/:country', (req, res) => {
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    res.json(country.cities());
})

app.delete('/:continent/:country', (req, res) => {
    let continent = world.continent(req.params.continent);
    continent.deleteCountry(req.params.country);
    res.send("");
})

app.post('/:continent/:country', (req, res) => {
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    country.addCity(req.query.cityName);
    res.set("Location", `/${req.params.continent}/${req.params.country}/${req.query.cityName}`);
    res.send("");
})

app.delete('/:continent/:country/:city', (req, res) => {
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    country.deleteCity(req.params.city);
    res.send("");
})


//Error Handler
app.use((err, req, res, next) => {

    console.log(err);
    res.status(err.status).send({ error: err.message });
    
})


app.listen(port, () => {
    console.log(`Cities applicatio ${port}`)
})

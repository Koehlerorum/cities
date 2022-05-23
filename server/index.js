const express = require('express');
const { query, validationResult} = require('express-validator');
const cors = require('cors')
const { World, Continent, Country } = require('./model.js')
const { InvalidParameter, AlreadyExists, NotFound } = require('./errors.js')

const app = express();
app.use(cors())
const port = 3000;
let world = new World();

app.get('/', (req, res) => {
    res.json(world.continents());
})


app.post('/',
         query('continentName').isAlpha("en-US", { ignore: " " }),
         (req, res) => {
    validationResult(req).throw();

    console.log(`POST ${req.path}`);

    world.addContinent(req.query.continentName);
    res.set("Location", `/${req.query.continentName}`);
    res.status(201).send("");
})

// Input parameter is not validated. Invalid input will just lead to 404 error.
app.get('/:continent',
        (req, res) => {
    console.log(`GET ${req.path}`);
    
    let continent = world.continent(req.params.continent);
    res.json(continent.countries());
})

app.post('/:continent',
         query('countryName').isAlpha("en-US", { ignore: " " }),
         (req, res) => {
    validationResult(req).throw();
    console.log(`POST ${req.path}`);
    
    let continent = world.continent(req.params.continent);
    continent.addCountry(req.query.countryName);
    res.set("Location", `/${req.params.continent}/${req.query.countryName}`);
    res.status(201).send("");
})

// Input parameter is not validated. Invalid input will just lead to 404 error.
app.delete('/:continent', (req, res) => {
    console.log(`DELETE ${req.path}`);
    
    world.deleteContinent(req.params.continent);
    res.send("");
})

// Input parameters are not validated. Invalid input will just lead to 404 error.
app.get('/:continent/:country', (req, res) => {
    console.log(`GET ${req.path}`);
    
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    res.json(country.cities());
})

// Input parameters are not validated. Invalid input will just lead to 404 error.
app.delete('/:continent/:country', (req, res) => {
    console.log(`DELETE ${req.path}`);
    
    let continent = world.continent(req.params.continent);
    continent.deleteCountry(req.params.country);
    res.send("");
})

app.post('/:continent/:country',
         query('cityName').isAlpha("en-US", { ignore: " " }),
         (req, res) => {
    console.log(`POST ${req.path}`);
    
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    country.addCity(req.query.cityName);
    res.set("Location", `/${req.params.continent}/${req.params.country}/${req.query.cityName}`);
    res.status(201).send("");
})

// Input parameters are not validated. Invalid input will just lead to 404 error.
app.delete('/:continent/:country/:city', (req, res) => {
    console.log(`DELETE ${req.path}`);
    
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    country.deleteCity(req.params.city);
    res.send("");
})


//Error Handler
app.use((err, req, res, next) => {
    let status = 500;
    if (err.status !== undefined){
        status = err.status;
    } else if (err.errors !== undefined) {
        //express-validator error
        status = 400;
        let errorItem = err.errors[0];
        err.message = `Invalid ${errorItem.location} parameter ${errorItem.param}`
    }
    console.log("Request error:", status, err.message);
    res.status(status).send({ error: err.message });
})


app.listen(port, () => {
    console.log(`Cities application is at port ${port}`)
})

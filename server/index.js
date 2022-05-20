const express = require('express');
const app = express();
const port = 3000;


class ExpressError extends Error {
    constructor(status, statusMessage){
        super(statusMessage);
        this.status = status;
        this.statusMessage = statusMessage;
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

//Faux database
class Country {
    constructor(name){
        this.name = name;
        this.citiesMap = new Map();
    }

    addCity(cityName){
        this.citiesMap.set(cityName, cityName);
    }

    cities(){
        return Array.from(this.citiesMap.keys());
    }
}

class Continent {
    constructor(name){
        this.name = name;
        this.countriesMap = new Map();
    }

    addCountry(countryName){
        if(!countryName || ! countryName instanceof String) {
            throw new InvalidParameter("Invalid parameter");
        } else if (this.countriesMap.has(countryName)){
            throw new AlreadyExists(`Country ${countryName} already exists.`);
        } else {
            this.countriesMap.set(countryName, new Country(countryName));
        }
    }

    countries(){
        return Array.from(this.countriesMap.keys());
    }

    country(countryName){
        if (!countryName || ! countryName instanceof String){
            throw new InvalidParameter("Invalid parameter continent");
        } else if (!this.countriesMap.has(countryName)){
            throw new NotFound(`Country ${countryName} does not exists.`);
	}
        return this.countriesMap.get(countryName);
    }
}


class World {

    constructor(){
        this.continentsMap = new Map();
    }

    addContinent(name){
        if(!name || ! name instanceof String) {
            throw new InvalidParameter("Invalid parameter");
        } else if (this.continentsMap.has(name)){
            throw new AlreadyExists(`Continent ${name} already exists.`);
        } else {
            this.continentsMap.set(name, new Continent(name));
        }	
    }

    continents() {
        return Array.from(this.continentsMap.keys());
    }

    continent(continentName){
        if (!continentName || ! continentName instanceof String){
            throw new InvalidParameter("Invalid parameter continent");
        } else if (!this.continentsMap.has(continentName)){
            throw new NotFound(`Continent ${continentName} does not exists.`);
        }
        return this.continentsMap.get(continentName);
    }
}

let world = new World();

app.get('/', (req, res) => {
    res.send(JSON.stringify(world.continents()));
})


app.post('/', (req, res) => {
    if(!req.query.continentName){
        throw new InvalidParameter("Query parameter continentName missing");            
    } else {
        world.addContinent(req.query.continentName);
        res.send("");
    }      
})

app.get('/:continent', (req, res) => {
    let continent = world.continent(req.params.continent);
    res.send(JSON.stringify(continent.countries()));
})

app.post('/:continent', (req, res) => {
    let continent = world.continent(req.params.continent);
    continent.addCountry(req.query.countryName);
    res.send("");
})

app.get('/:continent/:country', (req, res) => {
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    res.send(JSON.stringify(country.cities()));
})

app.post('/:continent/:country', (req, res) => {
    let continent = world.continent(req.params.continent);
    let country = continent.country(req.params.country);
    country.addCity(req.query.cityName);
    res.send("");
})


app.listen(port, () => {
    console.log(`Cities applicatio ${port}`)
})

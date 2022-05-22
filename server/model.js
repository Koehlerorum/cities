
const { InvalidParameter, AlreadyExists, NotFound } = require('./errors.js')


//Faux database
class Country {
    constructor(countryName){
        this.name = countryName;
        this.citiesMap = new Map();
    }

    addCity(cityName){
        this.citiesMap.set(cityName, cityName);
    }

    cities(){
        return Array.from(this.citiesMap.keys());
    }

    deleteCity(cityName){
        if (!cityName || ! cityName instanceof String){
            throw new InvalidParameter("Invalid parameter continent");
        } else if (!this.citiesMap.has(cityName)){
            throw new NotFound(`City ${cityName} does not exists.`);
	}
        return this.citiesMap.delete(cityName);

    }
}

class Continent {
    constructor(continentName){
        this.name = continentName;
        this.countriesMap = new Map();
    }

    addCountry(countryName){
        if(!countryName || ! countryName instanceof String) {
            throw new InvalidParameter("Invalid parameter: countryName.");
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

    deleteCountry(countryName){
        if (!countryName || ! countryName instanceof String){
            throw new InvalidParameter("Invalid parameter continent");
        } else if (!this.countriesMap.has(countryName)){
            throw new NotFound(`Country ${countryName} does not exists.`);
	}
        return this.countriesMap.delete(countryName);
    }
}


class World {

    constructor(){
        this.continentsMap = new Map();
    }

    addContinent(continentName){
        if(!continentName || ! continentName instanceof String) {
            throw new InvalidParameter("Invalid parameter: continentName");
        } else if (this.continentsMap.has(continentName)){
            throw new AlreadyExists(`Continent ${continentName} already exists.`);
        } else {
            this.continentsMap.set(continentName, new Continent(continentName));
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

    deleteContinent(continentName){
        if (!continentName || ! continentName instanceof String){
            throw new InvalidParameter("Invalid parameter continent");
        } else if (!this.continentsMap.has(continentName)){
            throw new NotFound(`Continent ${continentName} does not exists.`);
        }
        this.continentsMap.delete(continentName);
    }
}

module.exports = {
    World: World,
    Continent: Continent,
    Country: Country
};

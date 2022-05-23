# Cities web service

## General

## Usage

The service can be launched from the root of the service with command:

> $ docker-compose up

When the service is running the automated tests can be run by issuing
the following command from the root of the repository:

> $ docker-compose run -e CITIES_SERVER=<your host IP address>:3000 cities npm run test
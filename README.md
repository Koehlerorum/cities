# Cities web service

## General

## Usage

The service can be launched from the root of the repository with command:

> $ docker-compose up

When the service is running the automated tests can be run by issuing
the following command from the root of the repository:

> $ docker-compose run -e CITIES_SERVER=<your host IP address>:3000 cities npm run test

## API Documentation and Manual Testing

The API of the service is documented using OpenAPI format. The
documentation can be found in *api.yml* file in the root of this
repository.

You can read and test the API easily using [Swagger.io
editor](https://editor.swagger.io/). In the editor select
**File->Import file** and select act upload *api.yml* to the
service. After this each API can be tested by:

1. Expanding the API under test,
1. Clicking **Try it out**,
1. Inputing parameters and
1. Clicking Execute


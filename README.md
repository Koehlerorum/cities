# Cities web service

## General

## Limitations

This software is not meant for production. It has many limitations
that prevents it to be useful in any real world scenarios. Most
notable, this service:

- Does not save any persistent data. All of the saved data is
  discarded when the service quits.
- Does not have even basic security features. All communication is
  done purely using plain HTTP and there is no authentication.
- Does not have independent tests. The automated tests rely on
  the certain order of execution of the tests. Test suites are
  independent of each other, but they cannot be run in parallel
- Does not have automated tests for production environment.
  Execution of the tests wipes all the data saved to the service.

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
1. Clicking **Execute**


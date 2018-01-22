# **Genesis** Microservice

[![Build Status](https://travis-ci.org/zephinzer/genesis.svg?branch=master)](https://travis-ci.org/zephinzer/genesis) [![Maintainability](https://api.codeclimate.com/v1/badges/888a37dfeefee615573d/maintainability)](https://codeclimate.com/github/zephinzer/genesis/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/888a37dfeefee615573d/test_coverage)](https://codeclimate.com/github/zephinzer/genesis/test_coverage)

Genesis is a base Docker image that can be used to efficiently roll an application destined for deployment in a microservices achitecture.

- [Usage](#usage)
- [Routes](#routes)
- [Database](#database)
- [Application Architecture](#application-architecture)
- [Support Endpoints](#support-endpoints)
- [Deployment Configuration](#deployment-configuration)
- [Contributing](#contributing)

## Features Thus Far

✅ environment variable based configurations
✅ liveness probe endpoint
✅ readiness probe endpoint
✅ prometheus metrics endpoint
✅ basic auth protection for metrics endpoint
✅ cross-origin-resource-sharing (cors) management
✅ gzip compression of responses
✅ header stripping
✅ server access logging
✅ out-of-the-box database connection
❌ logs streaming system for logs collators
❌ cross-site-request-forgery protection

## Usage
To use Genesis in your project, create a `Dockerfile` with the following contents:

```Dockerfile
FROM zephinzer/genesis:latest
COPY . /app
ENTRYPOINT ["npm", "start"]
```

In the same directory, create a `./routes` directory. This holds your custom routes. Each route file should export either an object or a middleware:

## Routes

### Object Route
An object route should export a function that returns an object which has properties corresponding to the HTTP methods. For example:

```javascript
module.exports = () => ({
  get: (req, res) => { /* ... */ },
  post: (req, res) => { /* ... */ },
  put: (req, res) => { /* ... */ },
  patch: (req, res) => { /* ... */ },
  delete: (req, res) => { /* ... */ },
  // ...
})
```

### Middleware Route
A middleware route should export a function that returns the Express middleware. For example:

```javascript
module.exports = () =>
  (req, res) => { /* ... */ };
```

### Route Naming
To achieve a route structure of the following routes:

- `GET /object_a`
- `GET /object_a/:id`
- `POST /object_a/*`
- `GET /`

The directory structure would look like:

```
- {index}.js
- /object_a.js
- /object_a
  - {_}id.js
  - {star}.js
```

`{_}` is mapped to `':'`, `{index}` is mapped to `''` and `{star}` is mapped to `'*'`.

### Further Reading

See https://github.com/zephinzer/express-diroutes for more information on the route generation from the directory structure.

## Database

### Migrations

Create a new directory called `db` and create a sub-directory in there named `migrations`. New migrations can be placed in that directory and will automatically be run.

**TODO: update after trying it out**

### Seeds 

Create a new directory called `db` and create a sub-directory in there named `seeds`. New seed files can be placed in that directory and will automatically be run.

**TODO: update after trying it out**

## Application Architecture

## Support Endpoints

### GET `/metrics`
> Basic Auth protected. This endpoint can be [configured using an environment variable](#metrics_endpoint)
Exposes the Prometheus metrics.

### GET `/healthz`
> This endpoint can be [configured using an environment variable](#health_check_endpoint) for customisation purposes

Exposes a health-check (`livenessProbe`) for container orchestration systems to call.

Returns `HTTP 200` with a JSON response body of `"ok"` when all is good.

### GET `/readyz`
> This endpoint can be [configured using an environment variable](#readiness_check_endpoint) for customisation purposes

Exposes a readiness-check (`readinessProbe`) for container orchestration systems to call. We currently check for:

- database configuration error
- database client specification error
- database connection error

Returns `HTTP 200` with a JSON response body of `"ok"` when all is good.

Returns `HTTP 500` with a JSON response body of all errors when something is wrong.

## Deployment Configuration

### `ALLOWED_ORIGINS`
When this is defined, Cross-Origin-Resource-Sharing (CORS) is activated. If the value is an empty string, all origins will be allowed, otherwise, CORS is activated for the specified domains delimited by a comma.

When left undefined, Cross-Origin-Resource-Sharing is disabled.

> Defaults to `undefined`.

### `BASIC_AUTH_USERS`
When this is defined, basic auth will be applied to the following endpoints:

- `/metrics`

The value for this environment variable should be an array of `username:password`s separated by commas. An example:

```
BASIC_AUTH_USERS=user1:password1,user2:password2
```

The above will create two users, `user1` and `user2`, with their respective passwords.

> Defaults to `undefined`.

### `DB_CLIENT`
Defines the client we should be connecting to the database with. This can be one of:

- `mysql` (MySQL)
- `mysql2` (MySQL)
- `sqlite3` (SQLite)
- `pg` (PostgreSQL)
- `mariasql` (MariaDB)
- `oracle` (OracleDB)
- `mssql` (MSSQL)

> Defaults to `"mysql2"`.

### `DB_CONNECTION_POOL_MAX`
Defines the maximum number of connections we should maintain with the database.

> Defaults to `10`.

### `DB_CONNECTION_POOL_MIN`
Defines the minimum number of connections we should maintain with the database.

> Defaults to `2`.

### `DB_CONNECTION_URL`
Defines a connection URL.

> Defaults to an object defining the database host (`DB_HOST`), database port (`DB_PORT`), database schema (`DB_SCHEMA`), database user (`DB_USER`) and the password for the user (`DB_PASSWORD`).

### `DB_HOST`
Defines the database host we should be connecting to. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"localhost"`.

### `DB_MIGRATIONS_TABLE_NAME`
Defines the name for the database migration table we will be using.

> Defaults to `"db_migrations_list"`.

### `DB_PASSWORD`
Defines the password for the database user defined in the `DB_USER` environment variable. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"genesis"`.

### `DB_PORT`
Defines the database port we should be connecting to. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `3306`.

### `DB_SCHEMA`
Defines the database schema we should be using. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"genesis"`.

### `DB_USER`
Defines the database user we should be using. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"genesis"`.

### `HEALTH_CHECK_ENDPOINT`
Defines the endpoint for health checks to be done on.

> Defaults to `/healthz`.

### `METRICS_ENDPOINT`
Defines the endpoint for metrics.

> Defaults to `/metrics`.

### `NODE_ENV`
Defines the environment we are running in.

Valid values are `"development"` or `"production"`. If it is neither, the server assumes `"development"`

> Defaults to `"development"`.

### `PORT`
Defines the port which the server should listen on.

> Defaults to 4000.

### `READINESS_CHECK_ENDPOINT`
Defines the endpoint for readiness checks to be done on.

> Defaults to `/readyz`.

### `REALM`
Specifies the realm for basic authentication.

> Defaults to `"genesis"`.

## Notes On Contributing

### Linting
We use ESLint to maintain code conventions and quality. To run the linter:

```bash
npm run eslint;
```

See the [Travis CI script](./.travis.yml) for more info.

### Functional Testing
Two types of tests are present in our tests. The first is unit tests which are most of tests you will see. The second is systems tests which simulates execution of the server and running queries against it - this is found in the `server.test.js`.

We use `mocha`, `chai`, `sinon` and `supertest` to validate functional behaviour of the service.

To run the tests:

```bash
npm run mocha;
```

To run it in development which adds watching and allows for `.only` and `xit` keywords:

```bash
npm run mocha-watch;
```

See the [Travis CI script](./.travis.yml) for more info.

### Running Locally
During development, we try to keep the feedback loop short, so we avoid running genesis in a Docker container.

#### Database In Development
Run the database alone using:

```bash
npm run db-development
```

The above command starts the database and builds the development image so that we can do a database migration and seed. If the database migration/seed files are changed, you will have to run the above command again to get the correct version of your database schema.

#### Running Application In Development
In development, we can use a live-reload tool such as `nodemon` which watches for file changes and reloads the application when any changes are detected. This allows us to write code, save it and have our server reflect the newly acquired behaviour. To activate this, use:

```bash
npm run dev
```

#### Configuring During Development
The file `./.env` contains configurations that assume a database is running on the local computer. This database can be either a local MySQL instance, or you can spin it up using `docker-compose` using `npm run db-development` as shown above.

### Building
To create a development build, run:

```bash
npm run build -- development
```

To create a production build, run:

```bash
npm run build -- production
```

Building has no real use, we only use it in the Travis pipeline to push to DockerHub.

### Contribution Flow

#### Raise Issue
[Start an issue](https://github.com/zephinzer/genesis/issues) so that everyone knows what you're working on. It'll suck if someone was doing the same thing you did and only one person's code will be merged in.

You can also assign the issue to yourself if you are taking up the work.

#### Fork & Build
Fork this repository and make your changes in your `master` branch. After making your changes:

1. **Update the `README.md`** for the changes you have made
2. **Add yourself as a contributor** to the `package.json` file (yay)
3. **Write/rewrite the tests for components you've changed** - think of the tests as functional specifications so that if someone needs to see how something is used, they can refer to the tests.
4. **Add an appropriate version bump** - use `[major version bump]` for a major version bump and `[minor version bump]` for a minor one according to the [SEMVER](https://semver.org/) specification. Patch versions are automatically bumped if none of those tags are available.

#### Merge Request
Done making changes? Submit a Pull Request and let the Travis CI pipeline pass. On passing, your code will be reviewed using the Code Climate statistics as well as a human check to ensure leaness and maintainability.

- - -

# Cheers!

For reading till the end, here's a potato.

![potato](https://cdn.shopify.com/s/files/1/1017/2183/t/2/assets/live-preview-potato.png?4839514862613583315)
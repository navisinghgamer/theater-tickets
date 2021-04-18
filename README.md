# theater-tickets

A backend REST API based control panel for the theater ticket system.

## Setup

First, you'll need to install a supported version of Node:

- [Node.js](https://nodejs.org/en/) at v10.16 or greater

Additionally, we assumes that you are comfortable with certain
technologies, languages and concepts.

- JavaScript (ES6)
- [REST](http://www.restapitutorial.com/lessons/whatisrest.html)

(Optional) Lastly, you'll need to install the LoopBack 4 CLI toolkit:

```sh
npm i -g @loopback/cli
```

## Install dependencies

Run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Setup .env variables

.env.sample file is included, just clone this file to .env file and add the required values for the variables.

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:8080 in your browser.

## Run the application in Docker

Run the given below command to build the image

```sh
npm run docker:build
```

Run the following command to start it

```sh
npm run docker:run
```

Open http://127.0.0.1:8080 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Tests

```sh
npm test
```

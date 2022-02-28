## API-POC Members

### Architecture
SOLID Singleton architecture with 3 layers / MCM / Monolitic

### Structure files
📦api-poc <br />
 ┣ 📂src <br />
 ┃ ┣ 📂middlewares <br />
 ┃ ┃ ┣ 📜apikey.middleware.ts <br />
 ┃ ┃ ┗ 📜authentication.middleware.ts <br />
 ┃ ┣ 📂modules <br />
 ┃ ┃ ┗ 📂v1 <br />
 ┃ ┃ ┃ ┣ 📂controllers <br />
 ┃ ┃ ┃ ┃ ┗ 📜member.controller.ts <br />
 ┃ ┃ ┃ ┣ 📂interfaces <br />
 ┃ ┃ ┃ ┃ ┗ 📜request.interface.ts <br />
 ┃ ┃ ┃ ┣ 📂middlewares <br />
 ┃ ┃ ┃ ┃ ┗ 📜member.middleware.ts <br />
 ┃ ┃ ┃ ┣ 📂models <br />
 ┃ ┃ ┃ ┃ ┗ 📜member.model.ts <br />
 ┃ ┃ ┃ ┣ 📂routes <br />
 ┃ ┃ ┃ ┃ ┗ 📜member.route.ts <br />
 ┃ ┃ ┃ ┣ 📂test <br />
 ┃ ┃ ┃ ┃ ┣ member.spec.ts <br />
 ┃ ┃ ┃ ┗ 📂schemas <br />
 ┃ ┃ ┃ ┃ ┣ 📜login.schema.ts <br />
 ┃ ┃ ┃ ┃ ┗ 📜member.schema.ts <br />
 ┃ ┣ 📂services <br />
 ┃ ┃ ┣ 📜jwt.service.ts <br />
 ┃ ┃ ┣ 📜response-handler.service.ts <br />
 ┃ ┃ ┣ 📜mongoose.service.ts <br />
 ┃ ┃ ┣ 📜validator.service.ts <br />
 ┃ ┃ ┗ 📜winston.service.ts <br />
 ┃ ┣ 📂utils <br />
 ┃ ┗ 📜app.ts <br />
 ┣ 📜.env <br />
 ┣ 📜.gitignore <br />
 ┣ 📜README.md <br />
 ┣ 📜index.ts <br />
 ┣ 📜nodemon.json <br />
 ┣ 📜package-lock.json <br />
 ┣ 📜package.json <br />
 ┗ 📜tsconfig.json <br />

## Requirements

NodeJS Version: 14.17.3 <br />
NPM Version: 6.14.13 <br />
MongoDB Version: 5.0.6 <br />

## Steps

1. Install NodeJS and MongoDB Server
2. Set enviroment variables configuration
    - `./.env`
2. Install dependencies
    - `npm install`
4. Run project
    - `npm run dev` (This command automatically CREATES the necessary COLLECTIONS into DATABASE) this mode is developer mode if you need to run in production mode please check section "Build and run in JavaScript"

## Admin Credentials
email: root@admin.com <br />
passw: admin123

## Build and run in JavaScript
- Transform TypeScript to JavaScript with: `npm run build` this will create a folder `./dist` with project in JavaScript<br />
- Run project in JavaScript with `npm start`<br />
## Unit Test
Run unit test: <br />
    - start test: `npm run test`<br />
    - generate coverage report: `npm run test-report`<br />
You can find the coverage report at `./coverage` once generated<br />

## Notes:
- This is a base structure project and continue in development.<br />
- This effort took about 22 Hours.<br />
- Unit Tests are in progress but someones are ready!.<br />
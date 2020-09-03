# NGO Directory

An app to list all Non-Governmental/Non-Profit Organization across the world.

## The folder structure

![Alt text](./uploads/readme/folder-structure-2.png?raw=true 'Folder Structure')

## Docker

Make sure you have a running container for mongo and redis(only if using redis). comment out redis in code if you are not goint to need it.

![Alt text](./uploads/readme/docker-ps.png?raw=true 'Folder Structure')

## Development

The first time, you will need to run

`npm install`

Then just start the server with

`npm run dev`

It uses nodemon for live reloading

# Lint

lint src folder

`npm run lint`

lint test folder

`npm run lint-test`

![Alt text](./uploads/readme/eslint-log.png?raw=true 'eslint fix output')

## Unit and Integration Test

You will need to run

`npm run test`

![Alt text](./uploads/readme/test-output.png?raw=true 'Example ouput for unit and integration test')

# NGO Directory

An app to list all Non-Governmental/Non-Profit Organization across the world.

## The folder structure

![Alt text](./uploads/readme/folder-structure-2.png?raw=true 'Folder Structure')

## Docker - mongo and redis container for development

Make sure you have a running container for mongo and redis(only if using redis). comment out redis in code if you are not goint to need it.

![Alt text](./uploads/readme/docker-ps.png?raw=true 'Docker')

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

## Production

start the server with

`npm start`

![Alt text](./uploads/readme/npm-start.png?raw=true 'production')

show logs

`pm2 logs globedrop`

![Alt text](./uploads/readme/logs.png?raw=true 'logs')

restart server

`pm2 restart globedrop`

stop server

`pm2 stop globedrop`

## Docker Deployment

This will be ideal if using a third party database like Mongo Atlas

`docker build -t <your username>/globedrop .`

`docker run -p 3000:3000 -d <your username>/globedrop`

If you need to go inside the container you can use the exec command:

`docker exec -it <container id> bash`

using PM2 inside Container

`pm2 list`

show logs for running server

`pm2 logs 0`

![Alt text](./uploads/readme/container-pm2-logs.png?raw=true 'container pm2 logs')

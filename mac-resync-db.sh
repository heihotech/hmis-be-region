#!/bin/bash
# pm2 stop be-region
# pm2 del be-region
yarn sequelize db:migrate:undo:all
yarn sequelize db:migrate
yarn sequelize db:seed:all --debug
# pm2 start server.js --name "be-region" 
#!/bin/bash
pm2 stop be-region
pm2 del be-region
sequelize-cli db:migrate:undo:all
sequelize-cli db:migrate
sequelize-cli db:seed:all --debug
pm2 start server.js --name "be-region" 
#!/bin/bash
pm2 stop be-region
pm2 del be-region
pm2 start server.js --name "be-region" 
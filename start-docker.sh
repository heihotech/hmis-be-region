#!/bin/bash
docker stop be-region
docker container prune -f
docker image rm simrs/be-region:latest -f
docker build -t simrs/be-region:latest .
docker run -p 3000:3000 --restart=always --name be-region -d simrs/be-region:latest
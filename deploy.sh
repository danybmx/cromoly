#!/bin/bash
git fetch --all
git reset --hard origin/deployment
git checkout deployment
git pull

docker-compose -f docker-compose-prod.yml restart

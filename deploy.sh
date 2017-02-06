#!/bin/bash
git fetch --all
git reset --hard origin/master
git checkout master
git pull

docker-compose -f docker-compose-prod.yml restart

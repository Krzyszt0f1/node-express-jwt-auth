#! /bin/bash

mongoimport --host mongodb --db users --collection users --type json --file /mongo-seed/users.json --jsonArray
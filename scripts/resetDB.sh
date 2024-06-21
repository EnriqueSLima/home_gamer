#!/bin/bash

rm models/home-gamer-sqlite

node scripts/createAdmin.js

node scripts/seed.js

npm start

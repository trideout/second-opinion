#!/bin/bash

composer install
npm install
./vendor/bin/sail up --build &
./vendor/bin/sail php artisan migrate &
npm run dev

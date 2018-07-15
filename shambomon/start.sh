#!/bin/bash

export PORT=5102

cd ~/www/shambomon
./bin/shambomon stop || true
./bin/shambomon start

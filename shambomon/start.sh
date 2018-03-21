#!/bin/bash

export PORT=5104

cd ~/www/shambomon
./bin/shambomon stop || true
./bin/shambomon start

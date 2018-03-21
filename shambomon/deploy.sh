#!/bin/bash

export PORT=5104
export MIX_ENV=prod
export GIT_PATH=/home/shambomon/src/shambomon 

PWD=`pwd`
if [ $PWD != $GIT_PATH ]; then
	echo "Error: Must check out git repo to $GIT_PATH"
	echo "  Current directory is $PWD"
	exit 1
fi

if [ $USER != "shambomon" ]; then
	echo "Error: must run as user 'shambomon'"
	echo "  Current user is $USER"
	exit 2
fi

mix deps.get
(cd assets && npm install)
(cd assets && ./node_modules/brunch/bin/brunch b -p)
mix phx.digest
mix release --env=prod

mkdir -p ~/www
mkdir -p ~/old

NOW=`date +%s`
if [ -d ~/www/shambomon ]; then
	echo mv ~/www/shambomon ~/old/$NOW
	mv ~/www/shambomon ~/old/$NOW
fi

mkdir -p ~/www/shambomon
REL_TAR=~/src/shambomon/_build/prod/rel/shambomon/releases/0.0.1/shambomon.tar.gz
(cd ~/www/shambomon && tar xzvf $REL_TAR)

crontab - <<CRONTAB
@reboot bash /home/shambomon/src/shambomon/start.sh
CRONTAB

#. start.sh

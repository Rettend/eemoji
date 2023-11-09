#!/bin/sh
NODE_PATH=$(npm root -g)
LOCAL_PATH=$(npm root)

if [ -f "$NODE_PATH/eemoji/bin/eemoji.mjs" ]; then
  node "$NODE_PATH/eemoji/bin/eemoji.mjs" run $1
elif [ -f "$LOCAL_PATH/eemoji/bin/eemoji.mjs" ]; then
  node "$LOCAL_PATH/eemoji/bin/eemoji.mjs" run $1
else
  echo "eemoji is not properly installed locally or globally"
  exit 1
fi

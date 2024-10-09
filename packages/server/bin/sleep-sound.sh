#! /usr/bin/env bash

# https://stackoverflow.com/a/246128
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

for (( i=0; i < 4; i++ ))
do
  mplayer -quiet -volume 150 $SCRIPT_DIR/../../client/src/assets/cricket.mp3
done

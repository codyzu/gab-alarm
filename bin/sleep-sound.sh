#! /usr/bin/env bash

for (( i=0; i < 4; i++ ))
do
  mplayer -quiet -volume 150 ./client/src/assets/cricket.mp3
done

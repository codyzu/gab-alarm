#! /usr/bin/env sh

for (( i=0; i < 4; i++ ))
do
  mplayer -quiet -volume 150 ./client/src/assets/rooster.mp3
done

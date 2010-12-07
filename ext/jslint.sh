#!/bin/bash
# This script will use jslint4java to run jslint against the given file.
VERSION='1.4.4'
BIN_NAME='jslint4java'
SCRIPT=`readlink -f $0`
SCRIPT_PATH=`dirname $SCRIPT`

JSLINT="${SCRIPT_PATH}/${BIN_NAME}-${VERSION}/${BIN_NAME}-${VERSION}.jar"
#Add --safe to ensure the given javascript code is "AD safe"
OPTS="--white --onevar --undef --eqeqeq --immed --plusplus --bitwise --regexp --forin --nomen --newcap"

find $1 -name "*.js" -print | xargs -n 1 java -jar $JSLINT $OPTS

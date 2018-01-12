#!/bin/sh

BASEDIR=$(dirname "$0")
RUSTDOC="$BASEDIR/rustdoc.sh" cargo doc $@
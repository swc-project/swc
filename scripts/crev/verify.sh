#!/usr/bin/env bash
#
# Script used to verify the depdencies of the project.
#

set -eu


cargo crev verify --show-latest-trusted --skip-verified --recursive | grep 'none'
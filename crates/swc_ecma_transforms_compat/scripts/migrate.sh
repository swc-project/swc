#!/usr/bin/env bash
set -eux

(cd tests && sg -p 'test!($$$ARGS)' -l rs)

#!/bin/bash

####################
# Usage
#
# build.sh $node_version $abi_version
#
# e.g. build.sh 11 67
####################
set -e

if [[ -z "$APPVEYOR" ]] && [[ "$TRAVIS_OS_NAME" != "windows" ]] ; then
    source ~/.nvm/nvm.sh
else
    echo "Deleting artifacts.json"
    rm -rf ./native/artifacts.json
fi
echo "Switching to node v$1 ($2)"
echo "Intsalling node $1"
nvm install $1 || true
echo "nvm use $1"
nvm use --delete-prefix $1

# Bypasses https://github.com/neon-bindings/neon/issues/384
echo 'Removing old files'

rm -rf ./native/index.node \
    ./native/target/release/libffi.d* \
    ./native/target/release/ffi.d* \
    ./native/target/release/build/ffi* \
    ./native/target/release/.fingerprint/neon* \
    ./native/target/release/deps/ffi* \
    ./native/target/release/deps/libffi* \
    ./native/target/release/deps/neon* \
    ./native/target/release/deps/libneon*
echo 'Removed old files'

export PATH="/c/nvm-root:/c/nodejs:$PATH"



# if [[ "$TRAVIS_OS_NAME" == "windows" ]]; then ls -al '/c/nodejs' ; fi
# if [[ "$TRAVIS_OS_NAME" == "windows" ]]; then ls -alL '/c/nodejs' ; fi
which node && node --version
which npm


# (cd native && cargo build --release --verbose)
echo 'Installing deps...'
npm install --ignore-scripts
npx tsc -d

# Build it
echo 'Building...'
npx neon build --release 

ls -al ./native/target/release

ls -al ./native/target/release/deps

ls -al ./native/target/release/build


# Verify abi
echo 'Verifying binding with jest...'
npx jest __tests__/import_test.js


mv native/index.node $SWC_NAME-$2.node
ls -al .

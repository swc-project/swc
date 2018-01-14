#!/bin/bash

# Copied from https://github.com/hyperium/hyper/blob/master/.travis/docs.sh
# which is MIT-licensed.

set -o errexit

shopt -s globstar

cargo doc

git clone --branch gh-pages "https://$GH_TOKEN@github.com/${TRAVIS_REPO_SLUG}.git" deploy_docs > /dev/null 2>&1
cd deploy_docs


git config user.name "강동윤"
git config user.email "kdy1@outlook.kr"

if [ "$TRAVIS_TAG" = ""  ]; then
    rm -rf master
    mv ../target/doc ./master
    echo "<meta http-equiv=refresh content=0;url=swc/index.html>" > ./master/index.html
fi


git add -A . > /dev/null @>&1
git commit -q -m "rebuild pages at ${TRAVIS_COMMIT}"

echo
echo "Pushing docs..."
git push --quiet origin gh-pages > /dev/null 2>&1
echo
echo "Docs published."
echo
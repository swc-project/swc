'use strict';

const generator = require('inline-style-prefixer/lib/generator').default;
const path = require('path');

const browserList = {
  and_chr: 49,
  chrome: 49,
  edge: 79,
  firefox: 52,
  ios_saf: 11,
  opera: 50,
  safari: 11
};

generator(browserList, {
  path: path.join(
    __dirname,
    '../packages/react-native-web/src/modules/prefixStyles/static.js'
  )
});

'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}

if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./cjs/react.development.js');
} else {
  module.exports = require('./cjs/react.production.min.js');
}

process.browser ? require('./a.browser.js') : require('./a.node.js');

'use strict';

const Foo = require('foo');
console.log(new Foo());

module.exports = function greeting(target) {
  alert(`hello, ${target}`);
}

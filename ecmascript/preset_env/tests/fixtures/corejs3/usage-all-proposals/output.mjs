import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.symbol.match";
import "core-js/modules/es.array.from";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.map";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.promise";
import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.string.match";
import "core-js/modules/esnext.global-this";
import "core-js/modules/esnext.map.delete-all";
import "core-js/modules/esnext.map.every";
import "core-js/modules/esnext.map.filter";
import "core-js/modules/esnext.map.find";
import "core-js/modules/esnext.map.find-key";
import "core-js/modules/esnext.map.includes";
import "core-js/modules/esnext.map.key-of";
import "core-js/modules/esnext.map.map-keys";
import "core-js/modules/esnext.map.map-values";
import "core-js/modules/esnext.map.merge";
import "core-js/modules/esnext.map.reduce";
import "core-js/modules/esnext.map.some";
import "core-js/modules/esnext.map.update";
import "core-js/modules/esnext.observable";
import "core-js/modules/esnext.symbol.observable";
import "core-js/modules/web.dom-collections.iterator";
import "core-js/modules/web.queue-microtask";
Array.from; // static method

Map; // built-in

new Promise(); // new builtin

Symbol.match; // as member expression

_arr[Symbol.iterator](); // Symbol.iterator
// no import


Array.asdf;
Array2.from;
Map2;
new Promise2();
Symbol.asdf;
Symbol2.match;

_arr9[Symbol2.iterator]();

_arr9[Symbol.iterator2]();

G.assign; // static method

function H(WeakMap) {
  var blah = new WeakMap();
} // shadowed


var foo = new Promise(function (resolve) {
  resolve(new Map());
});
queueMicrotask(function () {
  return globalThis;
});
Observable.from(10);

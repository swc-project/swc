// optimisation
function foo() {
  foo.apply(void 0, arguments);
} // deoptimisation


function foo(a) {
  for (var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    b[_key - 1] = arguments[_key];
  }

  foo.apply(void 0, b);
}

function foo() {
  for (var _len2 = arguments.length, b = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    b[_key2] = arguments[_key2];
  }

  foo.apply(void 0, [1].concat(b));
}

function foo() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  args.pop();
  foo.apply(void 0, args);
}

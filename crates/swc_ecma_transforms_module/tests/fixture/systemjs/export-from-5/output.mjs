System.register(["foo"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {
      _export("default", _foo.foo);
    }],
    execute: function () {}
  };
});

System.register([], function (_export, _context) {
  "use strict";

  var foo, bar;
  return {
    setters: [],
    execute: function () {
      ({
        foo,
        bar = 1
      } = {}), _export("foo", foo), _export("bar", bar);
    }
  };
});

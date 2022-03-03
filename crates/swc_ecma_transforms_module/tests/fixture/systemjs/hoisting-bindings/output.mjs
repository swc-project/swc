System.register([], function(_export, _context) {
  "use strict";
  var c1;
  function a() {
      alert("a");
      _export("c", +c1 + 1), c1++;
  }
  function b() {
      a();
  }
  function foo(c) {
      alert("a");
      c++;
  }
  _export("a", a);
  return {
      setters: [],
      execute: function() {
          _export("c", c1 = 5);
          b();
      }
  };
});

System.register([
  "foo",
  "bar"
], function(_export, _context) {
  "use strict";
  return {
      setters: [
          function(_foo) {
              var exportObj = {};
              for(var key in _foo){
                  if (key !== "default" && key !== "__esModule") {
                      exportObj[key] = _foo[key];
                  }
              }
              exportObj.default = _foo.default;
              _export(exportObj);
          },
          function(_bar) {
              var exportObj = {};
              for(var key in _bar){
                  if (key !== "default" && key !== "__esModule") {
                      exportObj[key] = _bar[key];
                  }
              }
              exportObj.a = _bar.a;
              exportObj.b = _bar.b;
              _export(exportObj);
          }
      ],
      execute: function() {}
  };
});
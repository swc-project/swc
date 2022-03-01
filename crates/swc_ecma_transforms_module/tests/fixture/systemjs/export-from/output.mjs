System.register([
  "foo"
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
              _export(exportObj);
          }
      ],
      execute: function() {}
  };
});
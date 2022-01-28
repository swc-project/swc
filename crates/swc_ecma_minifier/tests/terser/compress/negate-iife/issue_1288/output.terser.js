w || !(function f() {})();
x ||
    !(function () {
        x = {};
    })();
y
    ? !(function () {})()
    : !(function (z) {
          return z;
      })(0);

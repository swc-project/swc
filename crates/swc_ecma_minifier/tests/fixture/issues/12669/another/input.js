(function () {
  function load(x) { return x + 1; }
  function hook(cb = load) { return cb; }
  globalThis.render = function () { return hook(); };
})();
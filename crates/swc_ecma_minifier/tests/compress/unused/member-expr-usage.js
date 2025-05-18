// Should preserve variables used in member expressions
// Input
(function (e, i) {
  var _ = (((i = {})[n.NONE] = {
    platform: a.NONE,
  }), i);
  e.getPlatform = function () {
    console.log(_[t.toString()])
  };
})();

// Similar case with different variable name
(function () {
  var temp = { foo: 'bar' };
  function test() {
    return temp['foo'];
  }
  test();
})();

// Should preserve object when used in computed property
(function () {
  var obj = { key: 'value' };
  var key = 'key';
  console.log(obj[key]);
})();

// Output
(function (e, i) { var _ = (((i = {})[n.NONE] = { platform: a.NONE }), i); e.getPlatform = function () { console.log(_[t.toString()]) } })(); (function () { var temp = { foo: "bar" }; function test() { return temp.foo } test() })(); (function () { var obj = { key: "value" }, key = "key"; console.log(obj[key]) })(); 

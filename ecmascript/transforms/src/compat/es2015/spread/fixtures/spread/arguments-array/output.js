function foo() {
  return bar(Array.prototype.slice.call(arguments));
}

function bar(one, two, three) {
  return [one, two, three];
}

foo("foo", "bar");

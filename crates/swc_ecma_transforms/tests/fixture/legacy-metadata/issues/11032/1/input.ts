enum Options {
  foo = 0
}

function decorate() {
  return function() {}
}

class Foo {
  @decorate()
  foo(options: Options) {}
}

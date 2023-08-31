let a = 1

function foo(g) {
  var t = g()
  a = a + t
}

function g() {
  a = 2
  return 1
}

foo(g)

console.log(a)

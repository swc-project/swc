var {} = foo;
var [] = foo;
var {a: {}} = foo;
var {a: []} = foo;
var {a: {a: {}}} = foo;
var [...[]] = foo;
function foo1({}) {}
function foo2([]) {}
function foo3({a: {}}) {}
function foo4({a: []}) {}

var {a = {}} = foo;
var {a = []} = foo;

function foo5({a = {}}) {}
function foo6({a = []}) {}

try {} catch ({}) {}

class A {
  constructor({}) {}

  method({}) {}
}

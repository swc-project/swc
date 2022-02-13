var {} = foo;
var [] = foo;
var {a: {}} = foo;
var {a: []} = foo;
var {a: {a: {}}} = foo;
function foo1({}) {}
function foo2([]) {}
function foo3({a: {}}) {}
function foo4({a: []}) {}

var {a = {}} = foo;
var {a = []} = foo;
function foo({a = {}}) {}
function foo({a = []}) {}

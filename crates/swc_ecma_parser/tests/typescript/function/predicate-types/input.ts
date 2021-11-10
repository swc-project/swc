function f(x: any): x is boolean {}
(function(x: any): x is boolean {})
function g(x: any): asserts x is boolean {}
function h(x: any): asserts x {}

var foo = ([])=>"foo";
var bar = ({})=>"bar";
var with_default = (foo = "default")=>foo;
var object_with_default = ({ foo: foo = "default" , bar: baz = "default"  })=>foo;
var array_after_spread = (...[foo])=>foo;
var array_after_spread = (...{ foo: foo  })=>foo;
var computed = ({ [compute()]: x  })=>{};
var array_hole = ([, , ...x] = [
    1,
    2
])=>{};
var object_trailing_elision = ({ foo: foo  })=>{};
var spread_empty_array = (...[])=>"foo";
var spread_empty_object = (...{})=>"foo";

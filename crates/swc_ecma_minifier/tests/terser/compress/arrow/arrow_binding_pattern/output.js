var foo = ([])=>"foo"
;
var bar = ({})=>"bar"
;
var with_default = (foo1 = "default")=>foo1
;
var object_with_default = ({ foo: foo2 = "default" , bar: baz = "default"  })=>foo2
;
var array_after_spread = (...[foo3])=>foo3
;
var array_after_spread = (...{ foo: foo4  })=>foo4
;
var computed = ({ [compute()]: x  })=>{
};
var array_hole = ([, , ...x] = [
    1,
    2
])=>{
};
var object_trailing_elision = ({ foo: foo  })=>{
};
var spread_empty_array = (...[])=>"foo"
;
var spread_empty_object = (...{})=>"foo"
;

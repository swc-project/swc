var a = ([])=>"foo";
var b = ({})=>"bar";
var c = (a = "default")=>a;
var d = ({ foo: a = "default" , bar: b = "default"  })=>a;
var e = (...[a])=>a;
var e = (...{ foo: a  })=>a;
var f = ({ [compute()]: a  })=>{};
var g = ([, , ...a] = [
    1,
    2
])=>{};
var h = ({ foo: a  })=>{};
var i = (...[])=>"foo";
var j = (...{})=>"foo";

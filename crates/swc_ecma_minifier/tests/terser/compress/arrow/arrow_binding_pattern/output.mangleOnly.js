var b = ([])=>"foo";
var c = ({})=>"bar";
var d = (a = "default")=>a;
var e = ({ foo: a = "default" , bar: b = "default"  })=>a;
var a = (...[a])=>a;
var a = (...{ foo: a  })=>a;
var f = ({ [compute()]: a  })=>{};
var g = ([, , ...a] = [
    1,
    2
])=>{};
var h = ({ foo: a  })=>{};
var i = (...[])=>"foo";
var j = (...{})=>"foo";

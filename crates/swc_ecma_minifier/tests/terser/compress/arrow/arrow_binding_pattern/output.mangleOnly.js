var a = ([])=>"foo";
var r = ({})=>"bar";
var v = (a = "default")=>a;
var o = ({ foo: a = "default" , bar: r = "default"  })=>a;
var f = (...[a])=>a;
var f = (...{ foo: a  })=>a;
var b = ({ [compute()]: a  })=>{};
var _ = ([, , ...a] = [
    1,
    2
])=>{};
var c = ({ foo: a  })=>{};
var d = (...[])=>"foo";
var e = (...{})=>"foo";

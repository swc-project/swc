var a = ([])=>"foo";
var o = ({})=>"bar";
var r = (a = "default")=>a;
var v = ({ foo: a = "default" , bar: o = "default"  })=>a;
var f = (...[a])=>a;
var f = (...{ foo: a  })=>a;
var e = ({ [compute()]: a  })=>{};
var t = ([, , ...a] = [
    1,
    2
])=>{};
var u = ({ foo: a  })=>{};
var d = (...[])=>"foo";
var l = (...{})=>"foo";

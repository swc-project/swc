var a = ([])=>"foo";
var r = ({})=>"bar";
var o = (a = "default")=>a;
var v = ({ foo: a = "default" , bar: r = "default"  })=>a;
var f = (...[a])=>a;
var f = (...{ foo: a  })=>a;
var d = ({ [compute()]: a  })=>{};
var e = ([, , ...a] = [
    1,
    2
])=>{};
var l = ({ foo: a  })=>{};
var t = (...[])=>"foo";
var u = (...{})=>"foo";

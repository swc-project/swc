var o = ([])=>"foo";
var r = ({})=>"bar";
var v = (a = "default")=>a;
var f = ({ foo: a = "default", bar: o = "default" })=>a;
var a = (...[a])=>a;
var a = (...{ foo: a })=>a;
var e = ({ [compute()]: a })=>{};
var t = ([, , ...a] = [
    1,
    2
])=>{};
var u = ({ foo: a })=>{};
var d = (...[])=>"foo";
var l = (...{})=>"foo";

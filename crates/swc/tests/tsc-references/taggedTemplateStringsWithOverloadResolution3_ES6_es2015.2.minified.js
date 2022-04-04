function fn2() {}
(function() {
    return null;
})`${void 0}`, (function() {
    return null;
})`${{}}`;
var d1 = fn2`${0}${void 0}`, d2 = fn2`${0}${void 0}`;
function fn4() {}
function fn5() {}
d1.foo(), d2(), fn2`${0}${''}`, fn2`${''}${0}`, (function() {
    return null;
})`${3}`, (function() {
    return null;
})`${''}${3}${''}`, (function() {
    return null;
})`${5}${5}${5}`, (function() {
    return null;
})`${4}`, (function() {
    return null;
})`${''}${''}${''}`, (function() {
    return null;
})`${''}${''}${3}`, (function() {
    return null;
})``, fn4`${''}${3}`, fn4`${3}${''}`, fn4`${3}${void 0}`, fn4`${''}${null}`, fn4`${null}${null}`, fn4`${!0}${null}`, fn4`${null}${!0}`, fn5`${(n)=>n.toFixed()
}`, fn5`${(n)=>n.substr(0)
}`;

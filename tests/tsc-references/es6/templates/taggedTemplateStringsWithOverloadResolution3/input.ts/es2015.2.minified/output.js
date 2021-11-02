function fn1() {
    return null;
}
function fn2() {
}
fn1`${undefined}`, fn1`${{
}}`;
var d1 = fn2`${0}${undefined}`, d2 = fn2`${0}${undefined}`;
function fn3() {
    return null;
}
function fn4() {
}
function fn5() {
}
d1.foo(), d2(), fn2`${0}${''}`, fn2`${''}${0}`, fn3`${3}`, fn3`${''}${3}${''}`, fn3`${5}${5}${5}`, fn3`${4}`, fn3`${''}${''}${''}`, fn3`${''}${''}${3}`, fn3``, fn4`${''}${3}`, fn4`${3}${''}`, fn4`${3}${undefined}`, fn4`${''}${null}`, fn4`${null}${null}`, fn4`${true}${null}`, fn4`${null}${true}`, fn5`${(n)=>n.toFixed()
}`, fn5`${(n)=>n.substr(0)
}`;

with ({ undefined: 1 }) {
    console.log(1 == undefined, undefined == 1);
    console.log(1 != undefined, undefined != 1);
    console.log(null == undefined, undefined == null);
    console.log(null != undefined, undefined != null);
    (function () {
        console.log(1 == undefined, undefined != 1);
    })();
}
console.log(null == undefined, undefined != null);

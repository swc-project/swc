console.log(`foo${any}baz` + "middle" + "test");
console.log("test" + ("middle" + `foo${any}baz`));
console.log(`1${any}2` + "3" + ("4" + `foo${any}baz`));
console.log(1 + `2${any}3` + "4" + ("5" + `foo${any}baz` + 6));

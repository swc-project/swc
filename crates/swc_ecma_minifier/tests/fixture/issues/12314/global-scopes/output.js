var directTopLevel = 1;
if (true) {
    var { value: nestedGlobal } = {
        value: 2
    };
    console.log(nestedGlobal);
    console.log("block");
}
for(var loopGlobal = 0; loopGlobal < 1; loopGlobal++){
    var bodyGlobal = 3;
    console.log(bodyGlobal);
}
try {
    throw 4;
} catch (l) {
    var caughtGlobal = l;
    console.log(caughtGlobal);
} finally{
    var finallyGlobal = 5;
    console.log(finallyGlobal);
}
switch(directTopLevel){
    case 1:
        var switchGlobal = 6;
        console.log(switchGlobal);
        break;
}

//// [controlFlowInOperator.ts]
var a = 'a';
var b = 'b';
var d = 'd';
if ('a' in c) {
    c; // A
    c['a']; // number;
}
if ('d' in c) {
    c; // never
}
if (a in c) {
    c; // A
    c[a]; // number;
}
if (d in c) {
    c; // never
}
// repro from https://github.com/microsoft/TypeScript/issues/54790
function uniqueID_54790(id, seenIDs) {
    if (id === undefined) {
        id = "1";
    }
    if (!(id in seenIDs)) {
        return id;
    }
    for(var i = 1; i < Number.MAX_VALUE; i++){
        var newID = "".concat(id, "-").concat(i);
        if (!(newID in seenIDs)) {
            return newID;
        }
    }
    throw Error("heat death of the universe");
}
function uniqueID_54790_2(id, seenIDs) {
    id = "a";
    for(var i = 1; i < 3; i++){
        var newID = "".concat(id);
        if (newID in seenIDs) {}
    }
}
function uniqueID_54790_3(id, seenIDs) {
    id = "a";
    for(var i = 1; i < 3; i++){
        var newID = id;
        if (newID in seenIDs) {}
    }
}

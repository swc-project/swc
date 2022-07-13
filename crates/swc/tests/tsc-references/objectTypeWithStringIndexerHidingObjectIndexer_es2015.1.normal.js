// @skipDefaultLibCheck: false
// object types can define string indexers that are more specific than the default 'any' that would be returned
// no errors expected below 
var o = {};
var r = o['']; // should be Object
class C {
}
var c;
var r2 = c[''];
var i;
var r3 = i[''];
var o2;
var r4 = o2[''];

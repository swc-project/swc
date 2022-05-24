import _extends from "@swc/helpers/lib/_extends.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_array from "@swc/helpers/lib/_to_array.js";
// Declaration forms for array destructuring
// Destructuring from a simple array -> include undefined
var _strArray = _sliced_to_array(strArray, 1), s1 = _strArray[0];
s1.toString(); // Should error, s1 possibly undefined
// Destructuring a rest element -> do not include undefined
var _strArray1 = _to_array(strArray), s2 = _strArray1.slice(0);
s2.push(undefined); // Should error, 'undefined' not part of s2's element type
// Destructuring a rest element -> do not include undefined
var _strArray2 = _to_array(strArray), s3 = _strArray2.slice(2);
s3.push(undefined); // Should error, 'undefined' not part of s2's element type
var t1 = strMap.t1;
t1.toString(); // Should error, t1 possibly undefined
var t2 = _extends({}, strMap);
t2.z.toString(); // Should error
{
    var x = numMapPoint.x, y = numMapPoint.y, z = numMapPoint.z;
    x.toFixed(); // Should OK
    y.toFixed(); // Should OK
    z.toFixed(); // Should error
}{
    var x1 = numMapPoint.x, q = _object_without_properties(numMapPoint, [
        "x"
    ]);
    x1.toFixed(); // Should OK
    q.y.toFixed(); // Should OK
    q.z.toFixed(); // Should error
}var ref;
// Assignment forms
ref = _sliced_to_array(strArray, 1), target_string = ref[0], ref; // Should error
var ref1;
ref1 = _sliced_to_array(strArray, 1), target_string_undef = ref1[0], ref1; // Should OK
var ref2;
ref2 = _to_array(strArray), target_string_arr = ref2.slice(3), ref2; // Should OK
{
    var x2, y1, z1;
    var ref3;
    ref3 = numMapPoint, x2 = ref3.x, y1 = ref3.y, z1 = ref3.z, ref3; // Should OK
    var q1;
    q1 = numMapPoint.q; // Should error
}

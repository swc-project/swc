// @strict: true
// @noUncheckedIndexedAccess: true
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
// Declaration forms for array destructuring
// Destructuring from a simple array -> include undefined
const [s1] = strArray;
s1.toString(); // Should error, s1 possibly undefined
// Destructuring a rest element -> do not include undefined
const [...s2] = strArray;
s2.push(undefined); // Should error, 'undefined' not part of s2's element type
// Destructuring a rest element -> do not include undefined
const [, , ...s3] = strArray;
s3.push(undefined); // Should error, 'undefined' not part of s2's element type
const { t1  } = strMap;
t1.toString(); // Should error, t1 possibly undefined
const t2 = _extends({}, strMap);
t2.z.toString(); // Should error
{
    const { x , y , z  } = numMapPoint;
    x.toFixed(); // Should OK
    y.toFixed(); // Should OK
    z.toFixed(); // Should error
}{
    const { x: x1  } = numMapPoint, q = _object_without_properties(numMapPoint, [
        "x"
    ]);
    x1.toFixed(); // Should OK
    q.y.toFixed(); // Should OK
    q.z.toFixed(); // Should error
}// Assignment forms
[target_string] = strArray; // Should error
[target_string_undef] = strArray; // Should OK
[, , , ...target_string_arr] = strArray; // Should OK
{
    let x2, y1, z1;
    ({ x: x2 , y: y1 , z: z1  } = numMapPoint); // Should OK
    let q1;
    ({ q: q1  } = numMapPoint); // Should error
}

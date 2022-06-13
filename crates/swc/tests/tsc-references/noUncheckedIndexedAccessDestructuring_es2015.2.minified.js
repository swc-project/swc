import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
let [s1] = strArray;
s1.toString();
let [...s2] = strArray;
s2.push(void 0);
let [, , ...s3] = strArray;
s3.push(void 0);
let { t1  } = strMap;
t1.toString();
let t2 = _extends({}, strMap);
t2.z.toString();
{
    let { x , y , z  } = numMapPoint;
    x.toFixed(), y.toFixed(), z.toFixed();
}{
    let { x  } = numMapPoint, q = _object_without_properties(numMapPoint, [
        "x"
    ]);
    x.toFixed(), q.y.toFixed(), q.z.toFixed();
}[target_string] = strArray, [target_string_undef] = strArray, [, , , ...target_string_arr] = strArray;
{
    let x, y, z;
    ({ x , y , z  } = numMapPoint);
    let q;
    ({ q  } = numMapPoint);
}

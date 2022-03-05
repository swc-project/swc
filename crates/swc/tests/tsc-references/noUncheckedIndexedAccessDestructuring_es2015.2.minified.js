import * as swcHelpers from "@swc/helpers";
const [s1] = strArray;
s1.toString();
const [...s2] = strArray;
s2.push(void 0);
const [, , ...s3] = strArray;
s3.push(void 0);
const { t1  } = strMap;
t1.toString();
const t2 = swcHelpers.extends({}, strMap);
t2.z.toString();
{
    const { x , y , z  } = numMapPoint;
    x.toFixed(), y.toFixed(), z.toFixed();
}{
    const { x  } = numMapPoint, q = swcHelpers.objectWithoutProperties(numMapPoint, [
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

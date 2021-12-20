function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const [s1] = strArray;
s1.toString();
const [...s2] = strArray;
s2.push(void 0);
const [, , ...s3] = strArray;
s3.push(void 0);
const { t1  } = strMap;
t1.toString();
const t2 = _extends({
}, strMap);
t2.z.toString();
{
    const { x , y , z  } = numMapPoint;
    x.toFixed(), y.toFixed(), z.toFixed();
}{
    const { x  } = numMapPoint, q = function(source, excluded) {
        if (null == source) return {
        };
        var key, i, target = function(source, excluded) {
            if (null == source) return {
            };
            var key, i, target = {
            }, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(numMapPoint, [
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

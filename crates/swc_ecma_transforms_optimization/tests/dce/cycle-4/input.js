
__self.push(function () {
    "use strict";
    __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
        axios: function () {
            return _axios_0_21_4_axios_default();
        },
        axiosUtils: function () {
            return axiosUtils;
        }
    });
    var _axios_0_21_4_axios = __webpack_require__(73035), _axios_0_21_4_axios_default = __webpack_require__.n(_axios_0_21_4_axios);
    function isArray(val) {
        return "[object Array]" === toString.call(val);
    }
    function isPlainObject(val) {
        if ("[object Object]" !== toString.call(val)) return !1;
        var prototype = Object.getPrototypeOf(val);
        return null === prototype || prototype === Object.prototype;
    }
    function forEach(obj, fn) {
        if (null != obj) {
            if ("object" != typeof obj && (obj = [
                obj
            ]), isArray(obj)) for (var i = 0, l = obj.length; i < l; i++)fn.call(null, obj[i], i, obj);
            else for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && fn.call(null, obj[key], key, obj);
        }
    }
    var axiosUtils = {
        forEach: forEach,
        merge: function merge() {
            for (var args = [], _i = 0; _i < arguments.length; _i++)args[_i] = arguments[_i];
            var result = {};
            function assignValue(val, key) {
                isPlainObject(result[key]) && isPlainObject(val) ? result[key] = merge(result[key], val) : isPlainObject(val) ? result[key] = merge({}, val) : isArray(val) ? result[key] = val.slice() : result[key] = val;
            }
            for (var i = 0, l = args.length; i < l; i++)forEach(args[i], assignValue);
            return result;
        },
        isArray: isArray
    };
})
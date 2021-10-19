function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {
        }, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
export const a = f`
    hello
    ${(stuff)=>stuff.x
}
    brave
    ${(stuff)=>stuff.y
}
    world
    ${(stuff)=>stuff.z
}
`;
export const b = g`
    hello
    ${(stuff)=>stuff.x
}
    brave
    ${(stuff)=>stuff.y
}
    world
    ${(stuff)=>stuff.z
}
`;
export let c = obj.prop`${(input)=>_objectSpread({
    }, input)
}`;
c.returnedObjProp.x, c.returnedObjProp.y, c.returnedObjProp.z, (c = obj.prop`${(input)=>_objectSpread({
    }, input)
}`).returnedObjProp.x, c.returnedObjProp.y, c.returnedObjProp.z;

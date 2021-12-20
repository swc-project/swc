function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
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
export let c = obj["prop"]`${(input)=>_objectSpread({
    }, input)
}`;
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;
c = obj.prop`${(input)=>_objectSpread({
    }, input)
}`;
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;

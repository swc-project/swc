import * as swcHelpers from "@swc/helpers";
// @target: es2015
function cloneAgain(_param) {
    var { a  } = _param, clone = swcHelpers.objectWithoutProperties(_param, [
        "a"
    ]);
}
suddenly((_param)=>{
    var { x: a  } = _param, rest = swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y;
});
suddenly((_param = {
    x: {
        z: 1,
        ka: 1
    },
    y: 'noo'
})=>{
    var { x: { z =12  }  } = _param, nested = swcHelpers.objectWithoutProperties(_param.x, [
        "z"
    ]), rest = swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
class C {
    m(_param) {
        var { a  } = _param, clone = swcHelpers.objectWithoutProperties(_param, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
    set p(_param) {
        var { a  } = _param, clone = swcHelpers.objectWithoutProperties(_param, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
}
function foobar(_param = {}) {
    var { bar ={}  } = _param, opts = swcHelpers.objectWithoutProperties(_param, [
        "bar"
    ]);
}
foobar();
foobar({
    baz: 'hello'
});
foobar({
    bar: {
        greeting: 'hello'
    }
});

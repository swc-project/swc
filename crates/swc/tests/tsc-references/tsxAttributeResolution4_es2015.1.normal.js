import _extends from "@swc/helpers/src/_extends.mjs";
// OK
/*#__PURE__*/ React.createElement("test1", _extends({}, {
    x: (n)=>0
}));
// Error, no member 'len' on 'string'
/*#__PURE__*/ React.createElement("test1", _extends({}, {
    x: (n)=>n.len
}));

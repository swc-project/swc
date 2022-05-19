import * as swcHelpers from "@swc/helpers";
let trace = [], order = (n)=>trace.push(n), [{ [order(1)]: x  } = order(0)] = [], [{ [order(1)]: y  } = order(0)] = [
    {}
], _ref = {}, key = order(0), key1 = order(2), { [key]: { [key1]: z  } = order(1)  } = _ref;
swcHelpers.objectWithoutProperties(_ref, [
    key
].map(swcHelpers.toPropertyKey));
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = swcHelpers.extends({}, _ref1[0]);

import { aa, useRef } from "./utils";

export function A() {
    const { o1 } = aa;
    const ref = (0, useRef)();
    const fn2 = async (
        value2 = (() => {
            var _ref_current;
            return (_ref_current = ref.current) === null ||
                _ref_current === void 0
                ? void 0
                : _ref_current.getValue();
        })()
    ) => {
        console.log(o1);
    };
    return (0, _jsxruntime.jsx)(B, {
        fn2: fn2,
    });
}
export default A;

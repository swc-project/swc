import { aa, useRef } from "./utils";
export function A() {
    let { o1 } = aa, ref = useRef();
    return (0, _jsxruntime.jsx)(B, {
        fn2: async (value2 = (()=>{
            var _ref_current;
            return null == (_ref_current = ref.current) ? void 0 : _ref_current.getValue();
        })())=>{
            console.log(o1);
        }
    });
}
export default A;

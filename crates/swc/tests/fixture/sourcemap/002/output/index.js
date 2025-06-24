import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { jsx as _jsx } from "react/jsx-runtime";
export default function StaticPage(param) {
    var data = param.data;
    return /*#__PURE__*/ _jsx("div", {
        children: data.foo
    });
}
export function getStaticProps() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                {
                    props: {
                        data: {
                            foo: "bar"
                        }
                    }
                }
            ];
        });
    })();
}

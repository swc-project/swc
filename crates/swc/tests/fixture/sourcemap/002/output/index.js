import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
export default function StaticPage(param) {
    var data = param.data;
    return /*#__PURE__*/ React.createElement("div", null, data.foo);
}
export function getStaticProps() {
    return _getStaticProps.apply(this, arguments);
}
function _getStaticProps() {
    _getStaticProps = _async_to_generator(function() {
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
    });
    return _getStaticProps.apply(this, arguments);
}

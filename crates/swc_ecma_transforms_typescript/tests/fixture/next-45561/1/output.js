import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { dirname } from "node:path";
export default function IndexPage(props) {
    return /*#__PURE__*/ _jsxs("div", {
        children: [
            "abc: ",
            props.abc,
            /*#__PURE__*/ _jsx("svg", {
                viewBox: "0 -85 600 600"
            })
        ]
    });
}
export function getServerSideProps() {
    return {
        props: {
            abc: dirname("/abc/def")
        }
    };
}

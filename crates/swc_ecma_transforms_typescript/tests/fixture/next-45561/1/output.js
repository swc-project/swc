import { dirname } from "node:path";
export default function IndexPage(props) {
    return /*#__PURE__*/ React.createElement("div", null, "abc: ", props.abc, /*#__PURE__*/ React.createElement("svg", {
        viewBox: "0 -85 600 600"
    }));
}
export function getServerSideProps() {
    return {
        props: {
            abc: dirname("/abc/def")
        }
    };
}

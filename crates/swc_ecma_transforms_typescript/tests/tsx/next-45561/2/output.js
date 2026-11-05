import { dirname } from "node:path";
export default function IndexPage(props) {
    return React.createElement("div", null, "abc: ", props.abc, React.createElement("svg", {
        viewBox: "0 -85 600 600"
    }, React.createElement("path", {
        fillRule: "evenodd",
        d: "M513 256.5C513 398.161 398.161 513 256.5 513C114.839 513 0 398.161 0 256.5C0 114.839 114.839 0 256.5 0C398.161 0 513 114.839 513 256.5ZM211.146 305.243L369.885 145L412 185.878L253.26 346.122L211.146 387L101 275.811L143.115 234.932L211.146 305.243Z",
        fill: "#fff"
    })));
}
export function getServerSideProps() {
    return {
        props: {
            abc: dirname("/abc/def")
        }
    };
}

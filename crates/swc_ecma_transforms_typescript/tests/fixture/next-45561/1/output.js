import { dirname } from "node:path";
export default function IndexPage(props) {
    return <div>
            abc: {props.abc}
            <svg viewBox="0 -85 600 600"></svg>
        </div>;
}
export function getServerSideProps() {
    return {
        props: {
            abc: dirname("/abc/def")
        }
    };
}

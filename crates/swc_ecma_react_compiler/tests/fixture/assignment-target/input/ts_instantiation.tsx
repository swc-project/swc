export function App() {
    let value = "initial";
    value<string> = "updated";

    return <div>{value}</div>;
}

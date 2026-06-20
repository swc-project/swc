export function App() {
    let value = "initial";
    (value as string) = "updated";

    return <div>{value}</div>;
}

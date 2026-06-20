type Source = [string];

export function App(props: { source: Source }) {
    let value = "initial";
    [value as string] = props.source;

    return <div>{value}</div>;
}

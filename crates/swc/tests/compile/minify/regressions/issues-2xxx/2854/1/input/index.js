export function App() {
    return <Form />;
}

export function Form({ onChange = function () {} }) {
    return (
        <input
            onChange={function () {
                onChange();
            }}
        />
    );
}

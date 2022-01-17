function App() {
    return <Form />
}

function Form({ onChange = function () { } }) {
    return (
        <input
            onChange={function () {
                onChange();
            }}
        />
    );
}

export default App;
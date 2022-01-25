export function App() {
    return <Form />;
}
export function Form({ onChange__2 =function() {}  }) {
    return <input onChange__0={function() {
        onChange__2();
    }}/>;
}

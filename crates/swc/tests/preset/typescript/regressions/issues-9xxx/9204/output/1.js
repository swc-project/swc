let Foo = createFoo();
export function App() {
    return React.createElement("view", null, React.createElement(Foo, null));
}

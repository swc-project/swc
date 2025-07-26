import { jsx as _jsx } from "react/jsx-runtime";
let Foo = createFoo();
export function App() {
    return _jsx("view", {
        children: _jsx(Foo, {})
    });
}

import defer * as a from "a";
import source b from "b";
import c from "c" with { "type": "json"};

export function App() {
    const onClick = () => {
        console.log("Clicked");
    };
    return <Home a={a} b={b} c={c} onClick={onClick}>Click me</Home>;
}
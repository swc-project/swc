export function App() {
    let [counter, setCounter] = React.useState(0);
    if (counter === 10) throw new Error("Too high!");
    return Other();
}

function Other() {
    return "Change me";
}

globalThis.Other = Other;
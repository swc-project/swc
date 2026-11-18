export interface MyInterface {
    prop1: string;
    prop2: number;
}

export default interface MyDefaultInterface extends MyInterface {
    prop3: boolean;
    prop4: string;
}

export function App() {
    const onClick = () => {
        console.log("Clicked");
    };
    return <div onClick={onClick}>Click me</div>;
}

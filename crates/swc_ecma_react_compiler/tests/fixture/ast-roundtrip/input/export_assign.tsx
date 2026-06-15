function App() {
    const onClick = () => {
        console.log("Clicked");
    };
    return <div onClick={onClick}>Click me</div>;
}

export = App;

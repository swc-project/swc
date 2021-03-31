function Bar() {
    const [foo, setFoo] = useState(0);
    React.useEffect(() => {
        // @refresh reset
    });
    return <h1>{ foo } < /h1>;
}
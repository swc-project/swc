function Bar() {
    const [foo, setFoo] = useState(0);
    // @refresh reset
    React.useEffect(() => {
    });
    return <h1>{ foo } < /h1>;
}
function Bar() {
    const [foo, setFoo] = useState(0);
    React.useEffect(()=>{
    // @refresh reset
    });
    return( /*#__PURE__*/ React.createElement("h1", null, foo, " "));
}

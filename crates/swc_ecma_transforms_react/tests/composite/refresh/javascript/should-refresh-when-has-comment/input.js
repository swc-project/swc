
    export function Foo() {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1>{foo}</h1>;
    }
    function Bar() {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {
        // @refresh reset
      });
      return <h1>{foo}</h1>;
    }

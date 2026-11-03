
    export const A = React.memo(React.forwardRef((props, ref) => {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1 ref={ref}>{foo}</h1>;
    }));
    export const B = React.memo(React.forwardRef(function(props, ref) {
      const [foo, setFoo] = useState(0);
      React.useEffect(() => {});
      return <h1 ref={ref}>{foo}</h1>;
    }));
    function hoc() {
      return function Inner() {
        const [foo, setFoo] = useState(0);
        React.useEffect(() => {});
        return <h1 ref={ref}>{foo}</h1>;
      };
    }
    export let C = hoc();

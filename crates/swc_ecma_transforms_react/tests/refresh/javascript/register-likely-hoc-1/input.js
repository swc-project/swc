
    const A = forwardRef(function() {
      return <h1>Foo</h1>;
    });
    export const B = memo(React.forwardRef(() => {
      return <h1>Foo</h1>;
    }));
    export default React.memo(forwardRef((props, ref) => {
      return <h1>Foo</h1>;
    }));

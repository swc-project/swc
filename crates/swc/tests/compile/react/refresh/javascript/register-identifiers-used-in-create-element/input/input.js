
    import A from './A';
    import Store from './Store';
    Store.subscribe();
    const Header = styled.div`color: red`
    const StyledFactory1 = styled('div')`color: hotpink`
    const StyledFactory2 = styled('div')({ color: 'hotpink' })
    const StyledFactory3 = styled(A)({ color: 'hotpink' })
    const FunnyFactory = funny.factory``;
    let Alias1 = A;
    let Alias2 = A.Foo;
    const Dict = {};
    function Foo() {
      return [
        React.createElement(A),
        React.createElement(B),
        React.createElement(StyledFactory1),
        React.createElement(StyledFactory2),
        React.createElement(StyledFactory3),
        React.createElement(Alias1),
        React.createElement(Alias2),
        jsx(Header),
        React.createElement(Dict.X),
      ];
    }
    React.createContext(Store);
    const B = hoc(A);
    // This is currently registered as a false positive:
    const NotAComponent = wow(A);
    // We could avoid it but it also doesn't hurt.

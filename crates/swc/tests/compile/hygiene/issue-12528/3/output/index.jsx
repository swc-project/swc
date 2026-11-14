// The inferred name `C` of the function must not capture the global `C`
// that the JSX element refers to.
var obj = {
    C: function C1() {
        return <C/>;
    },
    D: function D1() {
        return <D.Item/>;
    }
};

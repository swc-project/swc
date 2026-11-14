// The inferred name `C` of the function must not capture the global `C`
// that the JSX element refers to.
var obj = {
    C: function () {
        return <C />;
    },
    D: function () {
        return <D.Item />;
    },
};

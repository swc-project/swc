//// [file.tsx]
var decorator4 = function decorator4(Component) {
    return function(props) {
        return <Component {...props} y={"blah"}></Component>;
    };
};

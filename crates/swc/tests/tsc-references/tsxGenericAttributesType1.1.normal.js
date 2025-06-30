//// [file.tsx]
var decorator = function decorator(Component) {
    return function(props) {
        return <Component {...props}></Component>;
    };
};
var decorator2 = function decorator2(Component) {
    return function(props) {
        return <Component {...props} x={2}></Component>;
    };
};
var decorator3 = function decorator3(Component) {
    return function(props) {
        return <Component x={2} {...props}></Component>;
    };
};

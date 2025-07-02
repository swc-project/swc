//// [file.tsx]
export default function Component(props) {
    var condition1;
    if (condition1) {
        return <ChildComponent {...props}/>;
    } else {
        return <ChildComponent {...props} property1="NewString"/>;
    }
}
function ChildComponent(param) {
    var property1 = param.property1;
    return <span>{property1}</span>;
}

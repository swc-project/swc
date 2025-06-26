//// [file.tsx]
export default function Component(props) {
    return <ChildComponent {...props} property1="NewString"/>;
}
function ChildComponent(param) {
    var property1 = param.property1;
    return <span>{property1}</span>;
}

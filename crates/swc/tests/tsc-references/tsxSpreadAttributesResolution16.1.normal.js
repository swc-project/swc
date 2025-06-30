//// [file.tsx]
export default function Component(props) {
    return(<AnotherComponent {...props}/>);
}
function AnotherComponent(param) {
    var property1 = param.property1;
    return <span>{property1}</span>;
}

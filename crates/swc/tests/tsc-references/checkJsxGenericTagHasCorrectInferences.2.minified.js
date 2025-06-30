//// [file.tsx]
import "react";
<GenericComponent initialValues={{
    x: "y"
}} nextValues={function(a) {
    return a;
}}/>, <GenericComponent initialValues={12} nextValues={function(a) {
    return a;
}}/>, <GenericComponent initialValues={{
    x: "y"
}} nextValues={function(a) {
    return {
        x: a.x
    };
}}/>, <GenericComponent initialValues={{
    x: "y"
}} nextValues={function(a) {
    return a.x;
}}/>;

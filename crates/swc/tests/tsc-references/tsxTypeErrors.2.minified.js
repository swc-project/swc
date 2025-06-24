//// [tsxTypeErrors.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
<div id="foo"/>, <img srce="foo.jpg"/>, <div id={{
    oops: 100
}}/>, <imag src="bar.jpg"/>;
var MyClass = function MyClass() {
    _class_call_check(this, MyClass);
};
<MyClass reqd={!0}/>, <MyClass pt={{
    x: 4,
    y: 'oops'
}}/>;

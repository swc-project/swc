//// [tsxAttributeErrors.tsx]
// Error, number is not assignable to string
<div text={42}/>;
// Error, string is not assignable to number
<div width={'foo'}/>;
// Error, number is not assignable to string
var attribs = {
    text: 100
};
<div {...attribs}/>;
// No errors here
<span foo='bar' bar={'foo'}/>;

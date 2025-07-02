//// [file.tsx]
var Tag = function(x) {
    return <div></div>;
};
// OK
var k1 = <Tag/>;
var k2 = <Tag></Tag>;
// Not OK (excess children)
var k3 = <Tag children={<div></div>}/>;
var k4 = <Tag key="1"><div></div></Tag>;
var k5 = <Tag key="1"><div></div><div></div></Tag>;

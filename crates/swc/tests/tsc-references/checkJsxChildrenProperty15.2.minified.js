//// [file.tsx]
var Tag = function(x) {
    return <div></div>;
};
<Tag/>, <Tag></Tag>, <Tag children={<div></div>}/>, <Tag key="1"><div></div></Tag>, <Tag key="1"><div></div><div></div></Tag>;

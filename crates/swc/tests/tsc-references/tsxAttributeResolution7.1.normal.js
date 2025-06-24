//// [file.tsx]
// Error
<test1 data-foo={32}/>;
// OK
<test1 data-foo={'32'}/>;
<test1 data-bar={'32'}/>;
<test1 data-bar={32}/>;

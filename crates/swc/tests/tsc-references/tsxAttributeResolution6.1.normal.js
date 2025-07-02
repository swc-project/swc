//// [file.tsx]
// Error
<test1 s/>;
<test1 n='true'/>;
<test2/>;
// OK
<test1 n/>;
<test1 n={false}/>;
<test2 n/>;

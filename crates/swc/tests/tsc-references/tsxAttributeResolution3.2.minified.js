//// [file.tsx]
<test1 {...{
    x: 'foo'
}}/>, <test1 {...{
    x: 32
}}/>, <test1 {...{
    y: 32
}}/>, <test1 {...{
    x: 32,
    y: 32
}} x="ok"/>, <test1 x="ok" {...{
    x: 32,
    y: 32
}}/>, <test1 {...{
    x: 'ok',
    y: 32,
    extra: 100
}}/>, <test1 x={32} {...{
    x: 'foo'
}}/>;

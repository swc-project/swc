//// [tsxDynamicTagName3.tsx]
var CustomTag = "h1";
/*#__PURE__*/ React.createElement(CustomTag, null, " Hello World ") // This should be an error. we will try look up string literal type in JSX.IntrinsicElements
;

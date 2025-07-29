//// [tsxDynamicTagName3.tsx]
var CustomTag = "h1";
<CustomTag> Hello World </CustomTag>; // This should be an error. we will try look up string literal type in JSX.IntrinsicElements

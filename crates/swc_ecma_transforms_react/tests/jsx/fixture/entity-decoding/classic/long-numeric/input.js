const shortSpace = <div>
&#32;
text</div>;

const decimalSpace = <div>
&#00000000000000000000000000000032;
text</div>;

const hexSpace = <div>
&#x00000000000000000000000000000020;
text</div>;

const decimalTab = <div>
&#0000000000000000000000000000009;
text</div>;

const hexTab = <div>
&#x0000000000000000000000000000009;
text</div>;

const trailingSpace = <div>text&#00000000000000000000000000000032;
next</div>;

const entityOnlyLine = <div>
&#00000000000000000000000000000032;
</div>;

const plainWhitespaceAroundEntity = <div>
 &#00000000000000000000000000000032; 
text</div>;

const followingNamedEntity = <div>
&#00000000000000000000000000000032;&amp;
text</div>;

const followingNumericEntity = <div>&#00000000000000000000000000000065;&#32;</div>;

const unicodeAfterEntity = <div>
&#00000000000000000000000000000032;&nbsp;🦀
text</div>;

const encodedNewline = <div>
&#x000000000000000000000000000000A;
text</div>;

const plainSpace = <div>
 
text</div>;

const emptyDecimal = <div>
&#;&#32;
text</div>;

const emptyHex = <div>
&#x;&#32;
text</div>;

const outOfRangeDecimal = <div>
&#1114112;&#32;
text</div>;

const outOfRangeHex = <div>
&#x110000;&#32;
text</div>;

const uppercaseHexPrefix = <div>
&#X20;&#32;
text</div>;

const signedDecimal = <div>
&#+32;&#32;
text</div>;

const invalidLongDigits = <div>
&#000000000000000000000000000000G;&#32;
text</div>;

const strayAmpersand = <div>
& &amp;&#32;
text</div>;

const nonAsciiReference = <div>
&é;&amp;&#32;
text</div>;

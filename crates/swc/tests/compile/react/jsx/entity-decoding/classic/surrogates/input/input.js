const loneHigh = <div>
&#xD800;&#32;
text</div>;

const loneLow = <div>
&#xDC00;&#32;
text</div>;

const hexPair = <div>
&#xD83E;&#xDD80;&#32;
text</div>;

const decimalPair = <div>
&#55358;&#56704;&#32;
text</div>;

const mixedPair = <div>
&#xD83E;&#56704;&#32;
text</div>;

const repeatedHigh = <div>
&#xD800;&#xD801;&#32;
text</div>;

const highBeforePair = <div>
&#xD800;&#xD801;&#xDC00;&#32;
text</div>;

const reversedPair = <div>
&#xDC00;&#xD800;&#32;
text</div>;

const pairBeforeHigh = <div>
&#xD83E;&#xDD80;&#xD800;&#32;
text</div>;

const namedBetweenHalves = <div>
&#xD800;&amp;&#xDC00;&#32;
text</div>;

const textBetweenHalves = <div>
&#xD800;a&#xDC00;&#32;
text</div>;

const beforeOutOfRange = <div>
&#xD800;&#x110000;&#32;
text</div>;

const beforeEmptyDecimal = <div>
&#xD800;&#;&#32;
text</div>;

const beforeEmptyHex = <div>
&#xD800;&#x;&#32;
text</div>;

const longHighPair = <div>
&#x000000000000000000000000000000D83E;&#xDD80;&#32;
text</div>;

const longLowPair = <div>
&#xD83E;&#x000000000000000000000000000000DD80;&#32;
text</div>;

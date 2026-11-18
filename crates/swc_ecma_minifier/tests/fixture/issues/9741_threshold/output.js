// This should NOT be hoisted since Object.assign is only used once
var _JSON_parse = JSON.parse;
Object.assign({}, {}), _JSON_parse("{}"), _JSON_parse("{}");

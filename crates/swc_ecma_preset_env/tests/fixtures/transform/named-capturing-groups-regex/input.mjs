var re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
var result = "2017-12-23".match(re);

var re2 = /IJobHeader\[\[(?<moduleName>[A-Za-z]+)\]\]/;

var re3 = /<(?<tag>\d)+>.*?<\/\k<tag>>/su;

// Edge case: mix of named and unnamed groups
var re4 = /(unnamed)(?<named>\d+)/;

// Edge case: nested capturing groups
var re5 = /(?<outer>(?<inner>\d+))/;

// Edge case: named groups in different alternatives
var re6 = /(?<a>x)|(?<b>y)/;

var re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
var result = "2017-12-23".match(re);

var re2 = /IJobHeader\[\[(?<moduleName>[A-Za-z]+)\]\]/;

var re3 = /<(?<tag>\d)+>.*?<\/\k<tag>>/su;

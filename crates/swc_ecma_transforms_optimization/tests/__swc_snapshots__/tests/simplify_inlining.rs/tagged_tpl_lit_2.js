var name;
function myTag(strings, nameExp, numExp) {
    var modStr;
    if (numExp > 2) {
        modStr = nameExp + 'Bar';
    } else {
        modStr = nameExp + 'BarBar';
    }
}
var output = myTag`My name is ${'Foo'} ${3}`;
output = myTag`My name is ${'Foo'} ${2}`;

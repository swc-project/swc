var obj1 = {
    valueOf: function () {
        triggeredFirst();
    },
};
var obj2 = {
    valueOf: function () {
        triggeredSecond();
    },
};
var result1 = obj2 >= obj1;
var result2 = obj2 > obj1;
var result3 = obj1 >= obj2;
var result4 = obj1 > obj2;

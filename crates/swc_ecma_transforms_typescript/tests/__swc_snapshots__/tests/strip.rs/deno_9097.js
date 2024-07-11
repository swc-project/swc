export let util;
(function(util) {
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items)=>{};
    util.getValidEnumValues = (obj)=>{};
    util.getValues = (obj)=>{};
    util.objectValues = (obj)=>{};
})(util || (util = {}));

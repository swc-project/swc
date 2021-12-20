var TargetHasOptional, SourceHasOptional;
class Base {
}
!function(TargetHasOptional) {
    var c, a, d, e, f;
    new Base(), c = d, c = e, c = f, c = a, a = d, a = e, a = f, a = c;
}(TargetHasOptional || (TargetHasOptional = {
})), (function(SourceHasOptional) {
    var c, a, d, e, f;
    new Base(), c = d, c = e, c = f, c = a, a = d, a = e, a = f, a = c;
})(SourceHasOptional || (SourceHasOptional = {
}));

function combineOverlappingMatches(matches) {
    var hasOverlaps = false;
    var _loop = function(i) {
        var currentMatch = matches[i];
        var overlap = matches.find(function(match) {
            return match !== currentMatch && match.itemsType === currentMatch.itemsType;
        });
        if (overlap) {
            hasOverlaps = true;
            matches.splice(i, 1);
        }
    };
    for(var i = matches.length - 1; i >= 0; i--)_loop(i);
    if (hasOverlaps) {
        combineOverlappingMatches(matches);
    }
}
combineOverlappingMatches([
    1
]);

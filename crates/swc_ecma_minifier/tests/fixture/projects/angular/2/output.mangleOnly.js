var n = destination.$$hashKey;
forEach(destination, function(n, e) {
    delete destination[e];
});
for(var e in source)destination[e] = copy(source[e]);

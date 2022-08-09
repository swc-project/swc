var e = destination.$$hashKey;
forEach(destination, function(e, a) {
    delete destination[a];
});
for(var a in source)destination[a] = copy(source[a]);

var a = destination.$$hashKey;
forEach(destination, function(a, b) {
    delete destination[b];
});
for(var b in source)destination[b] = copy(source[b]);

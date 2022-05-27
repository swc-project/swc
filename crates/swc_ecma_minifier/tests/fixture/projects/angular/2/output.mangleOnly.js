var b = destination.$$hashKey;
forEach(destination, function(b, a) {
    delete destination[a];
});
for(var a in source)destination[a] = copy(source[a]);

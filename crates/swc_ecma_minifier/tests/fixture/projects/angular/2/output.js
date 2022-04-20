var h = destination.$$hashKey;
for(var key in forEach(destination, function(value, key1) {
    delete destination[key1];
}), source)destination[key] = copy(source[key]);

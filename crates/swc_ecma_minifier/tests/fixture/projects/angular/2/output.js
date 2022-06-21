var h = destination.$$hashKey;
for(var key in forEach(destination, function(value, key) {
    delete destination[key];
}), source)destination[key] = copy(source[key]);

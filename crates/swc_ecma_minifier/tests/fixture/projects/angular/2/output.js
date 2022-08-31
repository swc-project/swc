for(var key in destination.$$hashKey, forEach(destination, function(value, key) {
    delete destination[key];
}), source)destination[key] = copy(source[key]);

var h = destination.$$hashKey;
forEach(destination, function (value, key) {
    delete destination[key];
});
for (var key in source) destination[key] = copy(source[key]);

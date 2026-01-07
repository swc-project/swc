expect(function(b = 3, c = b) {
    return c;
}()).toBe(3);

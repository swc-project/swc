module.exports = function(l, r) {
    var lightGreeting;
    if (l > 0) var greeting = "hello";
    else var greeting = "howdy";
    return r > 0 && (lightGreeting = greeting.substr(0, 2)), lightGreeting;
};

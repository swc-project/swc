// @allowUnusedLabels: true
// @allowUnreachableCode: true

while(true) {
    break;
} 

ONE:

while (true) {
    break ONE;
}

TWO:
THREE:
while (true) {
    break THREE;
}

FOUR:
while (true) {
    FIVE:
    while (true) {
        break FOUR;
    }
}

while (true) {
    SIX:
    while (true)
        break SIX;
}

SEVEN:
while (true)
    while (true)
        while (true)
            break SEVEN;

EIGHT:
while (true) {
    var fn = function () { }
    break EIGHT;
}

function fallsThrough(x) {
    switch (1) {
        case x:
            console.log("A");
        case 2:
            console.log("B");
            break;
        case 1:
            console.log("C");
    }
}

fallsThrough(1);
fallsThrough(0);

function stopsFallthrough(x) {
    switch (1) {
        case x:
            console.log("A");
            break;
        case 2:
            console.log("B");
            break;
        case 1:
            console.log("C");
    }
}

stopsFallthrough(1);

function skipsLaterTest(x) {
    switch (1) {
        case x:
            console.log("A");
        case (console.log("test"), 2):
            console.log("B");
            break;
        case 1:
            console.log("C");
    }
}

skipsLaterTest(1);

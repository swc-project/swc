try {
    do {
        console.log("body");
        continue;
    } while (void (class extends 0 {
        static {
            do {
                (function () {});
                break;
            } while (false);
        }
    }));
    console.log("unexpected");
} catch (e) {
    console.log(e.name);
}

try {
    do {
        console.log("reference");
        continue;
    } while (void (class {
        static {
            do {
                ({ missing });
                break;
            } while (false);
        }
    }));
    console.log("unexpected");
} catch (e) {
    console.log(e.name);
}

do {
    console.log("break");
    break;
} while (void (class extends 0 {
    static {
        do {
            (function () {});
            break;
        } while (false);
    }
}));
console.log("after");

var events = [];
do {
    events.push("outside");
    break;
} while (false);

function withScope() {
    var count = 0;
    try {
        with ({ undefined: true }) {
            do {
                count++;
                if (count > 1) throw "stopped";
                continue;
            } while (undefined);
        }
    } catch (error) {
        events.push(error + ":" + count);
    }
}

function asmScope() {
    "use asm";
    function once(value) {
        value = value | 0;
        do {
            value = (value + 1) | 0;
            break;
        } while (0);
        return value | 0;
    }
    return once;
}

withScope();
console.log(events.join("|"));
console.log(asmScope()(2));

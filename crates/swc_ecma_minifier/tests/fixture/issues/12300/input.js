function suppressThrow(escape) {
    switch (0) {
        case 0:
            try {
                if (escape) break;
                throw "error";
            } finally {
                break;
            }
    }

    console.log("ok");
}

function suppressReturn(escape) {
    switch (0) {
        case 0:
            try {
                if (escape) break;
                return "wrong";
            } finally {
                break;
            }
    }

    return "ok";
}

function removeOrdinaryBreak() {
    switch (0) {
        case 0:
            console.log("ordinary");
            break;
    }
}

function retainFinalizerBreak() {
    switch (0) {
        case 0:
            try {
                console.log("finalizer");
            } finally {
                break;
            }
    }

    console.log("after");
}

suppressThrow(false);
removeOrdinaryBreak();
console.log(suppressReturn(false));
retainFinalizerBreak();

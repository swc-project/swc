function f(value, ...rest) {
    value = "changed";
    switch (0) {
        case 0:
            let arguments = ["switch"];
            return eval("arguments[0]");
    }
}

console.log(f("original"));

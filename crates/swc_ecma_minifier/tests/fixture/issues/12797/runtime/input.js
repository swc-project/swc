let count = 0;
function foo() {
    count++;
    return count;
}

class Unused {
    static set(x) { Unused.value = x; }
    static cache = foo();
}

class Used {
    static set(x) { Used.value = x; }
    static cache = foo();
}
Used.set("used");

console.log(count, Used.value, Used.cache);

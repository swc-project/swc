let count = 0;
++count;
class Used {
    static set(x) {
        Used.value = x;
    }
    static cache = ++count;
}
Used.set("used"), console.log(count, Used.value, Used.cache);

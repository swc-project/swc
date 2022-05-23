const leak = () => {};
function scan() {
    let len = leak();
    let ch = 0;
    switch ((ch = 123)) {
        case "never-reached":
            const ch = leak();
            leak(ch);
    }
    return len === 123 ? "FAIL" : "PASS";
}
console.log(scan());

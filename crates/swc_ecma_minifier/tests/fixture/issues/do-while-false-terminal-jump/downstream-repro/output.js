function sameOwner(e, r) {
    return e === r;
}
function resumeCreateOrder(e, r) {
    for(;;)if (0) continue;
    else {
        let n;
        do {
            if (null == e) throw Error("Required value was null.");
            n = e;
            break;
        }while (!1)
        if (sameOwner(n, r)) return "same";
        return "changed";
    }
}
console.log(resumeCreateOrder("account-a", "account-b")), console.log(resumeCreateOrder("account-a", "account-a"));
try {
    resumeCreateOrder(null, "account-a"), console.log("wrong null tail");
} catch (e) {
    console.log(e.message);
}

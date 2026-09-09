function sameOwner(requestAccount, currentAccount) {
    return requestAccount === currentAccount;
}

function resumeCreateOrder(submitAccount, currentAccount) {
    $stateMachine: for (;;) {
        switch (0) {
            case 0: {
                const comparator = sameOwner;
                let requestAccount;
                $checkNotNull: do {
                    if (submitAccount == null) {
                        throw new Error("Required value was null.");
                    }
                    requestAccount = submitAccount;
                    break $checkNotNull;
                } while (false);

                if (comparator(requestAccount, currentAccount)) {
                    return "same";
                }
                return "changed";
            }
            default:
                continue $stateMachine;
        }
    }
}

console.log(resumeCreateOrder("account-a", "account-b"));
console.log(resumeCreateOrder("account-a", "account-a"));
try {
    resumeCreateOrder(null, "account-a");
    console.log("wrong null tail");
} catch (error) {
    console.log(error.message);
}

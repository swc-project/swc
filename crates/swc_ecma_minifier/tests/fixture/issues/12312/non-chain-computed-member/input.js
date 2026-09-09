function getObject() {
    return {};
}

console.log(getObject()["callprop"], this["thisprop"], ({})["objectprop"]);

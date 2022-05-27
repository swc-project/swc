const a = {
    BAR: 0
};
console.log(a.BAR);
console.log(++CONFIG.DEBUG);
console.log(++CONFIG.VALUE);
console.log(++CONFIG["VAL" + "UE"]);
console.log(++DEBUG[CONFIG.VALUE]);
CONFIG.VALUE.FOO = "bar";
console.log(CONFIG);

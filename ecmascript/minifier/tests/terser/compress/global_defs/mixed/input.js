const FOO = { BAR: 0 };
console.log(FOO.BAR);
console.log(++CONFIG.DEBUG);
console.log(++CONFIG.VALUE);
console.log(++CONFIG["VAL" + "UE"]);
console.log(++DEBUG[CONFIG.VALUE]);
CONFIG.VALUE.FOO = "bar";
console.log(CONFIG);

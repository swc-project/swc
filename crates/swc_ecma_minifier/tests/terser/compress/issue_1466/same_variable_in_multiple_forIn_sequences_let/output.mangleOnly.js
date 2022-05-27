var a = [
    "a",
    "b",
    "c"
];
for(let b in a){
    console.log(b);
    let c;
    c = [
        "e",
        "f",
        "g"
    ];
    for(let d in a){
        console.log(d);
    }
}

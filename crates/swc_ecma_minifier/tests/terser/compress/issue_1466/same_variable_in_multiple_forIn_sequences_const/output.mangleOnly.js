var a = [
    "a",
    "b",
    "c"
];
for(const b in a){
    console.log(b);
    let c;
    c = [
        "e",
        "f",
        "g"
    ];
    for(const d in a){
        console.log(d);
    }
}

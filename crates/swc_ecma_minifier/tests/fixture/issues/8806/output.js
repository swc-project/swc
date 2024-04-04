function logTheNine() {
    ((theThree, theNine)=>{
        console.log(theNine);
    })(...[
        3,
        9
    ]);
}
logTheNine();

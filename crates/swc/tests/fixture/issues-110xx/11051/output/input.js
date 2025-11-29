var myObject = {
    value: 5,
    isEven: true
};
function checkIfEven() {
    var ref;
    if ((ref = myObject, isEven = ref.isEven, ref).isEven) {
        return "Number is even";
    } else {
        return "Number is odd";
    }
}
function func1() {
    return checkIfEven();
}
function main() {
    var res = func1();
    console.log(res);
}
main();

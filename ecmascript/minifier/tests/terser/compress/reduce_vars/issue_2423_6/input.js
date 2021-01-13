function x() {
    y();
}
function y() {
    console.log(1);
}
function z() {
    function y() {
        console.log(2);
    }
    x();
    y();
}
z();
z();

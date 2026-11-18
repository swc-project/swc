const value = 1;
const values = [
    2,
    3
];
(function(unused, used) {
    console.log(used);
})(0, ...values);

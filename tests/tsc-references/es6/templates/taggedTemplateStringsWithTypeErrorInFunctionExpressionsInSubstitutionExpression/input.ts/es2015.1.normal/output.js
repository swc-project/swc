function foo(...rest) {
}
foo`${function(x) {
    x = "bad";
}}`;

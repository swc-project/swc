var a = "foobar" + boo() + "bazxy";
var b = ["foo-bar", boo(), "baz-x-y"].join("-");
var c = ["foo", "bar", boo(), "baz", "x", "y"].join("really-long-separator");
var d = ["foo-bar", boo(), "foo+1+2+3+bar-baz-x-y"].join("-");
var e = ["foo", "bar", boo(), "foo+1+2+3+bar", "baz", "x", "y"].join(
    "really-long-separator"
);
var f = "strstr" + variable + "foobarmoo" + foo;

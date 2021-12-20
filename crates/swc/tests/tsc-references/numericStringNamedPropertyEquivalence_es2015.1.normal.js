// Each of these types has an error in it. 
// String named and numeric named properties conflict if they would be equivalent after ToNumber on the property name.
class C {
}
var a;
var b = {
    "0": '',
    0: ''
};

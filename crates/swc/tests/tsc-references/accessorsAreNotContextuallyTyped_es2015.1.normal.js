// accessors are not contextually typed
class C {
    set x(v) {}
    get x() {
        return (x)=>"";
    }
}
var c;
var r = c.x(''); // string

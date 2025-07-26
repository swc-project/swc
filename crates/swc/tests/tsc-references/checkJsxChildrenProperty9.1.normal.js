//// [file.tsx]
// OK
var k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
var k2 = <div> <h2> Hello </h2> {function(user) {
    return <h2>{user.name}</h2>;
}}</div>;
var k3 = <div> {1} {"That is a number"} </div>;

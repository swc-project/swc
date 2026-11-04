
class Foo extends (function(){}) {
constructor(){
  var foo = (...rest) => [rest, this];

  if (true){
      console.log(super(), foo());
  } else {
      super();
      console.log(foo());
  }
}
}

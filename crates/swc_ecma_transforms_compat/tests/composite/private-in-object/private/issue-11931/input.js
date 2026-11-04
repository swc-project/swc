class Foo {
  #x;
  constructor(o) { #x in o; }
} 
class Bar extends Foo {
  #y = null;
} 
new Foo({});

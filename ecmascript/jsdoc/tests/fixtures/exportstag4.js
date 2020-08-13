define(
   /** @exports some/module */
   function () {
       /** @class */
       function myClass() {}

       /** Some method */
       myClass.prototype.myMethod = function () {};

       return new myClass();
   }
);
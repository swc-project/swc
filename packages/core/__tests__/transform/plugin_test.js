const swc = require("../../");
const Visitor = require("../../Visitor").default;

{
    const src = `
  'use strict';
  
  class Foo {
    foo() {}
  }
  
  class Bar extends Foo {
    foo() {
      super.foo();
    }
    async bar() {}
  }
  
  class Baz extends Bar {
    foo() {
      super.foo();
      this.baz()
    }
    baz() {
  
    }
    async other() {
      this.baz()
      await super.bar()
    }
  }
  
  function red( color )
  {
      let foo = 3.14;
      return color >> 16;
  }
  
  function green( color )
  {
      return ( color >> 8 ) & 0xFF;
  }
  
  /**
   * Extract blue color out of a color integer:
   *
   * 0x00DEAD -> 0xAD
   *
   * @param  {Number} color
   * @return {Number}
   */
  function blue( color )
  {
      return color & 0xFF;
  }
  
  function intToHex( int )
  {
      const mask = '#000000';
  
      const hex = int.toString( 16 );
  
      return mask.substring( 0, 7 - hex.length ) + hex;
  }
   
  function hexToInt( hex )
  {
      return parseInt( hex.substring( 1 ), 16 );
  }


  // Verify that visitor can handle class declaration.
  class Prent {}
  class Child extends Parent {}
  

  // Verify that visitor can handle new expression.
  new Child(foo);
  new Child(...foo);


  // Verify that visitor can handle call expressions.
  call(...foo);
  call(foo);

  // Verify that visitor can handle tagged template expressions.
  css\`color: red\`;

  let arr = [elem, , ...foo];

  module.exports = {
      red,
      green,
      blue,
      intToHex,
      hexToInt,
  };
  `;

    it("works", () => {
        swc.transformSync(src, {
            plugin: (m) => m,
        });
    });

    it("works with visitor", () => {
        swc.transformSync(src, {
            plugin: (m) => {
                let v = new Visitor();
                return v.visitProgram(m);
            },
        });
    });
}

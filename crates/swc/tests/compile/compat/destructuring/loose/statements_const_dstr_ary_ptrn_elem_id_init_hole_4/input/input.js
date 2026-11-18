function* foo() {
        yield 1;
        yield 2;
      }
      
      let bar = foo();
      
      const [x = bar.next().value, y] = [, bar.next().value];
      console.log(x, y);
      
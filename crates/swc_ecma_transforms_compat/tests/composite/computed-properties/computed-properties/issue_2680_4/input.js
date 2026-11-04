
const obj = {
  foo() {
      const obj2 = {
          get [1]() {
              return 42;
          },
      };
      return obj2;
  },
};


    const Base = {
        test: 1,
    };
      
    const obj = {
        test: 2,

        get() {
            return super.test;
        },
    };
    Object.setPrototypeOf(obj, Base);
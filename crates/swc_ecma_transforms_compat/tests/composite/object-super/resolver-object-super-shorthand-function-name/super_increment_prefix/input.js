var Base = {
        test: "1"
    };
      
    var obj = {
        bar() {
            return ++super.test;
        }
    };
    Object.setPrototypeOf(obj, Base);
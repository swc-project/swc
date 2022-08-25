class Base {
    superMethod() {
      return 'good';
    }
  }
  
  class Sub extends Base {
    superMethod() {
      return 'bad';
    }
  
    #privateMethod() {
      return super.superMethod();
    }
  
    publicMethod() {
      return this.#privateMethod();
    }
  }
  
  (new Sub()).publicMethod().toEqual('good');
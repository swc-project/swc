function DefineAction() { return function(_a, _b, c) { return c } }

    class Base {
      constructor() {
        this.action = 1
      }
    }

    class Child extends Base {
      @DefineAction() declare action: number

      callApi() {
        console.log(this.action) // undefined
        return this.action
      }
    }

    const c = new Child()

    c.callApi()
    expect(c.callApi()).not.toBe(undefined)
    expect(c.action).toBe(1);

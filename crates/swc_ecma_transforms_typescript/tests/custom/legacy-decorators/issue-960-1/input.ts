
    function DefineAction() {
        return (target, property) => {
            console.log(target, property);
        }
    }
    class Base {
        constructor() {
          this.action = new Subject()
        }
      }

      class Child extends Base {
        @DefineAction() action: Observable<void>

        callApi() {
          console.log(this.action) // undefined
        }
      }

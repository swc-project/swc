
    function MyClass () {}

    MyClass.prototype.handle = function () {
        console.log('this is MyClass handle')
    }

    MyClass.prototype.init = async function(param1) {
        const a = 1;

        if (!param1) {
            console.log(this)
            this.handle()
        }

        if (param1 === a) {
            return false
        }

        return true
    }

    const myclass = new MyClass()
    myclass.handle()
  
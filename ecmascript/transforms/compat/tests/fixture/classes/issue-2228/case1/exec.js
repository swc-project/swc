class Foo { }

class Bar extends Foo {
    events = {
        "abc: click": function abcClick() {
            this.data = 123;
            console.log(this);
        }
    }

    setData() {
        this.data = 456
    }
}

const bar = new Bar();
console.log(bar.events)
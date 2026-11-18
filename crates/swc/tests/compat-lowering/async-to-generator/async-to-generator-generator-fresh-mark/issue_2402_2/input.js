
  function MyClass(item) {
    this.item = item;
    console.log('Constructor | this.item', this.item);
  }

  MyClass.prototype.fun = async function fun() {
    console.log('fun | this.item', this.item);
    return this.item;
  };

  const tmp = new MyClass({ foo: 'bar' });

  tmp.fun().then((res) => {
    console.log('fun result | item', res);
  });

for (let i = 0, read = () => i;;) {
    [i = function () {}] = [];
    console.log(i.name, read());
    ({ i = () => i } = {});
    console.log(i.name, i() === i);
    ({ value: i = class {} } = {});
    console.log(i.name);
    i = 0;
    i ||= function () {};
    console.log(i.name);
    i &&= class {};
    console.log(i.name);
    i = null;
    i ??= () => i;
    console.log(i.name);
    i = class { static value = this.name };
    console.log(i.name, i.value);
    break;
}

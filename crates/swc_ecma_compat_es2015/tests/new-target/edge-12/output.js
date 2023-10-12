function foo() {
    const a = ()=>this instanceof foo ? this.constructor : void 0;
}

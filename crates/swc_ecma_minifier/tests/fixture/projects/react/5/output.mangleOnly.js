var a = {};
{
    Object.freeze(a);
}function b(b, c, d) {
    this.props = b;
    this.context = c;
    this.refs = a;
    this.updater = d || ReactNoopUpdateQueue;
}
b.prototype.isReactComponent = {};

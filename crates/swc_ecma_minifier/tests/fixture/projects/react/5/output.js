var emptyObject = {};
/**
 * Base class helpers for the updating state of a component.
 */ function Component(props, context, updater) {
    this.props = props, this.context = context, this.refs = emptyObject, // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
}
Object.freeze(emptyObject), Component.prototype.isReactComponent = {};

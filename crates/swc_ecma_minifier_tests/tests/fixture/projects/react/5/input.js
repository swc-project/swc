var emptyObject = {};

{
    Object.freeze(emptyObject);
}
/**
 * Base class helpers for the updating state of a component.
 */

function Component(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

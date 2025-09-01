export const obj = {
    tweener: function(props, callback) {
        jQuery.isFunction(props) ? (callback = props, props = [
            "*"
        ]) : props = props.split(" ");
        for(var prop, index = 0, length = props.length; index < length; index++)prop = props[index], tweeners[prop] = tweeners[prop] || [], tweeners[prop].unshift(callback);
    }
};

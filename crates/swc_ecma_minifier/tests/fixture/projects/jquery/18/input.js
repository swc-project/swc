export const obj = {
    tweener: function (props, callback) {
        if (jQuery.isFunction(props)) {
            callback = props;
            props = ["*"];
        } else {
            props = props.split(" ");
        }

        var prop,
            index = 0,
            length = props.length;

        for (; index < length; index++) {
            prop = props[index];
            tweeners[prop] = tweeners[prop] || [];
            tweeners[prop].unshift(callback);
        }
    },
};

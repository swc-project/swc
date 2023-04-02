function get_prototype_of(o) {
    get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return get_prototype_of(o);
}

export default function _get_prototype_of(o) {
    return get_prototype_of(o);
}

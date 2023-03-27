function set_prototype_of(o, p) {
    set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return set_prototype_of(o, p);
}

export default function _set_prototype_of(o, p) {
    return set_prototype_of(o, p);
}

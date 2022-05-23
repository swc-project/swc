function validateFragmentProps(fragment) {
    for(var keys = Object.keys(fragment.props), i = 0; i < keys.length; i++){
        var key = keys[i];
        if ("children" !== key && "key" !== key) {
            setCurrentlyValidatingElement$1(fragment), error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key), setCurrentlyValidatingElement$1(null);
            break;
        }
    }
    null !== fragment.ref && (setCurrentlyValidatingElement$1(fragment), error("Invalid attribute `ref` supplied to `React.Fragment`."), setCurrentlyValidatingElement$1(null));
}

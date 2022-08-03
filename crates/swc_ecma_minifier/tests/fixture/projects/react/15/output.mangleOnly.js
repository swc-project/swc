function l(l) {
    {
        var r = Object.keys(l.props);
        for(var n = 0; n < r.length; n++){
            var f = r[n];
            if (f !== "children" && f !== "key") {
                setCurrentlyValidatingElement$1(l);
                error("Invalid prop `%s` supplied to `React.Fragment`. " + "React.Fragment can only have `key` and `children` props.", f);
                setCurrentlyValidatingElement$1(null);
                break;
            }
        }
        if (l.ref !== null) {
            setCurrentlyValidatingElement$1(l);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
        }
    }
}

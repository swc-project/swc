function a(a) {
    {
        var d = Object.keys(a.props);
        for(var b = 0; b < d.length; b++){
            var c = d[b];
            if (c !== "children" && c !== "key") {
                setCurrentlyValidatingElement$1(a);
                error("Invalid prop `%s` supplied to `React.Fragment`. " + "React.Fragment can only have `key` and `children` props.", c);
                setCurrentlyValidatingElement$1(null);
                break;
            }
        }
        if (a.ref !== null) {
            setCurrentlyValidatingElement$1(a);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
        }
    }
}

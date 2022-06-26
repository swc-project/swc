function a(a) {
    {
        var b = Object.keys(a.props);
        for(var c = 0; c < b.length; c++){
            var d = b[c];
            if (d !== "children" && d !== "key") {
                setCurrentlyValidatingElement$1(a);
                error("Invalid prop `%s` supplied to `React.Fragment`. " + "React.Fragment can only have `key` and `children` props.", d);
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

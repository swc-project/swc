function e(e) {
    {
        var r = Object.keys(e.props);
        for(var t = 0; t < r.length; t++){
            var n = r[t];
            if (n !== "children" && n !== "key") {
                setCurrentlyValidatingElement$1(e);
                error("Invalid prop `%s` supplied to `React.Fragment`. " + "React.Fragment can only have `key` and `children` props.", n);
                setCurrentlyValidatingElement$1(null);
                break;
            }
        }
        if (e.ref !== null) {
            setCurrentlyValidatingElement$1(e);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
        }
    }
}

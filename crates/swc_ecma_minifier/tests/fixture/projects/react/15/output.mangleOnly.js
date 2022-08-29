function e(e) {
    {
        var a = Object.keys(e.props);
        for(var n = 0; n < a.length; n++){
            var r = a[n];
            if (r !== "children" && r !== "key") {
                setCurrentlyValidatingElement$1(e);
                error("Invalid prop `%s` supplied to `React.Fragment`. " + "React.Fragment can only have `key` and `children` props.", r);
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

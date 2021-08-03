`outer${{
    a: {
        b: 1
    }
}}bar${`nested${function() {
    return 2;
}}endnest`}end`;

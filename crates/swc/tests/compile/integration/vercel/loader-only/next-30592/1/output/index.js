var navigation = function navigation(path) {
    return [
        {
            name: "Home",
            href: "/",
            get current () {
                return this.href === path;
            }
        },
        {
            name: "Dashboard",
            href: "/dashboard",
            get current () {
                return this.href === path;
            }
        }
    ];
};

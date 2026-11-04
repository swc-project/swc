const navigation = (path) => [
    {
        name: "Home",
        href: `/`,
        get current() {
            return this.href === path;
        },
    },
    {
        name: "Dashboard",
        href: `/dashboard`,
        get current() {
            return this.href === path;
        },
    },
];

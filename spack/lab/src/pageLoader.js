export default function pageLoader(platform = 'desktop', componentName) {
    switch (platform) {
        case "desktop":
            return import(`./components/desktop/${componentName}`);

        default:
            return import(`./components/mobile/${componentName}`);
    }
}
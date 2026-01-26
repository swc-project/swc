export default {
    include: ["__tests__/**/*.{js,jsx,ts,tsx}"],
    globals: true,
    tools: {
        rspack: {
            module: {
                rules: [],
                parser: {
                    javascript: {
                        url: false,
                    },
                },
            },
        },
    },
};

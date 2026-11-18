if (cond) {
    async function nested() {
        await work();
    }

    const arrow = async () => await work();

    class Local {
        async method() {
            await work();
        }
    }
}

class Top {
    async method() {
        await work();
    }
}

export const value = 1;

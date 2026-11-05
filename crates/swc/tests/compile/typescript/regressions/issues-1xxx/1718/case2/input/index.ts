async function scanUser(groups: { users: number[] }[]) {
    await Promise.all(
        groups.map(async ({ users }) => {
            for (const user of users) {
                console.log("user", user);
                await new Promise((resolve) => setTimeout(resolve, 30));
            }
        })
    );
}

scanUser([{ users: [1, 2, 3, 4, 5] }, { users: [11, 12, 13, 14, 15] }]);

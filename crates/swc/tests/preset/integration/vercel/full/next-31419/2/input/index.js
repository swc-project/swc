Promise.all(assignAll).then(async function (value) {
    let removeQuery = `DELETE FROM "TABLE" WHERE "UUID" IN ( `;

    for (let key in obj) {
        let o = obj[key];
        removeQuery += `'${o.id}', `;

        let userlist = await listOfUser(o.id);
        userlist.forEach((user) => {
            insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${
                o.id
            }', now());`;
        });
    }
});

export const listOfUser = function (id) {
    return new Promise(async function (resolve, reject) {
        const query1 = `Select Distinct id from "TABLE" Where id = '${id}' And user_id IS not null`;

        postgreSQL.query(query1, null, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
};

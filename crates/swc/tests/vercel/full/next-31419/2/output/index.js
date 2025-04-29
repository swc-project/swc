import { _ as e } from "@swc/helpers/_/_async_to_generator";
Promise.all(assignAll).then(function(n) {
    return e(function*() {
        for(let e in obj){
            let n = obj[e];
            n.id, (yield listOfUser(n.id)).forEach((e)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${n.id}', now());`;
            });
        }
    })();
});
export const listOfUser = function(n) {
    return new Promise(function(r, t) {
        return e(function*() {
            let e = `Select Distinct id from "TABLE" Where id = '${n}' And user_id IS not null`;
            postgreSQL.query(e, null, function(e, n) {
                e ? t(e) : r(n.rows);
            });
        })();
    });
};

import * as a from "@swc/helpers";
Promise.all(assignAll).then(function() {
    var b = a.asyncToGenerator(function*(c) {
        let d = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ';
        for(let b in obj){
            let a = obj[b];
            a.id;
            let e;
            (yield listOfUser(a.id)).forEach((b)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${a.id}', now());`;
            });
        }
    });
    return function(c) {
        return b.apply(this, arguments);
    };
}());
export const listOfUser = function(c) {
    var b;
    return new Promise((b = a.asyncToGenerator(function*(b, d) {
        let a = `Select Distinct id from "TABLE" Where id = '${c}' And user_id IS not null`;
        postgreSQL.query(a, null, function(a, c) {
            a ? d(a) : b(c.rows);
        });
    }), function(b, d) {
        return b.apply(this, arguments);
    }));
};

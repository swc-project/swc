import * as a from "@swc/helpers";
Promise.all(assignAll).then(function() {
    var b = a.asyncToGenerator(function*(e) {
        let b = "DELETE FROM \"TABLE\" WHERE \"UUID\" IN ( ";
        for(let c in obj){
            let a = obj[c];
            b += `'${a.id}', `;
            let d = yield listOfUser(a.id);
            d.forEach((b)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${a.id}', now());`;
            });
        }
    });
    return function(e) {
        return b.apply(this, arguments);
    };
}());
export const listOfUser = function(c) {
    var b;
    return new Promise((b = a.asyncToGenerator(function*(b, d) {
        const a = `Select Distinct id from "TABLE" Where id = '${c}' And user_id IS not null`;
        postgreSQL.query(a, null, function(a, c) {
            a ? d(a) : b(c.rows);
        });
    }), function(b, d) {
        return b.apply(this, arguments);
    }));
};

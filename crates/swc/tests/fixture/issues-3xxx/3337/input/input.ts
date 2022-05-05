import * as joiful from "joiful";

class Schema {
    @joiful.string().guid().required()
    public id: string;
}

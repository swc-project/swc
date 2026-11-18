namespace API {
    export let url = "/";

    export function update(value: string) {
        url = value;
    }
}

API.update("/new");
console.log(API.url);

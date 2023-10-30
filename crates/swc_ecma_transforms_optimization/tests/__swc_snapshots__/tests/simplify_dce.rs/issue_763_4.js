import { RESOURCE_FACEBOOK, RESOURCE_INSTAGRAM, RESOURCE_WEBSITE } from './consts';
const resources = [
    {
        value: RESOURCE_WEBSITE,
        label: 'Webové stránky'
    },
    {
        value: RESOURCE_FACEBOOK,
        label: 'Facebook'
    },
    {
        value: RESOURCE_INSTAGRAM,
        label: 'Instagram'
    }
];
export function foo(websites) {
    const a = resources.map((resource)=>({
            value: resource.value
        }));
    const b = website.type_id === RESOURCE_INSTAGRAM ? 'text' : 'url';
    return a + b;
}

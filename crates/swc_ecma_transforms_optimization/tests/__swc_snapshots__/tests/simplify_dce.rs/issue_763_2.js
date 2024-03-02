import { RESOURCE_FACEBOOK, RESOURCE_INSTAGRAM, RESOURCE_WEBSITE } from '../../../../consts';
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
resources.map(console.log.bind(console));

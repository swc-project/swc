import { toSnakeCase } from './components/shared/to-snake-case'

const config = {
    REACT_APP_CITY_OSTRAVA_URL: 'https://www.sportujvostrave.cz',
    REACT_APP_CITY_OLOMOUC_URL: 'https://www.sportujvolomouci.cz',
    REACT_APP_CITY_CHEB_URL: 'https://www.sportujvchebu.cz',

    REACT_APP_AVAILABLE_UNLOGGED_SHOW: '["eventSlug","clubId","sportVenueSlug"]',

    REACT_APP_MUST_BE_LOGGED_SUBPAGES: true,

    REACT_APP_SYSTEM: 'sportnect',
    REACT_APP_SYSTEM_NAME: 'Sportnect',
    REACT_APP_CONTACT_EMAIL: 'sportnect@sportnect.com',
    REACT_APP_INFO_EMAIL: 'mailto:info@sportnect.com',
    REACT_APP_SUPPORT_EMAIL: 'podpora@sportnect.com',

    REACT_APP_IOS_STORE: 'https://itunes.apple.com/cz/app/sportnect/id1404300192?l=cs',
    REACT_APP_ANDROID_STORE: 'https://play.google.com/store/apps/details?id=cz.sportnect',

    REACT_APP_LANDING_LOCATION_PATHNAME: '/',
    REACT_APP_LANDING_IMAGES_FOLDER: '/images/landing/',
    REACT_APP_IMAGES_FOLDER: '/images/sportnect/',
    REACT_APP_BROWSERS_IMAGES_FOLDER: '/images/browser/',

    REACT_APP_SHOW_STORE_BANNER: true,
    REACT_APP_SHOW_ACTUALITY: true,

    REACT_APP_FOOTER_FACEBOOK_LINK: 'https://facebook.com/sportnect/',
    REACT_APP_FOOTER_FACEBOOK_GROUP_LINK: 'https://www.facebook.com/groups/627479584758447',
    REACT_APP_FOOTER_INSTAGRAM_LINK: 'https://www.instagram.com/sportnectcom/',
    REACT_APP_FOOTER_TIKTOK_LINK: 'https://www.tiktok.com/@sportnectcom',
    REACT_APP_FOOTER_FACEBOOK_TAG: 'Sportnect',
    REACT_APP_FOOTER_INSTAGRAM_TAG: '#sportnect',
    REACT_APP_FOOTER_MOBILE_TEXT: 'Stáhněte si aplikaci Sportnect',
    REACT_APP_FOOTER_SUB_LOGO: '<a href="https://www.sportnect.com" class="d-flex" target="_blank" rel="noopener noreferrer"><img src="/images/sn-logo-new.svg" alt="sportnect-logo" width="143" height="33" /></a>',
    REACT_APP_FOOTER_LANGUAGE: true,

    REACT_APP_SPORTNECT_LANDING: true,
    REACT_APP_SPORTNECT_FOOTER: true,

    REACT_APP_SPORTNECT_ROUTES: true,

    REACT_APP_PASS_MARKERS_TO_CITY: false,
    REACT_APP_SPORT_VENUE_DETAIL: true,

    REACT_APP_YT_CREATE_EVENT_LINK: 'https://www.youtube.com/embed/fwBaoZB_bxA',
    REACT_APP_YT_CREATE_TOURNAMENT_1: 'https://www.youtube.com/embed/4iIub24LiMY',
    REACT_APP_YT_CREATE_TOURNAMENT_2: 'https://www.youtube.com/embed/dl4WPFxc_9A',

    REACT_APP_FOOTER_LINKS_LEFT: {
        'proc-sportnect': 'Proč sportnect',
        'o-nas': 'O nás',
        'media': 'Média',
        'mesta': 'Města',
    },

    REACT_APP_FOOTER_LINKS_RIGHT: {
        'fanousek-sportovec': 'Fanoušci a sportovci',
        'turnaje': 'Organizátor turnaje',
        'trener': 'Týmy a kluby',
        'rodice-a-deti': 'Rodiče a děti',
        'pridat-sportoviste': 'Sportoviště',
    },

    REACT_APP_REDIRECT_GROUP_MEMBERS: true,

    REACT_APP_ENTITIES_DEFAULT_COUNT: 8,
    REACT_APP_ENTITIES_LOAD_USERS: true,

    REACT_APP_DEFAULT_DESCRIPTION: 'Sportujete? Jste členem nějakého klubu v sociální sítí Sportnect?',

    REACT_APP_TRANSLATION_ROUTES: {
        entities: 'entities',
        events: 'events',
        clubs: 'clubs',
        sportVenues: 'sport-venues',
        sportnections: 'sportnections',
        notifications: 'notifications',
        chat: 'chat',
        news: 'news',
        contact: 'contact',
    },

    REACT_APP_DEFAULT_LAT: '49.819657',
    REACT_APP_DEFAULT_LNG: '18.0973114',

    REACT_APP_AUTH_ROUTES: {
        login: 'login',
        signup: 'signup',
        forgottenPassword: 'forgotten-password',
        signpostLoginRoute: 'login-signpost',
    },

    REACT_APP_WEBVIEW_AUTH_FACEBOOK: true,
}

const dataset = document.getElementById('platform-body').dataset
const dataConfig = Object.keys(dataset).reduce((element, key) => (element['REACT_APP_' + toSnakeCase(key).toUpperCase()] = dataset[key], element), {})

window.APP_CONFIG = Object.assign({}, config, dataConfig)

require('./index')

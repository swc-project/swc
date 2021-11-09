// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/x/upperCase.ts


import { LanguageSpecific } from 'https://deno.land/x/case/types.ts';

const LANGUAGES: LanguageSpecific = {
    tr: {
        regexp: /[\u0069]/g,
        map: {
            i: '\u0130'
        }
    },
    az: {
        regexp: /[\u0069]/g,
        map: {
            i: '\u0130'
        }
    },
    lt: {
        regexp: /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
        map: {
            i̇: '\u0049',
            j̇: '\u004A',
            į̇: '\u012E',
            i̇̀: '\u00CC',
            i̇́: '\u00CD',
            i̇̃: '\u0128'
        }
    }
};

export default function ( str: string, locale?: string ): string {
    const lang = locale && LANGUAGES[ locale ];

    str = str == null ? '' : String( str );

    if ( lang ) {
        str = str.replace( lang.regexp, function ( m ) {
            return lang.map[ m ];
        } );
    }

    return str.toUpperCase();
}

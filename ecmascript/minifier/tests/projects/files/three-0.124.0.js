var self = self || {};// File:src/Three.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var THREE = { REVISION: '77' };

//

if ( typeof define === 'function' && define.amd ) {

	define( 'three', THREE );

} else if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {

	module.exports = THREE;

}

// Polyfills

if ( Number.EPSILON === undefined ) {

	Number.EPSILON = Math.pow( 2, - 52 );

}

//

if ( Math.sign === undefined ) {

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : + x;

	};

}

if ( Function.prototype.name === undefined ) {

	// Missing in IE9-11.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

	Object.defineProperty( Function.prototype, 'name', {

		get: function () {

			return this.toString().match( /^\s*function\s*(\S*)\s*\(/ )[ 1 ];

		}

	} );

}

if ( Object.assign === undefined ) {

	// Missing in IE.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

	( function () {

		Object.assign = function ( target ) {

			'use strict';

			if ( target === undefined || target === null ) {

				throw new TypeError( 'Cannot convert undefined or null to object' );

			}

			var output = Object( target );

			for ( var index = 1; index < arguments.length; index ++ ) {

				var source = arguments[ index ];

				if ( source !== undefined && source !== null ) {

					for ( var nextKey in source ) {

						if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

							output[ nextKey ] = source[ nextKey ];

						}

					}

				}

			}

			return output;

		};

	} )();

}

//

Object.assign( THREE, {

	// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

	MOUSE: { LEFT: 0, MIDDLE: 1, RIGHT: 2 },

	// GL STATE CONSTANTS

	CullFaceNone: 0,
	CullFaceBack: 1,
	CullFaceFront: 2,
	CullFaceFrontBack: 3,

	FrontFaceDirectionCW: 0,
	FrontFaceDirectionCCW: 1,

	// SHADOWING TYPES

	BasicShadowMap: 0,
	PCFShadowMap: 1,
	PCFSoftShadowMap: 2,

	// MATERIAL CONSTANTS

	// side

	FrontSide: 0,
	BackSide: 1,
	DoubleSide: 2,

	// shading

	FlatShading: 1,
	SmoothShading: 2,

	// colors

	NoColors: 0,
	FaceColors: 1,
	VertexColors: 2,

	// blending modes

	NoBlending: 0,
	NormalBlending: 1,
	AdditiveBlending: 2,
	SubtractiveBlending: 3,
	MultiplyBlending: 4,
	CustomBlending: 5,

	// custom blending equations
	// (numbers start from 100 not to clash with other
	// mappings to OpenGL constants defined in Texture.js)

	AddEquation: 100,
	SubtractEquation: 101,
	ReverseSubtractEquation: 102,
	MinEquation: 103,
	MaxEquation: 104,

	// custom blending destination factors

	ZeroFactor: 200,
	OneFactor: 201,
	SrcColorFactor: 202,
	OneMinusSrcColorFactor: 203,
	SrcAlphaFactor: 204,
	OneMinusSrcAlphaFactor: 205,
	DstAlphaFactor: 206,
	OneMinusDstAlphaFactor: 207,

	// custom blending source factors

	//ZeroFactor: 200,
	//OneFactor: 201,
	//SrcAlphaFactor: 204,
	//OneMinusSrcAlphaFactor: 205,
	//DstAlphaFactor: 206,
	//OneMinusDstAlphaFactor: 207,
	DstColorFactor: 208,
	OneMinusDstColorFactor: 209,
	SrcAlphaSaturateFactor: 210,

	// depth modes

	NeverDepth: 0,
	AlwaysDepth: 1,
	LessDepth: 2,
	LessEqualDepth: 3,
	EqualDepth: 4,
	GreaterEqualDepth: 5,
	GreaterDepth: 6,
	NotEqualDepth: 7,


	// TEXTURE CONSTANTS

	MultiplyOperation: 0,
	MixOperation: 1,
	AddOperation: 2,

	// Tone Mapping modes

	NoToneMapping: 0, // do not do any tone mapping, not even exposure (required for special purpose passes.)
	LinearToneMapping: 1, // only apply exposure.
	ReinhardToneMapping: 2,
	Uncharted2ToneMapping: 3, // John Hable
	CineonToneMapping: 4, // optimized filmic operator by Jim Hejl and Richard Burgess-Dawson

	// Mapping modes

	UVMapping: 300,

	CubeReflectionMapping: 301,
	CubeRefractionMapping: 302,

	EquirectangularReflectionMapping: 303,
	EquirectangularRefractionMapping: 304,

	SphericalReflectionMapping: 305,
	CubeUVReflectionMapping: 306,
	CubeUVRefractionMapping: 307,

	// Wrapping modes

	RepeatWrapping: 1000,
	ClampToEdgeWrapping: 1001,
	MirroredRepeatWrapping: 1002,

	// Filters

	NearestFilter: 1003,
	NearestMipMapNearestFilter: 1004,
	NearestMipMapLinearFilter: 1005,
	LinearFilter: 1006,
	LinearMipMapNearestFilter: 1007,
	LinearMipMapLinearFilter: 1008,

	// Data types

	UnsignedByteType: 1009,
	ByteType: 1010,
	ShortType: 1011,
	UnsignedShortType: 1012,
	IntType: 1013,
	UnsignedIntType: 1014,
	FloatType: 1015,
	HalfFloatType: 1025,

	// Pixel types

	//UnsignedByteType: 1009,
	UnsignedShort4444Type: 1016,
	UnsignedShort5551Type: 1017,
	UnsignedShort565Type: 1018,

	// Pixel formats

	AlphaFormat: 1019,
	RGBFormat: 1020,
	RGBAFormat: 1021,
	LuminanceFormat: 1022,
	LuminanceAlphaFormat: 1023,
	// THREE.RGBEFormat handled as THREE.RGBAFormat in shaders
	RGBEFormat: THREE.RGBAFormat, //1024;
	DepthFormat: 1026,

	// DDS / ST3C Compressed texture formats

	RGB_S3TC_DXT1_Format: 2001,
	RGBA_S3TC_DXT1_Format: 2002,
	RGBA_S3TC_DXT3_Format: 2003,
	RGBA_S3TC_DXT5_Format: 2004,

	// PVRTC compressed texture formats

	RGB_PVRTC_4BPPV1_Format: 2100,
	RGB_PVRTC_2BPPV1_Format: 2101,
	RGBA_PVRTC_4BPPV1_Format: 2102,
	RGBA_PVRTC_2BPPV1_Format: 2103,

	// ETC compressed texture formats

	RGB_ETC1_Format: 2151,

	// Loop styles for AnimationAction

	LoopOnce: 2200,
	LoopRepeat: 2201,
	LoopPingPong: 2202,

	// Interpolation

	InterpolateDiscrete: 2300,
	InterpolateLinear: 2301,
	InterpolateSmooth: 2302,

	// Interpolant ending modes

	ZeroCurvatureEnding: 2400,
	ZeroSlopeEnding: 2401,
	WrapAroundEnding: 2402,

	// Triangle Draw modes

	TrianglesDrawMode: 0,
	TriangleStripDrawMode: 1,
	TriangleFanDrawMode: 2,

	// Texture Encodings

	LinearEncoding: 3000, // No encoding at all.
	sRGBEncoding: 3001,
	GammaEncoding: 3007, // uses GAMMA_FACTOR, for backwards compatibility with WebGLRenderer.gammaInput/gammaOutput

	// The following Texture Encodings are for RGB-only (no alpha) HDR light emission sources.
	// These encodings should not specified as output encodings except in rare situations.
	RGBEEncoding: 3002, // AKA Radiance.
	LogLuvEncoding: 3003,
	RGBM7Encoding: 3004,
	RGBM16Encoding: 3005,
	RGBDEncoding: 3006, // MaxRange is 256.

	// Depth packing strategies

	BasicDepthPacking: 3200, // for writing to float textures for high precision or for visualizing results in RGB buffers
	RGBADepthPacking: 3201 // for packing into RGBA buffers.

} );

// File:src/math/Color.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Color = function ( r, g, b ) {

	if ( g === undefined && b === undefined ) {

		// r is THREE.Color, hex or string
		return this.set( r );

	}

	return this.setRGB( r, g, b );

};

THREE.Color.prototype = {

	constructor: THREE.Color,

	r: 1, g: 1, b: 1,

	set: function ( value ) {

		if ( value instanceof THREE.Color ) {

			this.copy( value );

		} else if ( typeof value === 'number' ) {

			this.setHex( value );

		} else if ( typeof value === 'string' ) {

			this.setStyle( value );

		}

		return this;

	},

	setScalar: function ( scalar ) {

		this.r = scalar;
		this.g = scalar;
		this.b = scalar;

	},

	setHex: function ( hex ) {

		hex = Math.floor( hex );

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	},

	setRGB: function ( r, g, b ) {

		this.r = r;
		this.g = g;
		this.b = b;

		return this;

	},

	setHSL: function () {

		function hue2rgb( p, q, t ) {

			if ( t < 0 ) t += 1;
			if ( t > 1 ) t -= 1;
			if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
			if ( t < 1 / 2 ) return q;
			if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
			return p;

		}

		return function ( h, s, l ) {

			// h,s,l ranges are in 0.0 - 1.0
			h = THREE.Math.euclideanModulo( h, 1 );
			s = THREE.Math.clamp( s, 0, 1 );
			l = THREE.Math.clamp( l, 0, 1 );

			if ( s === 0 ) {

				this.r = this.g = this.b = l;

			} else {

				var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
				var q = ( 2 * l ) - p;

				this.r = hue2rgb( q, p, h + 1 / 3 );
				this.g = hue2rgb( q, p, h );
				this.b = hue2rgb( q, p, h - 1 / 3 );

			}

			return this;

		};

	}(),

	setStyle: function ( style ) {

		function handleAlpha( string ) {

			if ( string === undefined ) return;

			if ( parseFloat( string ) < 1 ) {

				console.warn( 'THREE.Color: Alpha component of ' + style + ' will be ignored.' );

			}

		}


		var m;

		if ( m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec( style ) ) {

			// rgb / hsl

			var color;
			var name = m[ 1 ];
			var components = m[ 2 ];

			switch ( name ) {

				case 'rgb':
				case 'rgba':

					if ( color = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

						// rgb(255,0,0) rgba(255,0,0,0.5)
						this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
						this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
						this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

						handleAlpha( color[ 5 ] );

						return this;

					}

					if ( color = /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

						// rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
						this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
						this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
						this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

						handleAlpha( color[ 5 ] );

						return this;

					}

					break;

				case 'hsl':
				case 'hsla':

					if ( color = /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

						// hsl(120,50%,50%) hsla(120,50%,50%,0.5)
						var h = parseFloat( color[ 1 ] ) / 360;
						var s = parseInt( color[ 2 ], 10 ) / 100;
						var l = parseInt( color[ 3 ], 10 ) / 100;

						handleAlpha( color[ 5 ] );

						return this.setHSL( h, s, l );

					}

					break;

			}

		} else if ( m = /^\#([A-Fa-f0-9]+)$/.exec( style ) ) {

			// hex color

			var hex = m[ 1 ];
			var size = hex.length;

			if ( size === 3 ) {

				// #ff0
				this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 0 ), 16 ) / 255;
				this.g = parseInt( hex.charAt( 1 ) + hex.charAt( 1 ), 16 ) / 255;
				this.b = parseInt( hex.charAt( 2 ) + hex.charAt( 2 ), 16 ) / 255;

				return this;

			} else if ( size === 6 ) {

				// #ff0000
				this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 1 ), 16 ) / 255;
				this.g = parseInt( hex.charAt( 2 ) + hex.charAt( 3 ), 16 ) / 255;
				this.b = parseInt( hex.charAt( 4 ) + hex.charAt( 5 ), 16 ) / 255;

				return this;

			}

		}

		if ( style && style.length > 0 ) {

			// color keywords
			var hex = THREE.ColorKeywords[ style ];

			if ( hex !== undefined ) {

				// red
				this.setHex( hex );

			} else {

				// unknown color
				console.warn( 'THREE.Color: Unknown color ' + style );

			}

		}

		return this;

	},

	clone: function () {

		return new this.constructor( this.r, this.g, this.b );

	},

	copy: function ( color ) {

		this.r = color.r;
		this.g = color.g;
		this.b = color.b;

		return this;

	},

	copyGammaToLinear: function ( color, gammaFactor ) {

		if ( gammaFactor === undefined ) gammaFactor = 2.0;

		this.r = Math.pow( color.r, gammaFactor );
		this.g = Math.pow( color.g, gammaFactor );
		this.b = Math.pow( color.b, gammaFactor );

		return this;

	},

	copyLinearToGamma: function ( color, gammaFactor ) {

		if ( gammaFactor === undefined ) gammaFactor = 2.0;

		var safeInverse = ( gammaFactor > 0 ) ? ( 1.0 / gammaFactor ) : 1.0;

		this.r = Math.pow( color.r, safeInverse );
		this.g = Math.pow( color.g, safeInverse );
		this.b = Math.pow( color.b, safeInverse );

		return this;

	},

	convertGammaToLinear: function () {

		var r = this.r, g = this.g, b = this.b;

		this.r = r * r;
		this.g = g * g;
		this.b = b * b;

		return this;

	},

	convertLinearToGamma: function () {

		this.r = Math.sqrt( this.r );
		this.g = Math.sqrt( this.g );
		this.b = Math.sqrt( this.b );

		return this;

	},

	getHex: function () {

		return ( this.r * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.b * 255 ) << 0;

	},

	getHexString: function () {

		return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );

	},

	getHSL: function ( optionalTarget ) {

		// h,s,l ranges are in 0.0 - 1.0

		var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

		var r = this.r, g = this.g, b = this.b;

		var max = Math.max( r, g, b );
		var min = Math.min( r, g, b );

		var hue, saturation;
		var lightness = ( min + max ) / 2.0;

		if ( min === max ) {

			hue = 0;
			saturation = 0;

		} else {

			var delta = max - min;

			saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

			switch ( max ) {

				case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
				case g: hue = ( b - r ) / delta + 2; break;
				case b: hue = ( r - g ) / delta + 4; break;

			}

			hue /= 6;

		}

		hsl.h = hue;
		hsl.s = saturation;
		hsl.l = lightness;

		return hsl;

	},

	getStyle: function () {

		return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

	},

	offsetHSL: function ( h, s, l ) {

		var hsl = this.getHSL();

		hsl.h += h; hsl.s += s; hsl.l += l;

		this.setHSL( hsl.h, hsl.s, hsl.l );

		return this;

	},

	add: function ( color ) {

		this.r += color.r;
		this.g += color.g;
		this.b += color.b;

		return this;

	},

	addColors: function ( color1, color2 ) {

		this.r = color1.r + color2.r;
		this.g = color1.g + color2.g;
		this.b = color1.b + color2.b;

		return this;

	},

	addScalar: function ( s ) {

		this.r += s;
		this.g += s;
		this.b += s;

		return this;

	},

	multiply: function ( color ) {

		this.r *= color.r;
		this.g *= color.g;
		this.b *= color.b;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.r *= s;
		this.g *= s;
		this.b *= s;

		return this;

	},

	lerp: function ( color, alpha ) {

		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;

		return this;

	},

	equals: function ( c ) {

		return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.r = array[ offset ];
		this.g = array[ offset + 1 ];
		this.b = array[ offset + 2 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.r;
		array[ offset + 1 ] = this.g;
		array[ offset + 2 ] = this.b;

		return array;

	}

};

THREE.ColorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

// File:src/math/Quaternion.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 */

THREE.Quaternion = function ( x, y, z, w ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;

};

THREE.Quaternion.prototype = {

	constructor: THREE.Quaternion,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get w () {

		return this._w;

	},

	set w ( value ) {

		this._w = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, w ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		this.onChangeCallback();

		return this;

	},

	clone: function () {

		return new this.constructor( this._x, this._y, this._z, this._w );

	},

	copy: function ( quaternion ) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		this.onChangeCallback();

		return this;

	},

	setFromEuler: function ( euler, update ) {

		if ( euler instanceof THREE.Euler === false ) {

			throw new Error( 'THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

		}

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		var c1 = Math.cos( euler._x / 2 );
		var c2 = Math.cos( euler._y / 2 );
		var c3 = Math.cos( euler._z / 2 );
		var s1 = Math.sin( euler._x / 2 );
		var s2 = Math.sin( euler._y / 2 );
		var s3 = Math.sin( euler._z / 2 );

		var order = euler.order;

		if ( order === 'XYZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'YXZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( order === 'ZXY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'ZYX' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( order === 'YZX' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( order === 'XZY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		}

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this.onChangeCallback();

		return this;

	},

	setFromUnitVectors: function () {

		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1, r;

		var EPS = 0.000001;

		return function ( vFrom, vTo ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			return this.normalize();

		};

	}(),

	inverse: function () {

		return this.conjugate().normalize();

	},

	conjugate: function () {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		this.onChangeCallback();

		return this;

	},

	dot: function ( v ) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

	},

	lengthSq: function () {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	},

	length: function () {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	},

	normalize: function () {

		var l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}

		this.onChangeCallback();

		return this;

	},

	multiply: function ( q, p ) {

		if ( p !== undefined ) {

			console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );

		}

		return this.multiplyQuaternions( this, q );

	},

	premultiply: function ( q ) {

		return this.multiplyQuaternions( q, this );

	},

	multiplyQuaternions: function ( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this.onChangeCallback();

		return this;

	},

	slerp: function ( qb, t ) {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		var x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

		if ( Math.abs( sinHalfTheta ) < 0.001 ) {

			this._w = 0.5 * ( w + this._w );
			this._x = 0.5 * ( x + this._x );
			this._y = 0.5 * ( y + this._y );
			this._z = 0.5 * ( z + this._z );

			return this;

		}

		var halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
		var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
		ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		this.onChangeCallback();

		return this;

	},

	equals: function ( quaternion ) {

		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {}

};

Object.assign( THREE.Quaternion, {

	slerp: function( qa, qb, qm, t ) {

		return qm.copy( qa ).slerp( qb, t );

	},

	slerpFlat: function(
			dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

		// fuzz-free, array-based Quaternion SLERP operation

		var x0 = src0[ srcOffset0 + 0 ],
			y0 = src0[ srcOffset0 + 1 ],
			z0 = src0[ srcOffset0 + 2 ],
			w0 = src0[ srcOffset0 + 3 ],

			x1 = src1[ srcOffset1 + 0 ],
			y1 = src1[ srcOffset1 + 1 ],
			z1 = src1[ srcOffset1 + 2 ],
			w1 = src1[ srcOffset1 + 3 ];

		if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

			var s = 1 - t,

				cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

				dir = ( cos >= 0 ? 1 : - 1 ),
				sqrSin = 1 - cos * cos;

			// Skip the Slerp for tiny steps to avoid numeric problems:
			if ( sqrSin > Number.EPSILON ) {

				var sin = Math.sqrt( sqrSin ),
					len = Math.atan2( sin, cos * dir );

				s = Math.sin( s * len ) / sin;
				t = Math.sin( t * len ) / sin;

			}

			var tDir = t * dir;

			x0 = x0 * s + x1 * tDir;
			y0 = y0 * s + y1 * tDir;
			z0 = z0 * s + z1 * tDir;
			w0 = w0 * s + w1 * tDir;

			// Normalize in case we just did a lerp:
			if ( s === 1 - t ) {

				var f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

				x0 *= f;
				y0 *= f;
				z0 *= f;
				w0 *= f;

			}

		}

		dst[ dstOffset ] = x0;
		dst[ dstOffset + 1 ] = y0;
		dst[ dstOffset + 2 ] = z0;
		dst[ dstOffset + 3 ] = w0;

	}

} );

// File:src/math/Vector2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

THREE.Vector2.prototype = {

	constructor: THREE.Vector2,

	get width() {

		return this.x;

	},

	set width( value ) {

		this.x = value;

	},

	get height() {

		return this.y;

	},

	set height( value ) {

		this.y = value;

	},

	//

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setScalar: function ( scalar ) {

		this.x = scalar;
		this.y = scalar;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	clone: function () {

		return new this.constructor( this.x, this.y );

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addScaledVector: function ( v, s ) {

		this.x += v.x * s;
		this.y += v.y * s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subScalar: function ( s ) {

		this.x -= s;
		this.y -= s;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiply: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		if ( isFinite( scalar ) ) {

			this.x *= scalar;
			this.y *= scalar;

		} else {

			this.x = 0;
			this.y = 0;

		}

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	},

	divideScalar: function ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	},

	min: function ( v ) {

		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );

		return this;

	},

	max: function ( v ) {

		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );

		return this;

	},

	clampScalar: function () {

		var min, max;

		return function clampScalar( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector2();
				max = new THREE.Vector2();

			}

			min.set( minVal, minVal );
			max.set( maxVal, maxVal );

			return this.clamp( min, max );

		};

	}(),

	clampLength: function ( min, max ) {

		var length = this.length();

		return this.multiplyScalar( Math.max( min, Math.min( max, length ) ) / length );

	},

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	lengthManhattan: function() {

		return Math.abs( this.x ) + Math.abs( this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	angle: function () {

		// computes the angle in radians with respect to the positive x-axis

		var angle = Math.atan2( this.y, this.x );

		if ( angle < 0 ) angle += 2 * Math.PI;

		return angle;

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( length ) {

		return this.multiplyScalar( length / this.length() );

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	lerpVectors: function ( v1, v2, alpha ) {

		return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

		if ( offset === undefined ) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[ index ];
		this.y = attribute.array[ index + 1 ];

		return this;

	},

	rotateAround: function ( center, angle ) {

		var c = Math.cos( angle ), s = Math.sin( angle );

		var x = this.x - center.x;
		var y = this.y - center.y;

		this.x = x * c - y * s + center.x;
		this.y = x * s + y * c + center.y;

		return this;

	}

};

// File:src/math/Vector3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};

THREE.Vector3.prototype = {

	constructor: THREE.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setScalar: function ( scalar ) {

		this.x = scalar;
		this.y = scalar;
		this.z = scalar;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	clone: function () {

		return new this.constructor( this.x, this.y, this.z );

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	addScaledVector: function ( v, s ) {

		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	subScalar: function ( s ) {

		this.x -= s;
		this.y -= s;
		this.z -= s;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	multiply: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );

		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		if ( isFinite( scalar ) ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},

	multiplyVectors: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	applyEuler: function () {

		var quaternion;

		return function applyEuler( euler ) {

			if ( euler instanceof THREE.Euler === false ) {

				console.error( 'THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );

			}

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			return this.applyQuaternion( quaternion.setFromEuler( euler ) );

		};

	}(),

	applyAxisAngle: function () {

		var quaternion;

		return function applyAxisAngle( axis, angle ) {

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			return this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

		};

	}(),

	applyMatrix3: function ( m ) {

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	},

	applyMatrix4: function ( m ) {

		// input: THREE.Matrix4 affine matrix

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

		return this;

	},

	applyProjection: function ( m ) {

		// input: THREE.Matrix4 projection matrix

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;
		var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;

		return this;

	},

	applyQuaternion: function ( q ) {

		var x = this.x, y = this.y, z = this.z;
		var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		// calculate quat * vector

		var ix =  qw * x + qy * z - qz * y;
		var iy =  qw * y + qz * x - qx * z;
		var iz =  qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	},

	project: function () {

		var matrix;

		return function project( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
			return this.applyProjection( matrix );

		};

	}(),

	unproject: function () {

		var matrix;

		return function unproject( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
			return this.applyProjection( matrix );

		};

	}(),

	transformDirection: function ( m ) {

		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		return this.normalize();

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	},

	min: function ( v ) {

		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		this.z = Math.min( this.z, v.z );

		return this;

	},

	max: function ( v ) {

		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		this.z = Math.max( this.z, v.z );

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );
		this.z = Math.max( min.z, Math.min( max.z, this.z ) );

		return this;

	},

	clampScalar: function () {

		var min, max;

		return function clampScalar( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector3();
				max = new THREE.Vector3();

			}

			min.set( minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	}(),

	clampLength: function ( min, max ) {

		var length = this.length();

		return this.multiplyScalar( Math.max( min, Math.min( max, length ) ) / length );

	},

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( length ) {

		return this.multiplyScalar( length / this.length() );

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	},

	lerpVectors: function ( v1, v2, alpha ) {

		return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

	},

	cross: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );

		}

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	crossVectors: function ( a, b ) {

		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

	},

	projectOnVector: function () {

		var v1, dot;

		return function projectOnVector( vector ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( vector ).normalize();

			dot = this.dot( v1 );

			return this.copy( v1 ).multiplyScalar( dot );

		};

	}(),

	projectOnPlane: function () {

		var v1;

		return function projectOnPlane( planeNormal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( this ).projectOnVector( planeNormal );

			return this.sub( v1 );

		};

	}(),

	reflect: function () {

		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		var v1;

		return function reflect( normal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		};

	}(),

	angleTo: function ( v ) {

		var theta = this.dot( v ) / ( Math.sqrt( this.lengthSq() * v.lengthSq() ) );

		// clamp, to handle numerical problems

		return Math.acos( THREE.Math.clamp( theta, - 1, 1 ) );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	},

	setFromSpherical: function( s ) {

		var sinPhiRadius = Math.sin( s.phi ) * s.radius;

		this.x = sinPhiRadius * Math.sin( s.theta );
		this.y = Math.cos( s.phi ) * s.radius;
		this.z = sinPhiRadius * Math.cos( s.theta );

		return this;

	},

	setFromMatrixPosition: function ( m ) {

		return this.setFromMatrixColumn( m, 3 );

	},

	setFromMatrixScale: function ( m ) {

		var sx = this.setFromMatrixColumn( m, 0 ).length();
		var sy = this.setFromMatrixColumn( m, 1 ).length();
		var sz = this.setFromMatrixColumn( m, 2 ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;

	},

	setFromMatrixColumn: function ( m, index ) {

		if ( typeof m === 'number' ) {

			console.warn( 'THREE.Vector3: setFromMatrixColumn now expects ( matrix, index ).' );
			var temp = m
			m = index;
			index = temp;

		}

		return this.fromArray( m.elements, index * 4 );

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

		if ( offset === undefined ) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[ index ];
		this.y = attribute.array[ index + 1 ];
		this.z = attribute.array[ index + 2 ];

		return this;

	}

};

// File:src/math/Vector4.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector4 = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

	constructor: THREE.Vector4,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	setScalar: function ( scalar ) {

		this.x = scalar;
		this.y = scalar;
		this.z = scalar;
		this.w = scalar;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setW: function ( w ) {

		this.w = w;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			case 3: this.w = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	clone: function () {

		return new this.constructor( this.x, this.y, this.z, this.w );

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;
		this.w += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		this.w = a.w + b.w;

		return this;

	},

	addScaledVector: function ( v, s ) {

		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;
		this.w += v.w * s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	subScalar: function ( s ) {

		this.x -= s;
		this.y -= s;
		this.z -= s;
		this.w -= s;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		if ( isFinite( scalar ) ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			this.w *= scalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 0;

		}

		return this;

	},

	applyMatrix4: function ( m ) {

		var x = this.x, y = this.y, z = this.z, w = this.w;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
		this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

		return this;

	},

	divideScalar: function ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	},

	setAxisAngleFromQuaternion: function ( q ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

		// q is assumed to be normalized

		this.w = 2 * Math.acos( q.w );

		var s = Math.sqrt( 1 - q.w * q.w );

		if ( s < 0.0001 ) {

			 this.x = 1;
			 this.y = 0;
			 this.z = 0;

		} else {

			 this.x = q.x / s;
			 this.y = q.y / s;
			 this.z = q.z / s;

		}

		return this;

	},

	setAxisAngleFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var angle, x, y, z,		// variables for result
			epsilon = 0.01,		// margin to allow for rounding errors
			epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

			te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		if ( ( Math.abs( m12 - m21 ) < epsilon ) &&
		     ( Math.abs( m13 - m31 ) < epsilon ) &&
		     ( Math.abs( m23 - m32 ) < epsilon ) ) {

			// singularity found
			// first check for identity matrix which must have +1 for all terms
			// in leading diagonal and zero in other terms

			if ( ( Math.abs( m12 + m21 ) < epsilon2 ) &&
			     ( Math.abs( m13 + m31 ) < epsilon2 ) &&
			     ( Math.abs( m23 + m32 ) < epsilon2 ) &&
			     ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

				// this singularity is identity matrix so angle = 0

				this.set( 1, 0, 0, 0 );

				return this; // zero angle, arbitrary axis

			}

			// otherwise this singularity is angle = 180

			angle = Math.PI;

			var xx = ( m11 + 1 ) / 2;
			var yy = ( m22 + 1 ) / 2;
			var zz = ( m33 + 1 ) / 2;
			var xy = ( m12 + m21 ) / 4;
			var xz = ( m13 + m31 ) / 4;
			var yz = ( m23 + m32 ) / 4;

			if ( ( xx > yy ) && ( xx > zz ) ) {

				// m11 is the largest diagonal term

				if ( xx < epsilon ) {

					x = 0;
					y = 0.707106781;
					z = 0.707106781;

				} else {

					x = Math.sqrt( xx );
					y = xy / x;
					z = xz / x;

				}

			} else if ( yy > zz ) {

				// m22 is the largest diagonal term

				if ( yy < epsilon ) {

					x = 0.707106781;
					y = 0;
					z = 0.707106781;

				} else {

					y = Math.sqrt( yy );
					x = xy / y;
					z = yz / y;

				}

			} else {

				// m33 is the largest diagonal term so base result on this

				if ( zz < epsilon ) {

					x = 0.707106781;
					y = 0.707106781;
					z = 0;

				} else {

					z = Math.sqrt( zz );
					x = xz / z;
					y = yz / z;

				}

			}

			this.set( x, y, z, angle );

			return this; // return 180 deg rotation

		}

		// as we have reached here there are no singularities so we can handle normally

		var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 ) +
		                   ( m13 - m31 ) * ( m13 - m31 ) +
		                   ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

		if ( Math.abs( s ) < 0.001 ) s = 1;

		// prevent divide by zero, should not happen if matrix is orthogonal and should be
		// caught by singularity test above, but I've left it in just in case

		this.x = ( m32 - m23 ) / s;
		this.y = ( m13 - m31 ) / s;
		this.z = ( m21 - m12 ) / s;
		this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

		return this;

	},

	min: function ( v ) {

		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		this.z = Math.min( this.z, v.z );
		this.w = Math.min( this.w, v.w );

		return this;

	},

	max: function ( v ) {

		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		this.z = Math.max( this.z, v.z );
		this.w = Math.max( this.w, v.w );

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );
		this.z = Math.max( min.z, Math.min( max.z, this.z ) );
		this.w = Math.max( min.w, Math.min( max.w, this.w ) );

		return this;

	},

	clampScalar: function () {

		var min, max;

		return function clampScalar( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector4();
				max = new THREE.Vector4();

			}

			min.set( minVal, minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	}(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );
		this.w = Math.floor( this.w );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );
		this.w = Math.ceil( this.w );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );
		this.w = Math.round( this.w );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
		this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
		this.w = - this.w;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( length ) {

		return this.multiplyScalar( length / this.length() );

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		this.w += ( v.w - this.w ) * alpha;

		return this;

	},

	lerpVectors: function ( v1, v2, alpha ) {

		return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];
		this.w = array[ offset + 3 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;
		array[ offset + 3 ] = this.w;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

		if ( offset === undefined ) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[ index ];
		this.y = attribute.array[ index + 1 ];
		this.z = attribute.array[ index + 2 ];
		this.w = attribute.array[ index + 3 ];

		return this;

	}

};

// File:src/math/Euler.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 */

THREE.Euler = function ( x, y, z, order ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._order = order || THREE.Euler.DefaultOrder;

};

THREE.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREE.Euler.DefaultOrder = 'XYZ';

THREE.Euler.prototype = {

	constructor: THREE.Euler,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get order () {

		return this._order;

	},

	set order ( value ) {

		this._order = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, order ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order || this._order;

		this.onChangeCallback();

		return this;

	},

	clone: function () {

		return new this.constructor( this._x, this._y, this._z, this._order );

	},

	copy: function ( euler ) {

		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m, order, update ) {

		var clamp = THREE.Math.clamp;

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements;
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._y = Math.asin( clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m33 );
				this._z = Math.atan2( - m12, m11 );

			} else {

				this._x = Math.atan2( m32, m22 );
				this._z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this._x = Math.asin( - clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.99999 ) {

				this._y = Math.atan2( m13, m33 );
				this._z = Math.atan2( m21, m22 );

			} else {

				this._y = Math.atan2( - m31, m11 );
				this._z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin( clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.99999 ) {

				this._y = Math.atan2( - m31, m33 );
				this._z = Math.atan2( - m12, m22 );

			} else {

				this._y = 0;
				this._z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this._y = Math.asin( - clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m33 );
				this._z = Math.atan2( m21, m11 );

			} else {

				this._x = 0;
				this._z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this._z = Math.asin( clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m22 );
				this._y = Math.atan2( - m31, m11 );

			} else {

				this._x = 0;
				this._y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this._z = Math.asin( - clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m22 );
				this._y = Math.atan2( m13, m11 );

			} else {

				this._x = Math.atan2( - m23, m33 );
				this._y = 0;

			}

		} else {

			console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order );

		}

		this._order = order;

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	setFromQuaternion: function () {

		var matrix;

		return function ( q, order, update ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.makeRotationFromQuaternion( q );

			return this.setFromRotationMatrix( matrix, order, update );

		};

	}(),

	setFromVector3: function ( v, order ) {

		return this.set( v.x, v.y, v.z, order || this._order );

	},

	reorder: function () {

		// WARNING: this discards revolution information -bhouston

		var q = new THREE.Quaternion();

		return function ( newOrder ) {

			q.setFromEuler( this );
			
			return this.setFromQuaternion( q, newOrder );

		};

	}(),

	equals: function ( euler ) {

		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

	},

	fromArray: function ( array ) {

		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._order;

		return array;

	},

	toVector3: function ( optionalResult ) {

		if ( optionalResult ) {

			return optionalResult.set( this._x, this._y, this._z );

		} else {

			return new THREE.Vector3( this._x, this._y, this._z );

		}

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {}

};

// File:src/math/Line3.js

/**
 * @author bhouston / http://clara.io
 */

THREE.Line3 = function ( start, end ) {

	this.start = ( start !== undefined ) ? start : new THREE.Vector3();
	this.end = ( end !== undefined ) ? end : new THREE.Vector3();

};

THREE.Line3.prototype = {

	constructor: THREE.Line3,

	set: function ( start, end ) {

		this.start.copy( start );
		this.end.copy( end );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( line ) {

		this.start.copy( line.start );
		this.end.copy( line.end );

		return this;

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

	},

	delta: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.end, this.start );

	},

	distanceSq: function () {

		return this.start.distanceToSquared( this.end );

	},

	distance: function () {

		return this.start.distanceTo( this.end );

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	closestPointToPointParameter: function () {

		var startP = new THREE.Vector3();
		var startEnd = new THREE.Vector3();

		return function ( point, clampToLine ) {

			startP.subVectors( point, this.start );
			startEnd.subVectors( this.end, this.start );

			var startEnd2 = startEnd.dot( startEnd );
			var startEnd_startP = startEnd.dot( startP );

			var t = startEnd_startP / startEnd2;

			if ( clampToLine ) {

				t = THREE.Math.clamp( t, 0, 1 );

			}

			return t;

		};

	}(),

	closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

		var t = this.closestPointToPointParameter( point, clampToLine );

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	applyMatrix4: function ( matrix ) {

		this.start.applyMatrix4( matrix );
		this.end.applyMatrix4( matrix );

		return this;

	},

	equals: function ( line ) {

		return line.start.equals( this.start ) && line.end.equals( this.end );

	}

};

// File:src/math/Box2.js

/**
 * @author bhouston / http://clara.io
 */

THREE.Box2 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector2( + Infinity, + Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector2( - Infinity, - Infinity );

};

THREE.Box2.prototype = {

	constructor: THREE.Box2,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] );

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector2();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );
			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = + Infinity;
		this.max.x = this.max.y = - Infinity;

		return this;

	},

	isEmpty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;

	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
		     point.y < this.min.y || point.y > this.max.y ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
		     ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector2();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y )
		);

	},

	intersectsBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
		     box.max.y < this.min.y || box.min.y > this.max.y ) {

			return false;

		}

		return true;

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector2();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	}

};

// File:src/math/Box3.js

/**
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Box3 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector3( + Infinity, + Infinity, + Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector3( - Infinity, - Infinity, - Infinity );

};

THREE.Box3.prototype = {

	constructor: THREE.Box3,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromArray: function ( array ) {

		var minX = + Infinity;
		var minY = + Infinity;
		var minZ = + Infinity;

		var maxX = - Infinity;
		var maxY = - Infinity;
		var maxZ = - Infinity;

		for ( var i = 0, l = array.length; i < l; i += 3 ) {

			var x = array[ i ];
			var y = array[ i + 1 ];
			var z = array[ i + 2 ];

			if ( x < minX ) minX = x;
			if ( y < minY ) minY = y;
			if ( z < minZ ) minZ = z;

			if ( x > maxX ) maxX = x;
			if ( y > maxY ) maxY = y;
			if ( z > maxZ ) maxZ = z;

		}

		this.min.set( minX, minY, minZ );
		this.max.set( maxX, maxY, maxZ );

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] );

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector3();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );

			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	setFromObject: function () {

		// Computes the world-axis-aligned bounding box of an object (including its children),
		// accounting for both the object's, and children's, world transforms

		var v1 = new THREE.Vector3();

		return function ( object ) {

			var scope = this;

			object.updateMatrixWorld( true );

			this.makeEmpty();

			object.traverse( function ( node ) {

				var geometry = node.geometry;

				if ( geometry !== undefined ) {

					if ( geometry instanceof THREE.Geometry ) {

						var vertices = geometry.vertices;

						for ( var i = 0, il = vertices.length; i < il; i ++ ) {

							v1.copy( vertices[ i ] );
							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					} else if ( geometry instanceof THREE.BufferGeometry && geometry.attributes[ 'position' ] !== undefined ) {

						var positions = geometry.attributes[ 'position' ].array;

						for ( var i = 0, il = positions.length; i < il; i += 3 ) {

							v1.fromArray( positions, i );
							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					}

				}

			} );

			return this;

		};

	}(),

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = this.min.z = + Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;

		return this;

	},

	isEmpty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;

	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
				 point.y < this.min.y || point.y > this.max.y ||
				 point.z < this.min.z || point.z > this.max.z ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
			 ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) &&
			 ( this.min.z <= box.min.z ) && ( box.max.z <= this.max.z ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector3();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y ),
			( point.z - this.min.z ) / ( this.max.z - this.min.z )
		);

	},

	intersectsBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
				 box.max.y < this.min.y || box.min.y > this.max.y ||
				 box.max.z < this.min.z || box.min.z > this.max.z ) {

			return false;

		}

		return true;

	},

	intersectsSphere: ( function () {

		var closestPoint;

		return function intersectsSphere( sphere ) {

			if ( closestPoint === undefined ) closestPoint = new THREE.Vector3();

			// Find the point on the AABB closest to the sphere center.
			this.clampPoint( sphere.center, closestPoint );

			// If that point is inside the sphere, the AABB and sphere intersect.
			return closestPoint.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );

		};

	} )(),

	intersectsPlane: function ( plane ) {

		// We compute the minimum and maximum dot product values. If those values
		// are on the same side (back or front) of the plane, then there is no intersection.

		var min, max;

		if ( plane.normal.x > 0 ) {

			min = plane.normal.x * this.min.x;
			max = plane.normal.x * this.max.x;

		} else {

			min = plane.normal.x * this.max.x;
			max = plane.normal.x * this.min.x;

		}

		if ( plane.normal.y > 0 ) {

			min += plane.normal.y * this.min.y;
			max += plane.normal.y * this.max.y;

		} else {

			min += plane.normal.y * this.max.y;
			max += plane.normal.y * this.min.y;

		}

		if ( plane.normal.z > 0 ) {

			min += plane.normal.z * this.min.z;
			max += plane.normal.z * this.max.z;

		} else {

			min += plane.normal.z * this.max.z;
			max += plane.normal.z * this.min.z;

		}

		return ( min <= plane.constant && max >= plane.constant );

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	getBoundingSphere: function () {

		var v1 = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Sphere();

			result.center = this.center();
			result.radius = this.size( v1 ).length() * 0.5;

			return result;

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
		if( this.isEmpty() ) this.makeEmpty();

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	applyMatrix4: function () {

		var points = [
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3()
		];

		return function ( matrix ) {

			// transform of empty box is an empty box.
			if( this.isEmpty() ) return this;

			// NOTE: I am using a binary pattern to specify all 2^3 combinations below
			points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
			points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
			points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
			points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
			points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
			points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
			points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
			points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix );	// 111

			this.setFromPoints( points );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	}

};

// File:src/math/Matrix3.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 * @author tschw
 */

THREE.Matrix3 = function () {

	this.elements = new Float32Array( [

		1, 0, 0,
		0, 1, 0,
		0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix3.prototype = {

	constructor: THREE.Matrix3,

	set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
		te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
		te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	},

	clone: function () {

		return new this.constructor().fromArray( this.elements );

	},

	copy: function ( m ) {

		var me = m.elements;

		this.set(

			me[ 0 ], me[ 3 ], me[ 6 ],
			me[ 1 ], me[ 4 ], me[ 7 ],
			me[ 2 ], me[ 5 ], me[ 8 ]

		);

		return this;

	},

	setFromMatrix4: function( m ) {

		var me = m.elements;

		this.set(

			me[ 0 ], me[ 4 ], me[  8 ],
			me[ 1 ], me[ 5 ], me[  9 ],
			me[ 2 ], me[ 6 ], me[ 10 ]

		);

		return this;

	},

	applyToVector3Array: function () {

		var v1;

		return function ( array, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset; i < length; i += 3, j += 3 ) {

				v1.fromArray( array, j );
				v1.applyMatrix3( this );
				v1.toArray( array, j );

			}

			return array;

		};

	}(),

	applyToBuffer: function () {

		var v1;

		return function applyToBuffer( buffer, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = buffer.length / buffer.itemSize;

			for ( var i = 0, j = offset; i < length; i ++, j ++ ) {

				v1.x = buffer.getX( j );
				v1.y = buffer.getY( j );
				v1.z = buffer.getZ( j );

				v1.applyMatrix3( this );

				buffer.setXYZ( v1.x, v1.y, v1.z );

			}

			return buffer;

		};

	}(),

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
		te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
		te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

		return this;

	},

	determinant: function () {

		var te = this.elements;

		var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
			d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
			g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

	},

	getInverse: function ( matrix, throwOnDegenerate ) {

		if ( matrix instanceof THREE.Matrix4 ) {

			console.error( "THREE.Matrix3.getInverse no longer takes a Matrix4 argument." );

		}

		var me = matrix.elements,
			te = this.elements,

			n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ],
			n12 = me[ 3 ], n22 = me[ 4 ], n32 = me[ 5 ],
			n13 = me[ 6 ], n23 = me[ 7 ], n33 = me[ 8 ],

			t11 = n33 * n22 - n32 * n23,
			t12 = n32 * n13 - n33 * n12,
			t13 = n23 * n12 - n22 * n13,

			det = n11 * t11 + n21 * t12 + n31 * t13;

		if ( det === 0 ) {

			var msg = "THREE.Matrix3.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnDegenerate || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			return this.identity();
		}
		
		var detInv = 1 / det;

		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
		te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

		te[ 3 ] = t12 * detInv;
		te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
		te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

		te[ 6 ] = t13 * detInv;
		te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
		te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

		return this;

	},

	transpose: function () {

		var tmp, m = this.elements;

		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		console.warn( "THREE.Matrix3: .flattenToArrayOffset is deprecated " +
				"- just use .toArray instead." );

		return this.toArray( array, offset );

	},

	getNormalMatrix: function ( matrix4 ) {

		return this.setFromMatrix4( matrix4 ).getInverse( this ).transpose();

	},

	transposeIntoArray: function ( r ) {

		var m = this.elements;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		var te = this.elements;

		array[ offset ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];

		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];

		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ]  = te[ 8 ];

		return array;

	}

};

// File:src/math/Matrix4.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Matrix4 = function () {

	this.elements = new Float32Array( [

		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix4.prototype = {

	constructor: THREE.Matrix4,

	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	clone: function () {

		return new THREE.Matrix4().fromArray( this.elements );

	},

	copy: function ( m ) {

		this.elements.set( m.elements );

		return this;

	},

	copyPosition: function ( m ) {

		var te = this.elements;
		var me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;

	},

	extractBasis: function ( xAxis, yAxis, zAxis ) {

		xAxis.setFromMatrixColumn( this, 0 );
		yAxis.setFromMatrixColumn( this, 1 );
		zAxis.setFromMatrixColumn( this, 2 );

		return this;

	},

	makeBasis: function ( xAxis, yAxis, zAxis ) {

		this.set(
			xAxis.x, yAxis.x, zAxis.x, 0,
			xAxis.y, yAxis.y, zAxis.y, 0,
			xAxis.z, yAxis.z, zAxis.z, 0,
			0,       0,       0,       1
		);

		return this;

	},

	extractRotation: function () {

		var v1;

		return function ( m ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / v1.setFromMatrixColumn( m, 0 ).length();
			var scaleY = 1 / v1.setFromMatrixColumn( m, 1 ).length();
			var scaleZ = 1 / v1.setFromMatrixColumn( m, 2 ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;

			return this;

		};

	}(),

	makeRotationFromEuler: function ( euler ) {

		if ( euler instanceof THREE.Euler === false ) {

			console.error( 'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

		}

		var te = this.elements;

		var x = euler.x, y = euler.y, z = euler.z;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === 'XYZ' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YXZ' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZXY' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZYX' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YZX' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( euler.order === 'XZY' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	makeRotationFromQuaternion: function ( q ) {

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	lookAt: function () {

		var x, y, z;

		return function ( eye, target, up ) {

			if ( x === undefined ) {

				x = new THREE.Vector3();
				y = new THREE.Vector3();
				z = new THREE.Vector3();

			}

			var te = this.elements;

			z.subVectors( eye, target ).normalize();

			if ( z.lengthSq() === 0 ) {

				z.z = 1;

			}

			x.crossVectors( up, z ).normalize();

			if ( x.lengthSq() === 0 ) {

				z.z += 0.0001;
				x.crossVectors( up, z ).normalize();

			}

			y.crossVectors( z, x );


			te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
			te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
			te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

			return this;

		};

	}(),

	multiply: function ( m, n ) {

		if ( n !== undefined ) {

			console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
			return this.multiplyMatrices( m, n );

		}

		return this.multiplyMatrices( this, m );

	},

	premultiply: function ( m ) {

		return this.multiplyMatrices( m, this );

	},

	multiplyMatrices: function ( a, b ) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplyToArray: function ( a, b, r ) {

		var te = this.elements;

		this.multiplyMatrices( a, b );

		r[ 0 ] = te[ 0 ]; r[ 1 ] = te[ 1 ]; r[ 2 ] = te[ 2 ]; r[ 3 ] = te[ 3 ];
		r[ 4 ] = te[ 4 ]; r[ 5 ] = te[ 5 ]; r[ 6 ] = te[ 6 ]; r[ 7 ] = te[ 7 ];
		r[ 8 ]  = te[ 8 ]; r[ 9 ]  = te[ 9 ]; r[ 10 ] = te[ 10 ]; r[ 11 ] = te[ 11 ];
		r[ 12 ] = te[ 12 ]; r[ 13 ] = te[ 13 ]; r[ 14 ] = te[ 14 ]; r[ 15 ] = te[ 15 ];

		return this;

	},

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

		return this;

	},

	applyToVector3Array: function () {

		var v1;

		return function ( array, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset; i < length; i += 3, j += 3 ) {

				v1.fromArray( array, j );
				v1.applyMatrix4( this );
				v1.toArray( array, j );

			}

			return array;

		};

	}(),

	applyToBuffer: function () {

		var v1;

		return function applyToBuffer( buffer, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = buffer.length / buffer.itemSize;

			for ( var i = 0, j = offset; i < length; i ++, j ++ ) {

				v1.x = buffer.getX( j );
				v1.y = buffer.getY( j );
				v1.z = buffer.getZ( j );

				v1.applyMatrix4( this );

				buffer.setXYZ( v1.x, v1.y, v1.z );

			}

			return buffer;

		};

	}(),

	determinant: function () {

		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);

	},

	transpose: function () {

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		console.warn( "THREE.Matrix3: .flattenToArrayOffset is deprecated " +
				"- just use .toArray instead." );

		return this.toArray( array, offset );

	},

	getPosition: function () {

		var v1;

		return function () {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			console.warn( 'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );

			return v1.setFromMatrixColumn( this, 3 );

		};

	}(),

	setPosition: function ( v ) {

		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;

		return this;

	},

	getInverse: function ( m, throwOnDegenerate ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements,
			me = m.elements,

			n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ], n41 = me[ 3 ],
			n12 = me[ 4 ], n22 = me[ 5 ], n32 = me[ 6 ], n42 = me[ 7 ],
			n13 = me[ 8 ], n23 = me[ 9 ], n33 = me[ 10 ], n43 = me[ 11 ],
			n14 = me[ 12 ], n24 = me[ 13 ], n34 = me[ 14 ], n44 = me[ 15 ],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if ( det === 0 ) {

			var msg = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnDegenerate || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			return this.identity();

		}
		
		var detInv = 1 / det;

		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

		te[ 4 ] = t12 * detInv;
		te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

		te[ 8 ] = t13 * detInv;
		te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

		te[ 12 ] = t14 * detInv;
		te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

		return this;

	},

	scale: function ( v ) {

		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;

	},

	getMaxScaleOnAxis: function () {

		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

	},

	makeTranslation: function ( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	makeRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, - s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	makeRotationY: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	makeRotationZ: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, - s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	makeRotationAxis: function ( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	makeScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	compose: function ( position, quaternion, scale ) {

		this.makeRotationFromQuaternion( quaternion );
		this.scale( scale );
		this.setPosition( position );

		return this;

	},

	decompose: function () {

		var vector, matrix;

		return function ( position, quaternion, scale ) {

			if ( vector === undefined ) {

				vector = new THREE.Vector3();
				matrix = new THREE.Matrix4();

			}

			var te = this.elements;

			var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			var det = this.determinant();
			if ( det < 0 ) {

				sx = - sx;

			}

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part

			matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[ 0 ] *= invSX;
			matrix.elements[ 1 ] *= invSX;
			matrix.elements[ 2 ] *= invSX;

			matrix.elements[ 4 ] *= invSY;
			matrix.elements[ 5 ] *= invSY;
			matrix.elements[ 6 ] *= invSY;

			matrix.elements[ 8 ] *= invSZ;
			matrix.elements[ 9 ] *= invSZ;
			matrix.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( matrix );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		};

	}(),

	makeFrustum: function ( left, right, bottom, top, near, far ) {

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;

	},

	makePerspective: function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( THREE.Math.DEG2RAD * fov * 0.5 );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );

	},

	makeOrthographic: function ( left, right, top, bottom, near, far ) {

		var te = this.elements;
		var w = 1.0 / ( right - left );
		var h = 1.0 / ( top - bottom );
		var p = 1.0 / ( far - near );

		var x = ( right + left ) * w;
		var y = ( top + bottom ) * h;
		var z = ( far + near ) * p;

		te[ 0 ] = 2 * w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 * h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 * p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

		return this;

	},

	equals: function ( matrix ) {

		var te = this.elements;
		var me = matrix.elements;

		for ( var i = 0; i < 16; i ++ ) {

			if ( te[ i ] !== me[ i ] ) return false;

		}

		return true;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		var te = this.elements;

		array[ offset ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ]  = te[ 8 ];
		array[ offset + 9 ]  = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;

	}

};

// File:src/math/Ray.js

/**
 * @author bhouston / http://clara.io
 */

THREE.Ray = function ( origin, direction ) {

	this.origin = ( origin !== undefined ) ? origin : new THREE.Vector3();
	this.direction = ( direction !== undefined ) ? direction : new THREE.Vector3();

};

THREE.Ray.prototype = {

	constructor: THREE.Ray,

	set: function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return result.copy( this.direction ).multiplyScalar( t ).add( this.origin );

	},

	lookAt: function ( v ) {

		this.direction.copy( v ).sub( this.origin ).normalize();

		return this;

	},

	recast: function () {

		var v1 = new THREE.Vector3();

		return function ( t ) {

			this.origin.copy( this.at( t, v1 ) );

			return this;

		};

	}(),

	closestPointToPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		result.subVectors( point, this.origin );
		var directionDistance = result.dot( this.direction );

		if ( directionDistance < 0 ) {

			return result.copy( this.origin );

		}

		return result.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

	},

	distanceToPoint: function ( point ) {

		return Math.sqrt( this.distanceSqToPoint( point ) );

	},

	distanceSqToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var directionDistance = v1.subVectors( point, this.origin ).dot( this.direction );

			// point behind the ray

			if ( directionDistance < 0 ) {

				return this.origin.distanceToSquared( point );

			}

			v1.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

			return v1.distanceToSquared( point );

		};

	}(),

	distanceSqToSegment: function () {

		var segCenter = new THREE.Vector3();
		var segDir = new THREE.Vector3();
		var diff = new THREE.Vector3();

		return function ( v0, v1, optionalPointOnRay, optionalPointOnSegment ) {

			// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
			// It returns the min distance between the ray and the segment
			// defined by v0 and v1
			// It can also set two optional targets :
			// - The closest point on the ray
			// - The closest point on the segment

			segCenter.copy( v0 ).add( v1 ).multiplyScalar( 0.5 );
			segDir.copy( v1 ).sub( v0 ).normalize();
			diff.copy( this.origin ).sub( segCenter );

			var segExtent = v0.distanceTo( v1 ) * 0.5;
			var a01 = - this.direction.dot( segDir );
			var b0 = diff.dot( this.direction );
			var b1 = - diff.dot( segDir );
			var c = diff.lengthSq();
			var det = Math.abs( 1 - a01 * a01 );
			var s0, s1, sqrDist, extDet;

			if ( det > 0 ) {

				// The ray and segment are not parallel.

				s0 = a01 * b1 - b0;
				s1 = a01 * b0 - b1;
				extDet = segExtent * det;

				if ( s0 >= 0 ) {

					if ( s1 >= - extDet ) {

						if ( s1 <= extDet ) {

							// region 0
							// Minimum at interior points of ray and segment.

							var invDet = 1 / det;
							s0 *= invDet;
							s1 *= invDet;
							sqrDist = s0 * ( s0 + a01 * s1 + 2 * b0 ) + s1 * ( a01 * s0 + s1 + 2 * b1 ) + c;

						} else {

							// region 1

							s1 = segExtent;
							s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
							sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

						}

					} else {

						// region 5

						s1 = - segExtent;
						s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				} else {

					if ( s1 <= - extDet ) {

						// region 4

						s0 = Math.max( 0, - ( - a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? - segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					} else if ( s1 <= extDet ) {

						// region 3

						s0 = 0;
						s1 = Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = s1 * ( s1 + 2 * b1 ) + c;

					} else {

						// region 2

						s0 = Math.max( 0, - ( a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				}

			} else {

				// Ray and segment are parallel.

				s1 = ( a01 > 0 ) ? - segExtent : segExtent;
				s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
				sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

			}

			if ( optionalPointOnRay ) {

				optionalPointOnRay.copy( this.direction ).multiplyScalar( s0 ).add( this.origin );

			}

			if ( optionalPointOnSegment ) {

				optionalPointOnSegment.copy( segDir ).multiplyScalar( s1 ).add( segCenter );

			}

			return sqrDist;

		};

	}(),

	intersectSphere: function () {

		var v1 = new THREE.Vector3();

		return function ( sphere, optionalTarget ) {

			v1.subVectors( sphere.center, this.origin );
			var tca = v1.dot( this.direction );
			var d2 = v1.dot( v1 ) - tca * tca;
			var radius2 = sphere.radius * sphere.radius;

			if ( d2 > radius2 ) return null;

			var thc = Math.sqrt( radius2 - d2 );

			// t0 = first intersect point - entrance on front of sphere
			var t0 = tca - thc;

			// t1 = second intersect point - exit point on back of sphere
			var t1 = tca + thc;

			// test to see if both t0 and t1 are behind the ray - if so, return null
			if ( t0 < 0 && t1 < 0 ) return null;

			// test to see if t0 is behind the ray:
			// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
			// in order to always return an intersect point that is in front of the ray.
			if ( t0 < 0 ) return this.at( t1, optionalTarget );

			// else t0 is in front of the ray, so return the first collision point scaled by t0
			return this.at( t0, optionalTarget );

		};

	}(),

	intersectsSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) <= sphere.radius;

	},

	distanceToPlane: function ( plane ) {

		var denominator = plane.normal.dot( this.direction );

		if ( denominator === 0 ) {

			// line is coplanar, return origin
			if ( plane.distanceToPoint( this.origin ) === 0 ) {

				return 0;

			}

			// Null is preferable to undefined since undefined means.... it is undefined

			return null;

		}

		var t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

		// Return if the ray never intersects the plane

		return t >= 0 ? t :  null;

	},

	intersectPlane: function ( plane, optionalTarget ) {

		var t = this.distanceToPlane( plane );

		if ( t === null ) {

			return null;

		}

		return this.at( t, optionalTarget );

	},



	intersectsPlane: function ( plane ) {

		// check if the ray lies on the plane first

		var distToPoint = plane.distanceToPoint( this.origin );

		if ( distToPoint === 0 ) {

			return true;

		}

		var denominator = plane.normal.dot( this.direction );

		if ( denominator * distToPoint < 0 ) {

			return true;

		}

		// ray origin is behind the plane (and is pointing behind it)

		return false;

	},

	intersectBox: function ( box, optionalTarget ) {

		var tmin, tmax, tymin, tymax, tzmin, tzmax;

		var invdirx = 1 / this.direction.x,
			invdiry = 1 / this.direction.y,
			invdirz = 1 / this.direction.z;

		var origin = this.origin;

		if ( invdirx >= 0 ) {

			tmin = ( box.min.x - origin.x ) * invdirx;
			tmax = ( box.max.x - origin.x ) * invdirx;

		} else {

			tmin = ( box.max.x - origin.x ) * invdirx;
			tmax = ( box.min.x - origin.x ) * invdirx;

		}

		if ( invdiry >= 0 ) {

			tymin = ( box.min.y - origin.y ) * invdiry;
			tymax = ( box.max.y - origin.y ) * invdiry;

		} else {

			tymin = ( box.max.y - origin.y ) * invdiry;
			tymax = ( box.min.y - origin.y ) * invdiry;

		}

		if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN

		if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

		if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

		if ( invdirz >= 0 ) {

			tzmin = ( box.min.z - origin.z ) * invdirz;
			tzmax = ( box.max.z - origin.z ) * invdirz;

		} else {

			tzmin = ( box.max.z - origin.z ) * invdirz;
			tzmax = ( box.min.z - origin.z ) * invdirz;

		}

		if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

		if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

		if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

		//return point closest to the ray (positive side)

		if ( tmax < 0 ) return null;

		return this.at( tmin >= 0 ? tmin : tmax, optionalTarget );

	},

	intersectsBox: ( function () {

		var v = new THREE.Vector3();

		return function ( box ) {

			return this.intersectBox( box, v ) !== null;

		};

	} )(),

	intersectTriangle: function () {

		// Compute the offset origin, edges, and normal.
		var diff = new THREE.Vector3();
		var edge1 = new THREE.Vector3();
		var edge2 = new THREE.Vector3();
		var normal = new THREE.Vector3();

		return function ( a, b, c, backfaceCulling, optionalTarget ) {

			// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

			edge1.subVectors( b, a );
			edge2.subVectors( c, a );
			normal.crossVectors( edge1, edge2 );

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			var DdN = this.direction.dot( normal );
			var sign;

			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}

			diff.subVectors( this.origin, a );
			var DdQxE2 = sign * this.direction.dot( edge2.crossVectors( diff, edge2 ) );

			// b1 < 0, no intersection
			if ( DdQxE2 < 0 ) {

				return null;

			}

			var DdE1xQ = sign * this.direction.dot( edge1.cross( diff ) );

			// b2 < 0, no intersection
			if ( DdE1xQ < 0 ) {

				return null;

			}

			// b1+b2 > 1, no intersection
			if ( DdQxE2 + DdE1xQ > DdN ) {

				return null;

			}

			// Line intersects triangle, check if ray does.
			var QdN = - sign * diff.dot( normal );

			// t < 0, no intersection
			if ( QdN < 0 ) {

				return null;

			}

			// Ray intersects triangle.
			return this.at( QdN / DdN, optionalTarget );

		};

	}(),

	applyMatrix4: function ( matrix4 ) {

		this.direction.add( this.origin ).applyMatrix4( matrix4 );
		this.origin.applyMatrix4( matrix4 );
		this.direction.sub( this.origin );
		this.direction.normalize();

		return this;

	},

	equals: function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

	}

};

// File:src/math/Sphere.js

/**
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Sphere = function ( center, radius ) {

	this.center = ( center !== undefined ) ? center : new THREE.Vector3();
	this.radius = ( radius !== undefined ) ? radius : 0;

};

THREE.Sphere.prototype = {

	constructor: THREE.Sphere,

	set: function ( center, radius ) {

		this.center.copy( center );
		this.radius = radius;

		return this;

	},

	setFromPoints: function () {

		var box = new THREE.Box3();

		return function ( points, optionalCenter ) {

			var center = this.center;

			if ( optionalCenter !== undefined ) {

				center.copy( optionalCenter );

			} else {

				box.setFromPoints( points ).center( center );

			}

			var maxRadiusSq = 0;

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}

			this.radius = Math.sqrt( maxRadiusSq );

			return this;

		};

	}(),

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( sphere ) {

		this.center.copy( sphere.center );
		this.radius = sphere.radius;

		return this;

	},

	empty: function () {

		return ( this.radius <= 0 );

	},

	containsPoint: function ( point ) {

		return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

	},

	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},

	intersectsSphere: function ( sphere ) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

	},

	intersectsBox: function ( box ) {

		return box.intersectsSphere( this );

	},

	intersectsPlane: function ( plane ) {

		// We use the following equation to compute the signed distance from
		// the center of the sphere to the plane.
		//
		// distance = q * n - d
		//
		// If this distance is greater than the radius of the sphere,
		// then there is no intersection.

		return Math.abs( this.center.dot( plane.normal ) - plane.constant ) <= this.radius;

	},

	clampPoint: function ( point, optionalTarget ) {

		var deltaLengthSq = this.center.distanceToSquared( point );

		var result = optionalTarget || new THREE.Vector3();

		result.copy( point );

		if ( deltaLengthSq > ( this.radius * this.radius ) ) {

			result.sub( this.center ).normalize();
			result.multiplyScalar( this.radius ).add( this.center );

		}

		return result;

	},

	getBoundingBox: function ( optionalTarget ) {

		var box = optionalTarget || new THREE.Box3();

		box.set( this.center, this.center );
		box.expandByScalar( this.radius );

		return box;

	},

	applyMatrix4: function ( matrix ) {

		this.center.applyMatrix4( matrix );
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;

	},

	translate: function ( offset ) {

		this.center.add( offset );

		return this;

	},

	equals: function ( sphere ) {

		return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

	}

};

// File:src/math/Frustum.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / http://clara.io
 */

THREE.Frustum = function ( p0, p1, p2, p3, p4, p5 ) {

	this.planes = [

		( p0 !== undefined ) ? p0 : new THREE.Plane(),
		( p1 !== undefined ) ? p1 : new THREE.Plane(),
		( p2 !== undefined ) ? p2 : new THREE.Plane(),
		( p3 !== undefined ) ? p3 : new THREE.Plane(),
		( p4 !== undefined ) ? p4 : new THREE.Plane(),
		( p5 !== undefined ) ? p5 : new THREE.Plane()

	];

};

THREE.Frustum.prototype = {

	constructor: THREE.Frustum,

	set: function ( p0, p1, p2, p3, p4, p5 ) {

		var planes = this.planes;

		planes[ 0 ].copy( p0 );
		planes[ 1 ].copy( p1 );
		planes[ 2 ].copy( p2 );
		planes[ 3 ].copy( p3 );
		planes[ 4 ].copy( p4 );
		planes[ 5 ].copy( p5 );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( frustum ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			planes[ i ].copy( frustum.planes[ i ] );

		}

		return this;

	},

	setFromMatrix: function ( m ) {

		var planes = this.planes;
		var me = m.elements;
		var me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
		var me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
		var me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
		var me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

		planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 ).normalize();
		planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 ).normalize();
		planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 ).normalize();
		planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 ).normalize();
		planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 ).normalize();
		planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 ).normalize();

		return this;

	},

	intersectsObject: function () {

		var sphere = new THREE.Sphere();

		return function ( object ) {

			var geometry = object.geometry;

			if ( geometry.boundingSphere === null )
				geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere )
				.applyMatrix4( object.matrixWorld );

			return this.intersectsSphere( sphere );

		};

	}(),

	intersectsSprite: function () {

		var sphere = new THREE.Sphere();

		return function ( sprite ) {

			sphere.center.set( 0, 0, 0 );
			sphere.radius = 0.7071067811865476;
			sphere.applyMatrix4( sprite.matrixWorld );

			return this.intersectsSphere( sphere );

		};

	}(),

	intersectsSphere: function ( sphere ) {

		var planes = this.planes;
		var center = sphere.center;
		var negRadius = - sphere.radius;

		for ( var i = 0; i < 6; i ++ ) {

			var distance = planes[ i ].distanceToPoint( center );

			if ( distance < negRadius ) {

				return false;

			}

		}

		return true;

	},

	intersectsBox: function () {

		var p1 = new THREE.Vector3(),
			p2 = new THREE.Vector3();

		return function ( box ) {

			var planes = this.planes;

			for ( var i = 0; i < 6 ; i ++ ) {

				var plane = planes[ i ];

				p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
				p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
				p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
				p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
				p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
				p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

				var d1 = plane.distanceToPoint( p1 );
				var d2 = plane.distanceToPoint( p2 );

				// if both outside plane, no intersection

				if ( d1 < 0 && d2 < 0 ) {

					return false;

				}

			}

			return true;

		};

	}(),


	containsPoint: function ( point ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			if ( planes[ i ].distanceToPoint( point ) < 0 ) {

				return false;

			}

		}

		return true;

	}

};

// File:src/math/Plane.js

/**
 * @author bhouston / http://clara.io
 */

THREE.Plane = function ( normal, constant ) {

	this.normal = ( normal !== undefined ) ? normal : new THREE.Vector3( 1, 0, 0 );
	this.constant = ( constant !== undefined ) ? constant : 0;

};

THREE.Plane.prototype = {

	constructor: THREE.Plane,

	set: function ( normal, constant ) {

		this.normal.copy( normal );
		this.constant = constant;

		return this;

	},

	setComponents: function ( x, y, z, w ) {

		this.normal.set( x, y, z );
		this.constant = w;

		return this;

	},

	setFromNormalAndCoplanarPoint: function ( normal, point ) {

		this.normal.copy( normal );
		this.constant = - point.dot( this.normal );	// must be this.normal, not normal, as this.normal is normalized

		return this;

	},

	setFromCoplanarPoints: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function ( a, b, c ) {

			var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

			// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

			this.setFromNormalAndCoplanarPoint( normal, a );

			return this;

		};

	}(),

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( plane ) {

		this.normal.copy( plane.normal );
		this.constant = plane.constant;

		return this;

	},

	normalize: function () {

		// Note: will lead to a divide by zero if the plane is invalid.

		var inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar( inverseNormalLength );
		this.constant *= inverseNormalLength;

		return this;

	},

	negate: function () {

		this.constant *= - 1;
		this.normal.negate();

		return this;

	},

	distanceToPoint: function ( point ) {

		return this.normal.dot( point ) + this.constant;

	},

	distanceToSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) - sphere.radius;

	},

	projectPoint: function ( point, optionalTarget ) {

		return this.orthoPoint( point, optionalTarget ).sub( point ).negate();

	},

	orthoPoint: function ( point, optionalTarget ) {

		var perpendicularMagnitude = this.distanceToPoint( point );

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( perpendicularMagnitude );

	},

	intersectLine: function () {

		var v1 = new THREE.Vector3();

		return function ( line, optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			var direction = line.delta( v1 );

			var denominator = this.normal.dot( direction );

			if ( denominator === 0 ) {

				// line is coplanar, return origin
				if ( this.distanceToPoint( line.start ) === 0 ) {

					return result.copy( line.start );

				}

				// Unsure if this is the correct method to handle this case.
				return undefined;

			}

			var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

			if ( t < 0 || t > 1 ) {

				return undefined;

			}

			return result.copy( direction ).multiplyScalar( t ).add( line.start );

		};

	}(),

	intersectsLine: function ( line ) {

		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		var startSign = this.distanceToPoint( line.start );
		var endSign = this.distanceToPoint( line.end );

		return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

	},

	intersectsBox: function ( box ) {

		return box.intersectsPlane( this );

	},

	intersectsSphere: function ( sphere ) {

		return sphere.intersectsPlane( this );

	},

	coplanarPoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( - this.constant );

	},

	applyMatrix4: function () {

		var v1 = new THREE.Vector3();
		var m1 = new THREE.Matrix3();

		return function ( matrix, optionalNormalMatrix ) {

			var referencePoint = this.coplanarPoint( v1 ).applyMatrix4( matrix );

			// transform normal based on theory here:
			// http://www.songho.ca/opengl/gl_normaltransform.html
			var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );
			var normal = this.normal.applyMatrix3( normalMatrix ).normalize();

			// recalculate constant (like in setFromNormalAndCoplanarPoint)
			this.constant = - referencePoint.dot( normal );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.constant = this.constant - offset.dot( this.normal );

		return this;

	},

	equals: function ( plane ) {

		return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );

	}

};

// File:src/math/Spherical.js

/**
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 *
 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
 *
 * The poles (phi) are at the positive and negative y axis.
 * The equator starts at positive z.
 */

THREE.Spherical = function ( radius, phi, theta ) {

	this.radius = ( radius !== undefined ) ? radius : 1.0;
	this.phi = ( phi !== undefined ) ? phi : 0; // up / down towards top and bottom pole
	this.theta = ( theta !== undefined ) ? theta : 0; // around the equator of the sphere

	return this;

};

THREE.Spherical.prototype = {

	constructor: THREE.Spherical,

	set: function ( radius, phi, theta ) {

		this.radius = radius;
		this.phi = phi;
		this.theta = theta;

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( other ) {

		this.radius.copy( other.radius );
		this.phi.copy( other.phi );
		this.theta.copy( other.theta );

		return this;

	},

	// restrict phi to be betwee EPS and PI-EPS
	makeSafe: function() {

		var EPS = 0.000001;
		this.phi = Math.max( EPS, Math.min( Math.PI - EPS, this.phi ) );

		return this;

	},

	setFromVector3: function( vec3 ) {

		this.radius = vec3.length();

		if ( this.radius === 0 ) {

			this.theta = 0;
			this.phi = 0;

		} else {

			this.theta = Math.atan2( vec3.x, vec3.z ); // equator angle around y-up axis
			this.phi = Math.acos( THREE.Math.clamp( vec3.y / this.radius, - 1, 1 ) ); // polar angle

		}

		return this;

	},

};

// File:src/math/Math.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Math = {

	DEG2RAD: Math.PI / 180,
	RAD2DEG: 180 / Math.PI,

	generateUUID: function () {

		// http://www.broofa.com/Tools/Math.uuid.htm

		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
		var uuid = new Array( 36 );
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

					uuid[ i ] = '-';

				} else if ( i === 14 ) {

					uuid[ i ] = '4';

				} else {

					if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

				}

			}

			return uuid.join( '' );

		};

	}(),

	clamp: function ( value, min, max ) {

		return Math.max( min, Math.min( max, value ) );

	},

	// compute euclidian modulo of m % n
	// https://en.wikipedia.org/wiki/Modulo_operation

	euclideanModulo: function ( n, m ) {

		return ( ( n % m ) + m ) % m;

	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function ( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * ( 3 - 2 * x );

	},

	smootherstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

	},

	random16: function () {

		console.warn( 'THREE.Math.random16() has been deprecated. Use Math.random() instead.' );
		return Math.random();

	},

	// Random integer from <low, high> interval

	randInt: function ( low, high ) {

		return low + Math.floor( Math.random() * ( high - low + 1 ) );

	},

	// Random float from <low, high> interval

	randFloat: function ( low, high ) {

		return low + Math.random() * ( high - low );

	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function ( range ) {

		return range * ( 0.5 - Math.random() );

	},

	degToRad: function ( degrees ) {

		return degrees * THREE.Math.DEG2RAD;

	},

	radToDeg: function ( radians ) {

		return radians * THREE.Math.RAD2DEG;

	},

	isPowerOfTwo: function ( value ) {

		return ( value & ( value - 1 ) ) === 0 && value !== 0;

	},

	nearestPowerOfTwo: function ( value ) {

		return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );

	},

	nextPowerOfTwo: function ( value ) {

		value --;
		value |= value >> 1;
		value |= value >> 2;
		value |= value >> 4;
		value |= value >> 8;
		value |= value >> 16;
		value ++;

		return value;

	}

};

// File:src/math/Spline.js

/**
 * Spline from Tween.js, slightly optimized (and trashed)
 * http://sole.github.com/tween.js/examples/05_spline.html
 *
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Spline = function ( points ) {

	this.points = points;

	var c = [], v3 = { x: 0, y: 0, z: 0 },
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;

	this.initFromArray = function ( a ) {

		this.points = [];

		for ( var i = 0; i < a.length; i ++ ) {

			this.points[ i ] = { x: a[ i ][ 0 ], y: a[ i ][ 1 ], z: a[ i ][ 2 ] };

		}

	};

	this.getPoint = function ( k ) {

		point = ( this.points.length - 1 ) * k;
		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint  > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
		c[ 3 ] = intPoint  > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;

		pa = this.points[ c[ 0 ] ];
		pb = this.points[ c[ 1 ] ];
		pc = this.points[ c[ 2 ] ];
		pd = this.points[ c[ 3 ] ];

		w2 = weight * weight;
		w3 = weight * w2;

		v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
		v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
		v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

		return v3;

	};

	this.getControlPointsArray = function () {

		var i, p, l = this.points.length,
			coords = [];

		for ( i = 0; i < l; i ++ ) {

			p = this.points[ i ];
			coords[ i ] = [ p.x, p.y, p.z ];

		}

		return coords;

	};

	// approximate length by summing linear segments

	this.getLength = function ( nSubDivisions ) {

		var i, index, nSamples, position,
			point = 0, intPoint = 0, oldIntPoint = 0,
			oldPosition = new THREE.Vector3(),
			tmpVec = new THREE.Vector3(),
			chunkLengths = [],
			totalLength = 0;

		// first point has 0 length

		chunkLengths[ 0 ] = 0;

		if ( ! nSubDivisions ) nSubDivisions = 100;

		nSamples = this.points.length * nSubDivisions;

		oldPosition.copy( this.points[ 0 ] );

		for ( i = 1; i < nSamples; i ++ ) {

			index = i / nSamples;

			position = this.getPoint( index );
			tmpVec.copy( position );

			totalLength += tmpVec.distanceTo( oldPosition );

			oldPosition.copy( position );

			point = ( this.points.length - 1 ) * index;
			intPoint = Math.floor( point );

			if ( intPoint !== oldIntPoint ) {

				chunkLengths[ intPoint ] = totalLength;
				oldIntPoint = intPoint;

			}

		}

		// last point ends with total length

		chunkLengths[ chunkLengths.length ] = totalLength;

		return { chunks: chunkLengths, total: totalLength };

	};

	this.reparametrizeByArcLength = function ( samplingCoef ) {

		var i, j,
			index, indexCurrent, indexNext,
			realDistance,
			sampling, position,
			newpoints = [],
			tmpVec = new THREE.Vector3(),
			sl = this.getLength();

		newpoints.push( tmpVec.copy( this.points[ 0 ] ).clone() );

		for ( i = 1; i < this.points.length; i ++ ) {

			//tmpVec.copy( this.points[ i - 1 ] );
			//linearDistance = tmpVec.distanceTo( this.points[ i ] );

			realDistance = sl.chunks[ i ] - sl.chunks[ i - 1 ];

			sampling = Math.ceil( samplingCoef * realDistance / sl.total );

			indexCurrent = ( i - 1 ) / ( this.points.length - 1 );
			indexNext = i / ( this.points.length - 1 );

			for ( j = 1; j < sampling - 1; j ++ ) {

				index = indexCurrent + j * ( 1 / sampling ) * ( indexNext - indexCurrent );

				position = this.getPoint( index );
				newpoints.push( tmpVec.copy( position ).clone() );

			}

			newpoints.push( tmpVec.copy( this.points[ i ] ).clone() );

		}

		this.points = newpoints;

	};

	// Catmull-Rom

	function interpolate( p0, p1, p2, p3, t, t2, t3 ) {

		var v0 = ( p2 - p0 ) * 0.5,
			v1 = ( p3 - p1 ) * 0.5;

		return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

};

// File:src/math/Triangle.js

/**
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Triangle = function ( a, b, c ) {

	this.a = ( a !== undefined ) ? a : new THREE.Vector3();
	this.b = ( b !== undefined ) ? b : new THREE.Vector3();
	this.c = ( c !== undefined ) ? c : new THREE.Vector3();

};

THREE.Triangle.normal = function () {

	var v0 = new THREE.Vector3();

	return function ( a, b, c, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		result.subVectors( c, b );
		v0.subVectors( a, b );
		result.cross( v0 );

		var resultLengthSq = result.lengthSq();
		if ( resultLengthSq > 0 ) {

			return result.multiplyScalar( 1 / Math.sqrt( resultLengthSq ) );

		}

		return result.set( 0, 0, 0 );

	};

}();

// static/instance method to calculate barycentric coordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
THREE.Triangle.barycoordFromPoint = function () {

	var v0 = new THREE.Vector3();
	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( point, a, b, c, optionalTarget ) {

		v0.subVectors( c, a );
		v1.subVectors( b, a );
		v2.subVectors( point, a );

		var dot00 = v0.dot( v0 );
		var dot01 = v0.dot( v1 );
		var dot02 = v0.dot( v2 );
		var dot11 = v1.dot( v1 );
		var dot12 = v1.dot( v2 );

		var denom = ( dot00 * dot11 - dot01 * dot01 );

		var result = optionalTarget || new THREE.Vector3();

		// collinear or singular triangle
		if ( denom === 0 ) {

			// arbitrary location outside of triangle?
			// not sure if this is the best idea, maybe should be returning undefined
			return result.set( - 2, - 1, - 1 );

		}

		var invDenom = 1 / denom;
		var u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
		var v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

		// barycentric coordinates must always sum to 1
		return result.set( 1 - u - v, v, u );

	};

}();

THREE.Triangle.containsPoint = function () {

	var v1 = new THREE.Vector3();

	return function ( point, a, b, c ) {

		var result = THREE.Triangle.barycoordFromPoint( point, a, b, c, v1 );

		return ( result.x >= 0 ) && ( result.y >= 0 ) && ( ( result.x + result.y ) <= 1 );

	};

}();

THREE.Triangle.prototype = {

	constructor: THREE.Triangle,

	set: function ( a, b, c ) {

		this.a.copy( a );
		this.b.copy( b );
		this.c.copy( c );

		return this;

	},

	setFromPointsAndIndices: function ( points, i0, i1, i2 ) {

		this.a.copy( points[ i0 ] );
		this.b.copy( points[ i1 ] );
		this.c.copy( points[ i2 ] );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( triangle ) {

		this.a.copy( triangle.a );
		this.b.copy( triangle.b );
		this.c.copy( triangle.c );

		return this;

	},

	area: function () {

		var v0 = new THREE.Vector3();
		var v1 = new THREE.Vector3();

		return function () {

			v0.subVectors( this.c, this.b );
			v1.subVectors( this.a, this.b );

			return v0.cross( v1 ).length() * 0.5;

		};

	}(),

	midpoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

	},

	normal: function ( optionalTarget ) {

		return THREE.Triangle.normal( this.a, this.b, this.c, optionalTarget );

	},

	plane: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Plane();

		return result.setFromCoplanarPoints( this.a, this.b, this.c );

	},

	barycoordFromPoint: function ( point, optionalTarget ) {

		return THREE.Triangle.barycoordFromPoint( point, this.a, this.b, this.c, optionalTarget );

	},

	containsPoint: function ( point ) {

		return THREE.Triangle.containsPoint( point, this.a, this.b, this.c );

	},

	closestPointToPoint: function () {

		var plane, edgeList, projectedPoint, closestPoint;

		return function closestPointToPoint( point, optionalTarget ) {

			if ( plane === undefined ) {

				plane = new THREE.Plane();
				edgeList = [ new THREE.Line3(), new THREE.Line3(), new THREE.Line3() ];
				projectedPoint = new THREE.Vector3();
				closestPoint = new THREE.Vector3();

			}

			var result = optionalTarget || new THREE.Vector3();
			var minDistance = Infinity;

			// project the point onto the plane of the triangle

			plane.setFromCoplanarPoints( this.a, this.b, this.c );
			plane.projectPoint( point, projectedPoint );

			// check if the projection lies within the triangle

			if( this.containsPoint( projectedPoint ) === true ) {

				// if so, this is the closest point

				result.copy( projectedPoint );

			} else {

				// if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices

				edgeList[ 0 ].set( this.a, this.b );
				edgeList[ 1 ].set( this.b, this.c );
				edgeList[ 2 ].set( this.c, this.a );

				for( var i = 0; i < edgeList.length; i ++ ) {

					edgeList[ i ].closestPointToPoint( projectedPoint, true, closestPoint );

					var distance = projectedPoint.distanceToSquared( closestPoint );

					if( distance < minDistance ) {

						minDistance = distance;

						result.copy( closestPoint );

					}

				}

			}

			return result;

		};

	}(),

	equals: function ( triangle ) {

		return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

	}

};

// File:src/math/Interpolant.js

/**
 * Abstract base class of interpolants over parametric samples.
 *
 * The parameter domain is one dimensional, typically the time or a path
 * along a curve defined by the data.
 *
 * The sample values can have any dimensionality and derived classes may
 * apply special interpretations to the data.
 *
 * This class provides the interval seek in a Template Method, deferring
 * the actual interpolation to derived classes.
 *
 * Time complexity is O(1) for linear access crossing at most two points
 * and O(log N) for random access, where N is the number of positions.
 *
 * References:
 *
 * 		http://www.oodesign.com/template-method-pattern.html
 *
 * @author tschw
 */

THREE.Interpolant = function(
		parameterPositions, sampleValues, sampleSize, resultBuffer ) {

	this.parameterPositions = parameterPositions;
	this._cachedIndex = 0;

	this.resultBuffer = resultBuffer !== undefined ?
			resultBuffer : new sampleValues.constructor( sampleSize );
	this.sampleValues = sampleValues;
	this.valueSize = sampleSize;

};

THREE.Interpolant.prototype = {

	constructor: THREE.Interpolant,

	evaluate: function( t ) {

		var pp = this.parameterPositions,
			i1 = this._cachedIndex,

			t1 = pp[   i1   ],
			t0 = pp[ i1 - 1 ];

		validate_interval: {

			seek: {

				var right;

				linear_scan: {
//- See http://jsperf.com/comparison-to-undefined/3
//- slower code:
//-
//- 				if ( t >= t1 || t1 === undefined ) {
					forward_scan: if ( ! ( t < t1 ) ) {

						for ( var giveUpAt = i1 + 2; ;) {

							if ( t1 === undefined ) {

								if ( t < t0 ) break forward_scan;

								// after end

								i1 = pp.length;
								this._cachedIndex = i1;
								return this.afterEnd_( i1 - 1, t, t0 );

							}

							if ( i1 === giveUpAt ) break; // this loop

							t0 = t1;
							t1 = pp[ ++ i1 ];

							if ( t < t1 ) {

								// we have arrived at the sought interval
								break seek;

							}

						}

						// prepare binary search on the right side of the index
						right = pp.length;
						break linear_scan;

					}

//- slower code:
//-					if ( t < t0 || t0 === undefined ) {
					if ( ! ( t >= t0 ) ) {

						// looping?

						var t1global = pp[ 1 ];

						if ( t < t1global ) {

							i1 = 2; // + 1, using the scan for the details
							t0 = t1global;

						}

						// linear reverse scan

						for ( var giveUpAt = i1 - 2; ;) {

							if ( t0 === undefined ) {

								// before start

								this._cachedIndex = 0;
								return this.beforeStart_( 0, t, t1 );

							}

							if ( i1 === giveUpAt ) break; // this loop

							t1 = t0;
							t0 = pp[ -- i1 - 1 ];

							if ( t >= t0 ) {

								// we have arrived at the sought interval
								break seek;

							}

						}

						// prepare binary search on the left side of the index
						right = i1;
						i1 = 0;
						break linear_scan;

					}

					// the interval is valid

					break validate_interval;

				} // linear scan

				// binary search

				while ( i1 < right ) {

					var mid = ( i1 + right ) >>> 1;

					if ( t < pp[ mid ] ) {

						right = mid;

					} else {

						i1 = mid + 1;

					}

				}

				t1 = pp[   i1   ];
				t0 = pp[ i1 - 1 ];

				// check boundary cases, again

				if ( t0 === undefined ) {

					this._cachedIndex = 0;
					return this.beforeStart_( 0, t, t1 );

				}

				if ( t1 === undefined ) {

					i1 = pp.length;
					this._cachedIndex = i1;
					return this.afterEnd_( i1 - 1, t0, t );

				}

			} // seek

			this._cachedIndex = i1;

			this.intervalChanged_( i1, t0, t1 );

		} // validate_interval

		return this.interpolate_( i1, t0, t, t1 );

	},

	settings: null, // optional, subclass-specific settings structure
	// Note: The indirection allows central control of many interpolants.

	// --- Protected interface

	DefaultSettings_: {},

	getSettings_: function() {

		return this.settings || this.DefaultSettings_;

	},

	copySampleValue_: function( index ) {

		// copies a sample value to the result buffer

		var result = this.resultBuffer,
			values = this.sampleValues,
			stride = this.valueSize,
			offset = index * stride;

		for ( var i = 0; i !== stride; ++ i ) {

			result[ i ] = values[ offset + i ];

		}

		return result;

	},

	// Template methods for derived classes:

	interpolate_: function( i1, t0, t, t1 ) {

		throw new Error( "call to abstract method" );
		// implementations shall return this.resultBuffer

	},

	intervalChanged_: function( i1, t0, t1 ) {

		// empty

	}

};

Object.assign( THREE.Interpolant.prototype, {

	beforeStart_: //( 0, t, t0 ), returns this.resultBuffer
		THREE.Interpolant.prototype.copySampleValue_,

	afterEnd_: //( N-1, tN-1, t ), returns this.resultBuffer
		THREE.Interpolant.prototype.copySampleValue_

} );

// File:src/math/interpolants/CubicInterpolant.js

/**
 * Fast and simple cubic spline interpolant.
 *
 * It was derived from a Hermitian construction setting the first derivative
 * at each sample position to the linear slope between neighboring positions
 * over their parameter interval.
 *
 * @author tschw
 */

THREE.CubicInterpolant = function(
		parameterPositions, sampleValues, sampleSize, resultBuffer ) {

	THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer );

	this._weightPrev = -0;
	this._offsetPrev = -0;
	this._weightNext = -0;
	this._offsetNext = -0;

};

THREE.CubicInterpolant.prototype =
		Object.assign( Object.create( THREE.Interpolant.prototype ), {

	constructor: THREE.CubicInterpolant,

	DefaultSettings_: {

		endingStart: 	THREE.ZeroCurvatureEnding,
		endingEnd:		THREE.ZeroCurvatureEnding

	},

	intervalChanged_: function( i1, t0, t1 ) {

		var pp = this.parameterPositions,
			iPrev = i1 - 2,
			iNext = i1 + 1,

			tPrev = pp[ iPrev ],
			tNext = pp[ iNext ];

		if ( tPrev === undefined ) {

			switch ( this.getSettings_().endingStart ) {

				case THREE.ZeroSlopeEnding:

					// f'(t0) = 0
					iPrev = i1;
					tPrev = 2 * t0 - t1;

					break;

				case THREE.WrapAroundEnding:

					// use the other end of the curve
					iPrev = pp.length - 2;
					tPrev = t0 + pp[ iPrev ] - pp[ iPrev + 1 ];

					break;

				default: // ZeroCurvatureEnding

					// f''(t0) = 0 a.k.a. Natural Spline
					iPrev = i1;
					tPrev = t1;

			}

		}

		if ( tNext === undefined ) {

			switch ( this.getSettings_().endingEnd ) {

				case THREE.ZeroSlopeEnding:

					// f'(tN) = 0
					iNext = i1;
					tNext = 2 * t1 - t0;

					break;

				case THREE.WrapAroundEnding:

					// use the other end of the curve
					iNext = 1;
					tNext = t1 + pp[ 1 ] - pp[ 0 ];

					break;

				default: // ZeroCurvatureEnding

					// f''(tN) = 0, a.k.a. Natural Spline
					iNext = i1 - 1;
					tNext = t0;

			}

		}

		var halfDt = ( t1 - t0 ) * 0.5,
			stride = this.valueSize;

		this._weightPrev = halfDt / ( t0 - tPrev );
		this._weightNext = halfDt / ( tNext - t1 );
		this._offsetPrev = iPrev * stride;
		this._offsetNext = iNext * stride;

	},

	interpolate_: function( i1, t0, t, t1 ) {

		var result = this.resultBuffer,
			values = this.sampleValues,
			stride = this.valueSize,

			o1 = i1 * stride,		o0 = o1 - stride,
			oP = this._offsetPrev, 	oN = this._offsetNext,
			wP = this._weightPrev,	wN = this._weightNext,

			p = ( t - t0 ) / ( t1 - t0 ),
			pp = p * p,
			ppp = pp * p;

		// evaluate polynomials

		var sP =     - wP   * ppp   +         2 * wP    * pp    -          wP   * p;
		var s0 = ( 1 + wP ) * ppp   + (-1.5 - 2 * wP )  * pp    + ( -0.5 + wP ) * p     + 1;
		var s1 = (-1 - wN ) * ppp   + ( 1.5 +   wN   )  * pp    +    0.5        * p;
		var sN =       wN   * ppp   -           wN      * pp;

		// combine data linearly

		for ( var i = 0; i !== stride; ++ i ) {

			result[ i ] =
					sP * values[ oP + i ] +
					s0 * values[ o0 + i ] +
					s1 * values[ o1 + i ] +
					sN * values[ oN + i ];

		}

		return result;

	}

} );

// File:src/math/interpolants/DiscreteInterpolant.js

/**
 *
 * Interpolant that evaluates to the sample value at the position preceeding
 * the parameter.
 *
 * @author tschw
 */

THREE.DiscreteInterpolant = function(
		parameterPositions, sampleValues, sampleSize, resultBuffer ) {

	THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer );

};

THREE.DiscreteInterpolant.prototype =
		Object.assign( Object.create( THREE.Interpolant.prototype ), {

	constructor: THREE.DiscreteInterpolant,

	interpolate_: function( i1, t0, t, t1 ) {

		return this.copySampleValue_( i1 - 1 );

	}

} );

// File:src/math/interpolants/LinearInterpolant.js

/**
 * @author tschw
 */

THREE.LinearInterpolant = function(
		parameterPositions, sampleValues, sampleSize, resultBuffer ) {

	THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer );

};

THREE.LinearInterpolant.prototype =
		Object.assign( Object.create( THREE.Interpolant.prototype ), {

	constructor: THREE.LinearInterpolant,

	interpolate_: function( i1, t0, t, t1 ) {

		var result = this.resultBuffer,
			values = this.sampleValues,
			stride = this.valueSize,

			offset1 = i1 * stride,
			offset0 = offset1 - stride,

			weight1 = ( t - t0 ) / ( t1 - t0 ),
			weight0 = 1 - weight1;

		for ( var i = 0; i !== stride; ++ i ) {

			result[ i ] =
					values[ offset0 + i ] * weight0 +
					values[ offset1 + i ] * weight1;

		}

		return result;

	}

} );

// File:src/math/interpolants/QuaternionLinearInterpolant.js

/**
 * Spherical linear unit quaternion interpolant.
 *
 * @author tschw
 */

THREE.QuaternionLinearInterpolant = function(
		parameterPositions, sampleValues, sampleSize, resultBuffer ) {

	THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer );

};

THREE.QuaternionLinearInterpolant.prototype =
		Object.assign( Object.create( THREE.Interpolant.prototype ), {

	constructor: THREE.QuaternionLinearInterpolant,

	interpolate_: function( i1, t0, t, t1 ) {

		var result = this.resultBuffer,
			values = this.sampleValues,
			stride = this.valueSize,

			offset = i1 * stride,

			alpha = ( t - t0 ) / ( t1 - t0 );

		for ( var end = offset + stride; offset !== end; offset += 4 ) {

			THREE.Quaternion.slerpFlat( result, 0,
					values, offset - stride, values, offset, alpha );

		}

		return result;

	}

} );

// File:src/core/Clock.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Clock = function ( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.running = false;

};

THREE.Clock.prototype = {

	constructor: THREE.Clock,

	start: function () {

		this.startTime = ( performance || Date ).now();

		this.oldTime = this.startTime;
		this.running = true;

	},

	stop: function () {

		this.getElapsedTime();
		this.running = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getDelta: function () {

		var diff = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();

		}

		if ( this.running ) {

			var newTime = ( performance || Date ).now();

			diff = ( newTime - this.oldTime ) / 1000;
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	}

};

// File:src/core/EventDispatcher.js

/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

THREE.EventDispatcher = function () {};

Object.assign( THREE.EventDispatcher.prototype, {

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = [], i = 0;
			var length = listenerArray.length;

			for ( i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}

} );

// File:src/core/Layers.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Layers = function () {

	this.mask = 1;

};

THREE.Layers.prototype = {

	constructor: THREE.Layers,

	set: function ( channel ) {

		this.mask = 1 << channel;

	},

	enable: function ( channel ) {

		this.mask |= 1 << channel;

	},

	toggle: function ( channel ) {

		this.mask ^= 1 << channel;

	},

	disable: function ( channel ) {

		this.mask &= ~ ( 1 << channel );

	},

	test: function ( layers ) {

		return ( this.mask & layers.mask ) !== 0;

	}

};

// File:src/core/Raycaster.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 */

( function ( THREE ) {

	THREE.Raycaster = function ( origin, direction, near, far ) {

		this.ray = new THREE.Ray( origin, direction );
		// direction is assumed to be normalized (for accurate distance calculations)

		this.near = near || 0;
		this.far = far || Infinity;

		this.params = {
			Mesh: {},
			Line: {},
			LOD: {},
			Points: { threshold: 1 },
			Sprite: {}
		};

		Object.defineProperties( this.params, {
			PointCloud: {
				get: function () {
					console.warn( 'THREE.Raycaster: params.PointCloud has been renamed to params.Points.' );
					return this.Points;
				}
			}
		} );

	};

	function ascSort( a, b ) {

		return a.distance - b.distance;

	}

	function intersectObject( object, raycaster, intersects, recursive ) {

		if ( object.visible === false ) return;

		object.raycast( raycaster, intersects );

		if ( recursive === true ) {

			var children = object.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				intersectObject( children[ i ], raycaster, intersects, true );

			}

		}

	}

	//

	THREE.Raycaster.prototype = {

		constructor: THREE.Raycaster,

		linePrecision: 1,

		set: function ( origin, direction ) {

			// direction is assumed to be normalized (for accurate distance calculations)

			this.ray.set( origin, direction );

		},

		setFromCamera: function ( coords, camera ) {

			if ( camera instanceof THREE.PerspectiveCamera ) {

				this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
				this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();

			} else if ( camera instanceof THREE.OrthographicCamera ) {

				this.ray.origin.set( coords.x, coords.y, - 1 ).unproject( camera );
				this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );

			} else {

				console.error( 'THREE.Raycaster: Unsupported camera type.' );

			}

		},

		intersectObject: function ( object, recursive ) {

			var intersects = [];

			intersectObject( object, this, intersects, recursive );

			intersects.sort( ascSort );

			return intersects;

		},

		intersectObjects: function ( objects, recursive ) {

			var intersects = [];

			if ( Array.isArray( objects ) === false ) {

				console.warn( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
				return intersects;

			}

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				intersectObject( objects[ i ], this, intersects, recursive );

			}

			intersects.sort( ascSort );

			return intersects;

		}

	};

}( THREE ) );

// File:src/core/Object3D.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author elephantatwork / www.elephantatwork.ch
 */

THREE.Object3D = function () {

	Object.defineProperty( this, 'id', { value: THREE.Object3DIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Object3D';

	this.parent = null;
	this.children = [];

	this.up = THREE.Object3D.DefaultUp.clone();

	var position = new THREE.Vector3();
	var rotation = new THREE.Euler();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3( 1, 1, 1 );

	function onRotationChange() {

		quaternion.setFromEuler( rotation, false );

	}

	function onQuaternionChange() {

		rotation.setFromQuaternion( quaternion, undefined, false );

	}

	rotation.onChange( onRotationChange );
	quaternion.onChange( onQuaternionChange );

	Object.defineProperties( this, {
		position: {
			enumerable: true,
			value: position
		},
		rotation: {
			enumerable: true,
			value: rotation
		},
		quaternion: {
			enumerable: true,
			value: quaternion
		},
		scale: {
			enumerable: true,
			value: scale
		},
		modelViewMatrix: {
			value: new THREE.Matrix4()
		},
		normalMatrix: {
			value: new THREE.Matrix3()
		}
	} );

	this.matrix = new THREE.Matrix4();
	this.matrixWorld = new THREE.Matrix4();

	this.matrixAutoUpdate = THREE.Object3D.DefaultMatrixAutoUpdate;
	this.matrixWorldNeedsUpdate = false;

	this.layers = new THREE.Layers();
	this.visible = true;

	this.castShadow = false;
	this.receiveShadow = false;

	this.frustumCulled = true;
	this.renderOrder = 0;

	this.userData = {};

};

THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 1, 0 );
THREE.Object3D.DefaultMatrixAutoUpdate = true;

Object.assign( THREE.Object3D.prototype, THREE.EventDispatcher.prototype, {

	applyMatrix: function ( matrix ) {

		this.matrix.multiplyMatrices( matrix, this.matrix );

		this.matrix.decompose( this.position, this.quaternion, this.scale );

	},

	setRotationFromAxisAngle: function ( axis, angle ) {

		// assumes axis is normalized

		this.quaternion.setFromAxisAngle( axis, angle );

	},

	setRotationFromEuler: function ( euler ) {

		this.quaternion.setFromEuler( euler, true );

	},

	setRotationFromMatrix: function ( m ) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix( m );

	},

	setRotationFromQuaternion: function ( q ) {

		// assumes q is normalized

		this.quaternion.copy( q );

	},

	rotateOnAxis: function () {

		// rotate object on axis in object space
		// axis is assumed to be normalized

		var q1 = new THREE.Quaternion();

		return function ( axis, angle ) {

			q1.setFromAxisAngle( axis, angle );

			this.quaternion.multiply( q1 );

			return this;

		};

	}(),

	rotateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	translateOnAxis: function () {

		// translate object by distance along axis in object space
		// axis is assumed to be normalized

		var v1 = new THREE.Vector3();

		return function ( axis, distance ) {

			v1.copy( axis ).applyQuaternion( this.quaternion );

			this.position.add( v1.multiplyScalar( distance ) );

			return this;

		};

	}(),

	translateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	localToWorld: function ( vector ) {

		return vector.applyMatrix4( this.matrixWorld );

	},

	worldToLocal: function () {

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );

		};

	}(),

	lookAt: function () {

		// This routine does not support objects with rotated and/or translated parent(s)

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			m1.lookAt( vector, this.position, this.up );

			this.quaternion.setFromRotationMatrix( m1 );

		};

	}(),

	add: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i ++ ) {

				this.add( arguments[ i ] );

			}

			return this;

		}

		if ( object === this ) {

			console.error( "THREE.Object3D.add: object can't be added as a child of itself.", object );
			return this;

		}

		if ( object instanceof THREE.Object3D ) {

			if ( object.parent !== null ) {

				object.parent.remove( object );

			}

			object.parent = this;
			object.dispatchEvent( { type: 'added' } );

			this.children.push( object );

		} else {

			console.error( "THREE.Object3D.add: object not an instance of THREE.Object3D.", object );

		}

		return this;

	},

	remove: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i ++ ) {

				this.remove( arguments[ i ] );

			}

		}

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = null;

			object.dispatchEvent( { type: 'removed' } );

			this.children.splice( index, 1 );

		}

	},

	getObjectById: function ( id ) {

		return this.getObjectByProperty( 'id', id );

	},

	getObjectByName: function ( name ) {

		return this.getObjectByProperty( 'name', name );

	},

	getObjectByProperty: function ( name, value ) {

		if ( this[ name ] === value ) return this;

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];
			var object = child.getObjectByProperty( name, value );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	},

	getWorldPosition: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.updateMatrixWorld( true );

		return result.setFromMatrixPosition( this.matrixWorld );

	},

	getWorldQuaternion: function () {

		var position = new THREE.Vector3();
		var scale = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Quaternion();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, result, scale );

			return result;

		};

	}(),

	getWorldRotation: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Euler();

			this.getWorldQuaternion( quaternion );

			return result.setFromQuaternion( quaternion, this.rotation.order, false );

		};

	}(),

	getWorldScale: function () {

		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, quaternion, result );

			return result;

		};

	}(),

	getWorldDirection: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.getWorldQuaternion( quaternion );

			return result.set( 0, 0, 1 ).applyQuaternion( quaternion );

		};

	}(),

	raycast: function () {},

	traverse: function ( callback ) {

		callback( this );

		var children = this.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].traverse( callback );

		}

	},

	traverseVisible: function ( callback ) {

		if ( this.visible === false ) return;

		callback( this );

		var children = this.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].traverseVisible( callback );

		}

	},

	traverseAncestors: function ( callback ) {

		var parent = this.parent;

		if ( parent !== null ) {

			callback( parent );

			parent.traverseAncestors( callback );

		}

	},

	updateMatrix: function () {

		this.matrix.compose( this.position, this.quaternion, this.scale );

		this.matrixWorldNeedsUpdate = true;

	},

	updateMatrixWorld: function ( force ) {

		if ( this.matrixAutoUpdate === true ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate === true || force === true ) {

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	},

	toJSON: function ( meta ) {

		// meta is '' when called from JSON.stringify
		var isRootObject = ( meta === undefined || meta === '' );

		var output = {};

		// meta is a hash used to collect geometries, materials.
		// not providing it implies that this is the root object
		// being serialized.
		if ( isRootObject ) {

			// initialize meta obj
			meta = {
				geometries: {},
				materials: {},
				textures: {},
				images: {}
			};

			output.metadata = {
				version: 4.4,
				type: 'Object',
				generator: 'Object3D.toJSON'
			};

		}

		// standard Object3D serialization

		var object = {};

		object.uuid = this.uuid;
		object.type = this.type;

		if ( this.name !== '' ) object.name = this.name;
		if ( JSON.stringify( this.userData ) !== '{}' ) object.userData = this.userData;
		if ( this.castShadow === true ) object.castShadow = true;
		if ( this.receiveShadow === true ) object.receiveShadow = true;
		if ( this.visible === false ) object.visible = false;

		object.matrix = this.matrix.toArray();

		//

		if ( this.geometry !== undefined ) {

			if ( meta.geometries[ this.geometry.uuid ] === undefined ) {

				meta.geometries[ this.geometry.uuid ] = this.geometry.toJSON( meta );

			}

			object.geometry = this.geometry.uuid;

		}

		if ( this.material !== undefined ) {

			if ( meta.materials[ this.material.uuid ] === undefined ) {

				meta.materials[ this.material.uuid ] = this.material.toJSON( meta );

			}

			object.material = this.material.uuid;

		}

		//

		if ( this.children.length > 0 ) {

			object.children = [];

			for ( var i = 0; i < this.children.length; i ++ ) {

				object.children.push( this.children[ i ].toJSON( meta ).object );

			}

		}

		if ( isRootObject ) {

			var geometries = extractFromCache( meta.geometries );
			var materials = extractFromCache( meta.materials );
			var textures = extractFromCache( meta.textures );
			var images = extractFromCache( meta.images );

			if ( geometries.length > 0 ) output.geometries = geometries;
			if ( materials.length > 0 ) output.materials = materials;
			if ( textures.length > 0 ) output.textures = textures;
			if ( images.length > 0 ) output.images = images;

		}

		output.object = object;

		return output;

		// extract data from the cache hash
		// remove metadata on each item
		// and return as array
		function extractFromCache ( cache ) {

			var values = [];
			for ( var key in cache ) {

				var data = cache[ key ];
				delete data.metadata;
				values.push( data );

			}
			return values;

		}

	},

	clone: function ( recursive ) {

		return new this.constructor().copy( this, recursive );

	},

	copy: function ( source, recursive ) {

		if ( recursive === undefined ) recursive = true;

		this.name = source.name;

		this.up.copy( source.up );

		this.position.copy( source.position );
		this.quaternion.copy( source.quaternion );
		this.scale.copy( source.scale );

		this.matrix.copy( source.matrix );
		this.matrixWorld.copy( source.matrixWorld );

		this.matrixAutoUpdate = source.matrixAutoUpdate;
		this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

		this.visible = source.visible;

		this.castShadow = source.castShadow;
		this.receiveShadow = source.receiveShadow;

		this.frustumCulled = source.frustumCulled;
		this.renderOrder = source.renderOrder;

		this.userData = JSON.parse( JSON.stringify( source.userData ) );

		if ( recursive === true ) {

			for ( var i = 0; i < source.children.length; i ++ ) {

				var child = source.children[ i ];
				this.add( child.clone() );

			}

		}

		return this;

	}

} );

THREE.Object3DIdCount = 0;

// File:src/core/Face3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color, materialIndex ) {

	this.a = a;
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = Array.isArray( normal ) ? normal : [];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = Array.isArray( color ) ? color : [];

	this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

};

THREE.Face3.prototype = {

	constructor: THREE.Face3,

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( source ) {

		this.a = source.a;
		this.b = source.b;
		this.c = source.c;

		this.normal.copy( source.normal );
		this.color.copy( source.color );

		this.materialIndex = source.materialIndex;

		for ( var i = 0, il = source.vertexNormals.length; i < il; i ++ ) {

			this.vertexNormals[ i ] = source.vertexNormals[ i ].clone();

		}

		for ( var i = 0, il = source.vertexColors.length; i < il; i ++ ) {

			this.vertexColors[ i ] = source.vertexColors[ i ].clone();

		}

		return this;

	}

};

// File:src/core/BufferAttribute.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferAttribute = function ( array, itemSize, normalized ) {

	this.uuid = THREE.Math.generateUUID();

	this.array = array;
	this.itemSize = itemSize;

	this.dynamic = false;
	this.updateRange = { offset: 0, count: - 1 };

	this.version = 0;
	this.normalized = normalized === true;

};

THREE.BufferAttribute.prototype = {

	constructor: THREE.BufferAttribute,

	get count() {

		return this.array.length / this.itemSize;

	},

	set needsUpdate( value ) {

		if ( value === true ) this.version ++;

	},

	setDynamic: function ( value ) {

		this.dynamic = value;

		return this;

	},

	copy: function ( source ) {

		this.array = new source.array.constructor( source.array );
		this.itemSize = source.itemSize;

		this.dynamic = source.dynamic;

		return this;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.itemSize;
		index2 *= attribute.itemSize;

		for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	},

	copyArray: function ( array ) {

		this.array.set( array );

		return this;

	},

	copyColorsArray: function ( colors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = colors.length; i < l; i ++ ) {

			var color = colors[ i ];

			if ( color === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
				color = new THREE.Color();

			}

			array[ offset ++ ] = color.r;
			array[ offset ++ ] = color.g;
			array[ offset ++ ] = color.b;

		}

		return this;

	},

	copyIndicesArray: function ( indices ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = indices.length; i < l; i ++ ) {

			var index = indices[ i ];

			array[ offset ++ ] = index.a;
			array[ offset ++ ] = index.b;
			array[ offset ++ ] = index.c;

		}

		return this;

	},

	copyVector2sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
				vector = new THREE.Vector2();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;

		}

		return this;

	},

	copyVector3sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
				vector = new THREE.Vector3();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;

		}

		return this;

	},

	copyVector4sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
				vector = new THREE.Vector4();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;
			array[ offset ++ ] = vector.w;

		}

		return this;

	},

	set: function ( value, offset ) {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	},

	getX: function ( index ) {

		return this.array[ index * this.itemSize ];

	},

	setX: function ( index, x ) {

		this.array[ index * this.itemSize ] = x;

		return this;

	},

	getY: function ( index ) {

		return this.array[ index * this.itemSize + 1 ];

	},

	setY: function ( index, y ) {

		this.array[ index * this.itemSize + 1 ] = y;

		return this;

	},

	getZ: function ( index ) {

		return this.array[ index * this.itemSize + 2 ];

	},

	setZ: function ( index, z ) {

		this.array[ index * this.itemSize + 2 ] = z;

		return this;

	},

	getW: function ( index ) {

		return this.array[ index * this.itemSize + 3 ];

	},

	setW: function ( index, w ) {

		this.array[ index * this.itemSize + 3 ] = w;

		return this;

	},

	setXY: function ( index, x, y ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;

		return this;

	},

	setXYZ: function ( index, x, y, z ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;

	},

	setXYZW: function ( index, x, y, z, w ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	}

};

//

THREE.Int8Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Int8Array( array ), itemSize );

};

THREE.Uint8Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint8Array( array ), itemSize );

};

THREE.Uint8ClampedAttribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint8ClampedArray( array ), itemSize );

};

THREE.Int16Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Int16Array( array ), itemSize );

};

THREE.Uint16Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint16Array( array ), itemSize );

};

THREE.Int32Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Int32Array( array ), itemSize );

};

THREE.Uint32Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint32Array( array ), itemSize );

};

THREE.Float32Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Float32Array( array ), itemSize );

};

THREE.Float64Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Float64Array( array ), itemSize );

};


// Deprecated

THREE.DynamicBufferAttribute = function ( array, itemSize ) {

	console.warn( 'THREE.DynamicBufferAttribute has been removed. Use new THREE.BufferAttribute().setDynamic( true ) instead.' );
	return new THREE.BufferAttribute( array, itemSize ).setDynamic( true );

};

// File:src/core/InstancedBufferAttribute.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InstancedBufferAttribute = function ( array, itemSize, meshPerAttribute ) {

	THREE.BufferAttribute.call( this, array, itemSize );

	this.meshPerAttribute = meshPerAttribute || 1;

};

THREE.InstancedBufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.InstancedBufferAttribute.prototype.constructor = THREE.InstancedBufferAttribute;

THREE.InstancedBufferAttribute.prototype.copy = function ( source ) {

	THREE.BufferAttribute.prototype.copy.call( this, source );

	this.meshPerAttribute = source.meshPerAttribute;

	return this;

};

// File:src/core/InterleavedBuffer.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InterleavedBuffer = function ( array, stride ) {

	this.uuid = THREE.Math.generateUUID();

	this.array = array;
	this.stride = stride;

	this.dynamic = false;
	this.updateRange = { offset: 0, count: - 1 };

	this.version = 0;

};

THREE.InterleavedBuffer.prototype = {

	constructor: THREE.InterleavedBuffer,

	get length () {

		return this.array.length;

	},

	get count () {

		return this.array.length / this.stride;

	},

	set needsUpdate( value ) {

		if ( value === true ) this.version ++;

	},

	setDynamic: function ( value ) {

		this.dynamic = value;

		return this;

	},

	copy: function ( source ) {

		this.array = new source.array.constructor( source.array );
		this.stride = source.stride;
		this.dynamic = source.dynamic;

		return this;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.stride;
		index2 *= attribute.stride;

		for ( var i = 0, l = this.stride; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	},

	set: function ( value, offset ) {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	}

};

// File:src/core/InstancedInterleavedBuffer.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InstancedInterleavedBuffer = function ( array, stride, meshPerAttribute ) {

	THREE.InterleavedBuffer.call( this, array, stride );

	this.meshPerAttribute = meshPerAttribute || 1;

};

THREE.InstancedInterleavedBuffer.prototype = Object.create( THREE.InterleavedBuffer.prototype );
THREE.InstancedInterleavedBuffer.prototype.constructor = THREE.InstancedInterleavedBuffer;

THREE.InstancedInterleavedBuffer.prototype.copy = function ( source ) {

	THREE.InterleavedBuffer.prototype.copy.call( this, source );

	this.meshPerAttribute = source.meshPerAttribute;

	return this;

};

// File:src/core/InterleavedBufferAttribute.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InterleavedBufferAttribute = function ( interleavedBuffer, itemSize, offset ) {

	this.uuid = THREE.Math.generateUUID();

	this.data = interleavedBuffer;
	this.itemSize = itemSize;
	this.offset = offset;

};


THREE.InterleavedBufferAttribute.prototype = {

	constructor: THREE.InterleavedBufferAttribute,

	get length() {

		console.warn( 'THREE.BufferAttribute: .length has been deprecated. Please use .count.' );
		return this.array.length;

	},

	get count() {

		return this.data.count;

	},

	setX: function ( index, x ) {

		this.data.array[ index * this.data.stride + this.offset ] = x;

		return this;

	},

	setY: function ( index, y ) {

		this.data.array[ index * this.data.stride + this.offset + 1 ] = y;

		return this;

	},

	setZ: function ( index, z ) {

		this.data.array[ index * this.data.stride + this.offset + 2 ] = z;

		return this;

	},

	setW: function ( index, w ) {

		this.data.array[ index * this.data.stride + this.offset + 3 ] = w;

		return this;

	},

	getX: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset ];

	},

	getY: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset + 1 ];

	},

	getZ: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset + 2 ];

	},

	getW: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset + 3 ];

	},

	setXY: function ( index, x, y ) {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;

		return this;

	},

	setXYZ: function ( index, x, y, z ) {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;
		this.data.array[ index + 2 ] = z;

		return this;

	},

	setXYZW: function ( index, x, y, z, w ) {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;
		this.data.array[ index + 2 ] = z;
		this.data.array[ index + 3 ] = w;

		return this;

	}

};

// File:src/core/Geometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author bhouston / http://clara.io
 */

THREE.Geometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Geometry';

	this.vertices = [];
	this.colors = [];
	this.faces = [];
	this.faceVertexUvs = [ [] ];

	this.morphTargets = [];
	this.morphNormals = [];

	this.skinWeights = [];
	this.skinIndices = [];

	this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	// update flags

	this.verticesNeedUpdate = false;
	this.elementsNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.lineDistancesNeedUpdate = false;
	this.groupsNeedUpdate = false;

};

Object.assign( THREE.Geometry.prototype, THREE.EventDispatcher.prototype, {

	applyMatrix: function ( matrix ) {

		var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		for ( var i = 0, il = this.vertices.length; i < il; i ++ ) {

			var vertex = this.vertices[ i ];
			vertex.applyMatrix4( matrix );

		}

		for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

			var face = this.faces[ i ];
			face.normal.applyMatrix3( normalMatrix ).normalize();

			for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

			}

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		this.verticesNeedUpdate = true;
		this.normalsNeedUpdate = true;

		return this;

	},

	rotateX: function () {

		// rotate geometry around world x-axis

		var m1;

		return function rotateX( angle ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeRotationX( angle );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	rotateY: function () {

		// rotate geometry around world y-axis

		var m1;

		return function rotateY( angle ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeRotationY( angle );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	rotateZ: function () {

		// rotate geometry around world z-axis

		var m1;

		return function rotateZ( angle ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeRotationZ( angle );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	translate: function () {

		// translate geometry

		var m1;

		return function translate( x, y, z ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeTranslation( x, y, z );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	scale: function () {

		// scale geometry

		var m1;

		return function scale( x, y, z ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeScale( x, y, z );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	lookAt: function () {

		var obj;

		return function lookAt( vector ) {

			if ( obj === undefined ) obj = new THREE.Object3D();

			obj.lookAt( vector );

			obj.updateMatrix();

			this.applyMatrix( obj.matrix );

		};

	}(),

	fromBufferGeometry: function ( geometry ) {

		var scope = this;

		var indices = geometry.index !== null ? geometry.index.array : undefined;
		var attributes = geometry.attributes;

		var positions = attributes.position.array;
		var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
		var colors = attributes.color !== undefined ? attributes.color.array : undefined;
		var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
		var uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;

		if ( uvs2 !== undefined ) this.faceVertexUvs[ 1 ] = [];

		var tempNormals = [];
		var tempUVs = [];
		var tempUVs2 = [];

		for ( var i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {

			scope.vertices.push( new THREE.Vector3( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] ) );

			if ( normals !== undefined ) {

				tempNormals.push( new THREE.Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );

			}

			if ( colors !== undefined ) {

				scope.colors.push( new THREE.Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );

			}

			if ( uvs !== undefined ) {

				tempUVs.push( new THREE.Vector2( uvs[ j ], uvs[ j + 1 ] ) );

			}

			if ( uvs2 !== undefined ) {

				tempUVs2.push( new THREE.Vector2( uvs2[ j ], uvs2[ j + 1 ] ) );

			}

		}

		function addFace( a, b, c, materialIndex ) {

			var vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
			var vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];

			var face = new THREE.Face3( a, b, c, vertexNormals, vertexColors, materialIndex );

			scope.faces.push( face );

			if ( uvs !== undefined ) {

				scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );

			}

			if ( uvs2 !== undefined ) {

				scope.faceVertexUvs[ 1 ].push( [ tempUVs2[ a ].clone(), tempUVs2[ b ].clone(), tempUVs2[ c ].clone() ] );

			}

		}

		if ( indices !== undefined ) {

			var groups = geometry.groups;

			if ( groups.length > 0 ) {

				for ( var i = 0; i < groups.length; i ++ ) {

					var group = groups[ i ];

					var start = group.start;
					var count = group.count;

					for ( var j = start, jl = start + count; j < jl; j += 3 ) {

						addFace( indices[ j ], indices[ j + 1 ], indices[ j + 2 ], group.materialIndex  );

					}

				}

			} else {

				for ( var i = 0; i < indices.length; i += 3 ) {

					addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

				}

			}

		} else {

			for ( var i = 0; i < positions.length / 3; i += 3 ) {

				addFace( i, i + 1, i + 2 );

			}

		}

		this.computeFaceNormals();

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		return this;

	},

	center: function () {

		this.computeBoundingBox();

		var offset = this.boundingBox.center().negate();

		this.translate( offset.x, offset.y, offset.z );

		return offset;

	},

	normalize: function () {

		this.computeBoundingSphere();

		var center = this.boundingSphere.center;
		var radius = this.boundingSphere.radius;

		var s = radius === 0 ? 1 : 1.0 / radius;

		var matrix = new THREE.Matrix4();
		matrix.set(
			s, 0, 0, - s * center.x,
			0, s, 0, - s * center.y,
			0, 0, s, - s * center.z,
			0, 0, 0, 1
		);

		this.applyMatrix( matrix );

		return this;

	},

	computeFaceNormals: function () {

		var cb = new THREE.Vector3(), ab = new THREE.Vector3();

		for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {

			var face = this.faces[ f ];

			var vA = this.vertices[ face.a ];
			var vB = this.vertices[ face.b ];
			var vC = this.vertices[ face.c ];

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			face.normal.copy( cb );

		}

	},

	computeVertexNormals: function ( areaWeighted ) {

		if ( areaWeighted === undefined ) areaWeighted = true;

		var v, vl, f, fl, face, vertices;

		vertices = new Array( this.vertices.length );

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ] = new THREE.Vector3();

		}

		if ( areaWeighted ) {

			// vertex normals weighted by triangle areas
			// http://www.iquilezles.org/www/articles/normals/normals.htm

			var vA, vB, vC;
			var cb = new THREE.Vector3(), ab = new THREE.Vector3();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vA = this.vertices[ face.a ];
				vB = this.vertices[ face.b ];
				vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				vertices[ face.a ].add( cb );
				vertices[ face.b ].add( cb );
				vertices[ face.c ].add( cb );

			}

		} else {

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vertices[ face.a ].add( face.normal );
				vertices[ face.b ].add( face.normal );
				vertices[ face.c ].add( face.normal );

			}

		}

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ].normalize();

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			var vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				vertexNormals[ 0 ].copy( vertices[ face.a ] );
				vertexNormals[ 1 ].copy( vertices[ face.b ] );
				vertexNormals[ 2 ].copy( vertices[ face.c ] );

			} else {

				vertexNormals[ 0 ] = vertices[ face.a ].clone();
				vertexNormals[ 1 ] = vertices[ face.b ].clone();
				vertexNormals[ 2 ] = vertices[ face.c ].clone();

			}

		}

		if ( this.faces.length > 0 ) {

			this.normalsNeedUpdate = true;

		}

	},

	computeMorphNormals: function () {

		var i, il, f, fl, face;

		// save original normals
		// - create temp variables on first access
		//   otherwise just copy (for faster repeated calls)

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( ! face.__originalFaceNormal ) {

				face.__originalFaceNormal = face.normal.clone();

			} else {

				face.__originalFaceNormal.copy( face.normal );

			}

			if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

			for ( i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

				if ( ! face.__originalVertexNormals[ i ] ) {

					face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

				} else {

					face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

				}

			}

		}

		// use temp geometry to compute face and vertex normals for each morph

		var tmpGeo = new THREE.Geometry();
		tmpGeo.faces = this.faces;

		for ( i = 0, il = this.morphTargets.length; i < il; i ++ ) {

			// create on first access

			if ( ! this.morphNormals[ i ] ) {

				this.morphNormals[ i ] = {};
				this.morphNormals[ i ].faceNormals = [];
				this.morphNormals[ i ].vertexNormals = [];

				var dstNormalsFace = this.morphNormals[ i ].faceNormals;
				var dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

				var faceNormal, vertexNormals;

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					faceNormal = new THREE.Vector3();
					vertexNormals = { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() };

					dstNormalsFace.push( faceNormal );
					dstNormalsVertex.push( vertexNormals );

				}

			}

			var morphNormals = this.morphNormals[ i ];

			// set vertices to morph target

			tmpGeo.vertices = this.morphTargets[ i ].vertices;

			// compute morph normals

			tmpGeo.computeFaceNormals();
			tmpGeo.computeVertexNormals();

			// store morph normals

			var faceNormal, vertexNormals;

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				faceNormal = morphNormals.faceNormals[ f ];
				vertexNormals = morphNormals.vertexNormals[ f ];

				faceNormal.copy( face.normal );

				vertexNormals.a.copy( face.vertexNormals[ 0 ] );
				vertexNormals.b.copy( face.vertexNormals[ 1 ] );
				vertexNormals.c.copy( face.vertexNormals[ 2 ] );

			}

		}

		// restore original normals

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			face.normal = face.__originalFaceNormal;
			face.vertexNormals = face.__originalVertexNormals;

		}

	},

	computeTangents: function () {

		console.warn( 'THREE.Geometry: .computeTangents() has been removed.' );

	},

	computeLineDistances: function () {

		var d = 0;
		var vertices = this.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			if ( i > 0 ) {

				d += vertices[ i ].distanceTo( vertices[ i - 1 ] );

			}

			this.lineDistances[ i ] = d;

		}

	},

	computeBoundingBox: function () {

		if ( this.boundingBox === null ) {

			this.boundingBox = new THREE.Box3();

		}

		this.boundingBox.setFromPoints( this.vertices );

	},

	computeBoundingSphere: function () {

		if ( this.boundingSphere === null ) {

			this.boundingSphere = new THREE.Sphere();

		}

		this.boundingSphere.setFromPoints( this.vertices );

	},

	merge: function ( geometry, matrix, materialIndexOffset ) {

		if ( geometry instanceof THREE.Geometry === false ) {

			console.error( 'THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry );
			return;

		}

		var normalMatrix,
		vertexOffset = this.vertices.length,
		vertices1 = this.vertices,
		vertices2 = geometry.vertices,
		faces1 = this.faces,
		faces2 = geometry.faces,
		uvs1 = this.faceVertexUvs[ 0 ],
		uvs2 = geometry.faceVertexUvs[ 0 ];

		if ( materialIndexOffset === undefined ) materialIndexOffset = 0;

		if ( matrix !== undefined ) {

			normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		}

		// vertices

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = vertex.clone();

			if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

			vertices1.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
			faceCopy.normal.copy( face.normal );

			if ( normalMatrix !== undefined ) {

				faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

			}

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( normalMatrix !== undefined ) {

					normal.applyMatrix3( normalMatrix ).normalize();

				}

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

			faces1.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			if ( uv === undefined ) {

				continue;

			}

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( uv[ j ].clone() );

			}

			uvs1.push( uvCopy );

		}

	},

	mergeMesh: function ( mesh ) {

		if ( mesh instanceof THREE.Mesh === false ) {

			console.error( 'THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.', mesh );
			return;

		}

		mesh.matrixAutoUpdate && mesh.updateMatrix();

		this.merge( mesh.geometry, mesh.matrix );

	},

	/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */

	mergeVertices: function () {

		var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
		var unique = [], changes = [];

		var v, key;
		var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
		var precision = Math.pow( 10, precisionPoints );
		var i, il, face;
		var indices, j, jl;

		for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

			v = this.vertices[ i ];
			key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		}


		// if faces are completely degenerate after merging vertices, we
		// have to remove them from the geometry.
		var faceIndicesToRemove = [];

		for ( i = 0, il = this.faces.length; i < il; i ++ ) {

			face = this.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];

			indices = [ face.a, face.b, face.c ];

			var dupIndex = - 1;

			// if any duplicate vertices are found in a Face3
			// we have to remove the face as nothing can be saved
			for ( var n = 0; n < 3; n ++ ) {

				if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

					dupIndex = n;
					faceIndicesToRemove.push( i );
					break;

				}

			}

		}

		for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

			var idx = faceIndicesToRemove[ i ];

			this.faces.splice( idx, 1 );

			for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

				this.faceVertexUvs[ j ].splice( idx, 1 );

			}

		}

		// Use unique set of vertices

		var diff = this.vertices.length - unique.length;
		this.vertices = unique;
		return diff;

	},

	sortFacesByMaterialIndex: function () {

		var faces = this.faces;
		var length = faces.length;

		// tag faces

		for ( var i = 0; i < length; i ++ ) {

			faces[ i ]._id = i;

		}

		// sort faces

		function materialIndexSort( a, b ) {

			return a.materialIndex - b.materialIndex;

		}

		faces.sort( materialIndexSort );

		// sort uvs

		var uvs1 = this.faceVertexUvs[ 0 ];
		var uvs2 = this.faceVertexUvs[ 1 ];

		var newUvs1, newUvs2;

		if ( uvs1 && uvs1.length === length ) newUvs1 = [];
		if ( uvs2 && uvs2.length === length ) newUvs2 = [];

		for ( var i = 0; i < length; i ++ ) {

			var id = faces[ i ]._id;

			if ( newUvs1 ) newUvs1.push( uvs1[ id ] );
			if ( newUvs2 ) newUvs2.push( uvs2[ id ] );

		}

		if ( newUvs1 ) this.faceVertexUvs[ 0 ] = newUvs1;
		if ( newUvs2 ) this.faceVertexUvs[ 1 ] = newUvs2;

	},

	toJSON: function () {

		var data = {
			metadata: {
				version: 4.4,
				type: 'Geometry',
				generator: 'Geometry.toJSON'
			}
		};

		// standard Geometry serialization

		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( this.parameters !== undefined ) {

			var parameters = this.parameters;

			for ( var key in parameters ) {

				if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

			}

			return data;

		}

		var vertices = [];

		for ( var i = 0; i < this.vertices.length; i ++ ) {

			var vertex = this.vertices[ i ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

		var faces = [];
		var normals = [];
		var normalsHash = {};
		var colors = [];
		var colorsHash = {};
		var uvs = [];
		var uvsHash = {};

		for ( var i = 0; i < this.faces.length; i ++ ) {

			var face = this.faces[ i ];

			var hasMaterial = true;
			var hasFaceUv = false; // deprecated
			var hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
			var hasFaceNormal = face.normal.length() > 0;
			var hasFaceVertexNormal = face.vertexNormals.length > 0;
			var hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
			var hasFaceVertexColor = face.vertexColors.length > 0;

			var faceType = 0;

			faceType = setBit( faceType, 0, 0 ); // isQuad
			faceType = setBit( faceType, 1, hasMaterial );
			faceType = setBit( faceType, 2, hasFaceUv );
			faceType = setBit( faceType, 3, hasFaceVertexUv );
			faceType = setBit( faceType, 4, hasFaceNormal );
			faceType = setBit( faceType, 5, hasFaceVertexNormal );
			faceType = setBit( faceType, 6, hasFaceColor );
			faceType = setBit( faceType, 7, hasFaceVertexColor );

			faces.push( faceType );
			faces.push( face.a, face.b, face.c );
			faces.push( face.materialIndex );

			if ( hasFaceVertexUv ) {

				var faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

				faces.push(
					getUvIndex( faceVertexUvs[ 0 ] ),
					getUvIndex( faceVertexUvs[ 1 ] ),
					getUvIndex( faceVertexUvs[ 2 ] )
				);

			}

			if ( hasFaceNormal ) {

				faces.push( getNormalIndex( face.normal ) );

			}

			if ( hasFaceVertexNormal ) {

				var vertexNormals = face.vertexNormals;

				faces.push(
					getNormalIndex( vertexNormals[ 0 ] ),
					getNormalIndex( vertexNormals[ 1 ] ),
					getNormalIndex( vertexNormals[ 2 ] )
				);

			}

			if ( hasFaceColor ) {

				faces.push( getColorIndex( face.color ) );

			}

			if ( hasFaceVertexColor ) {

				var vertexColors = face.vertexColors;

				faces.push(
					getColorIndex( vertexColors[ 0 ] ),
					getColorIndex( vertexColors[ 1 ] ),
					getColorIndex( vertexColors[ 2 ] )
				);

			}

		}

		function setBit( value, position, enabled ) {

			return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position ) );

		}

		function getNormalIndex( normal ) {

			var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

			if ( normalsHash[ hash ] !== undefined ) {

				return normalsHash[ hash ];

			}

			normalsHash[ hash ] = normals.length / 3;
			normals.push( normal.x, normal.y, normal.z );

			return normalsHash[ hash ];

		}

		function getColorIndex( color ) {

			var hash = color.r.toString() + color.g.toString() + color.b.toString();

			if ( colorsHash[ hash ] !== undefined ) {

				return colorsHash[ hash ];

			}

			colorsHash[ hash ] = colors.length;
			colors.push( color.getHex() );

			return colorsHash[ hash ];

		}

		function getUvIndex( uv ) {

			var hash = uv.x.toString() + uv.y.toString();

			if ( uvsHash[ hash ] !== undefined ) {

				return uvsHash[ hash ];

			}

			uvsHash[ hash ] = uvs.length / 2;
			uvs.push( uv.x, uv.y );

			return uvsHash[ hash ];

		}

		data.data = {};

		data.data.vertices = vertices;
		data.data.normals = normals;
		if ( colors.length > 0 ) data.data.colors = colors;
		if ( uvs.length > 0 ) data.data.uvs = [ uvs ]; // temporal backward compatibility
		data.data.faces = faces;

		return data;

	},

	clone: function () {

		/*
		// Handle primitives

		var parameters = this.parameters;

		if ( parameters !== undefined ) {

			var values = [];

			for ( var key in parameters ) {

				values.push( parameters[ key ] );

			}

			var geometry = Object.create( this.constructor.prototype );
			this.constructor.apply( geometry, values );
			return geometry;

		}

		return new this.constructor().copy( this );
		*/

		return new THREE.Geometry().copy( this );

	},

	copy: function ( source ) {

		this.vertices = [];
		this.faces = [];
		this.faceVertexUvs = [ [] ];

		var vertices = source.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			this.vertices.push( vertices[ i ].clone() );

		}

		var faces = source.faces;

		for ( var i = 0, il = faces.length; i < il; i ++ ) {

			this.faces.push( faces[ i ].clone() );

		}

		for ( var i = 0, il = source.faceVertexUvs.length; i < il; i ++ ) {

			var faceVertexUvs = source.faceVertexUvs[ i ];

			if ( this.faceVertexUvs[ i ] === undefined ) {

				this.faceVertexUvs[ i ] = [];

			}

			for ( var j = 0, jl = faceVertexUvs.length; j < jl; j ++ ) {

				var uvs = faceVertexUvs[ j ], uvsCopy = [];

				for ( var k = 0, kl = uvs.length; k < kl; k ++ ) {

					var uv = uvs[ k ];

					uvsCopy.push( uv.clone() );

				}

				this.faceVertexUvs[ i ].push( uvsCopy );

			}

		}

		return this;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

} );

THREE.GeometryIdCount = 0;

// File:src/core/DirectGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.DirectGeometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'DirectGeometry';

	this.indices = [];
	this.vertices = [];
	this.normals = [];
	this.colors = [];
	this.uvs = [];
	this.uvs2 = [];

	this.groups = [];

	this.morphTargets = {};

	this.skinWeights = [];
	this.skinIndices = [];

	// this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	// update flags

	this.verticesNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.groupsNeedUpdate = false;

};

Object.assign( THREE.DirectGeometry.prototype, THREE.EventDispatcher.prototype, {

	computeBoundingBox: THREE.Geometry.prototype.computeBoundingBox,
	computeBoundingSphere: THREE.Geometry.prototype.computeBoundingSphere,

	computeFaceNormals: function () {

		console.warn( 'THREE.DirectGeometry: computeFaceNormals() is not a method of this type of geometry.' );

	},

	computeVertexNormals: function () {

		console.warn( 'THREE.DirectGeometry: computeVertexNormals() is not a method of this type of geometry.' );

	},

	computeGroups: function ( geometry ) {

		var group;
		var groups = [];
		var materialIndex;

		var faces = geometry.faces;

		for ( var i = 0; i < faces.length; i ++ ) {

			var face = faces[ i ];

			// materials

			if ( face.materialIndex !== materialIndex ) {

				materialIndex = face.materialIndex;

				if ( group !== undefined ) {

					group.count = ( i * 3 ) - group.start;
					groups.push( group );

				}

				group = {
					start: i * 3,
					materialIndex: materialIndex
				};

			}

		}

		if ( group !== undefined ) {

			group.count = ( i * 3 ) - group.start;
			groups.push( group );

		}

		this.groups = groups;

	},

	fromGeometry: function ( geometry ) {

		var faces = geometry.faces;
		var vertices = geometry.vertices;
		var faceVertexUvs = geometry.faceVertexUvs;

		var hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
		var hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;

		// morphs

		var morphTargets = geometry.morphTargets;
		var morphTargetsLength = morphTargets.length;

		var morphTargetsPosition;

		if ( morphTargetsLength > 0 ) {

			morphTargetsPosition = [];

			for ( var i = 0; i < morphTargetsLength; i ++ ) {

				morphTargetsPosition[ i ] = [];

			}

			this.morphTargets.position = morphTargetsPosition;

		}

		var morphNormals = geometry.morphNormals;
		var morphNormalsLength = morphNormals.length;

		var morphTargetsNormal;

		if ( morphNormalsLength > 0 ) {

			morphTargetsNormal = [];

			for ( var i = 0; i < morphNormalsLength; i ++ ) {

				morphTargetsNormal[ i ] = [];

			}

			this.morphTargets.normal = morphTargetsNormal;

		}

		// skins

		var skinIndices = geometry.skinIndices;
		var skinWeights = geometry.skinWeights;

		var hasSkinIndices = skinIndices.length === vertices.length;
		var hasSkinWeights = skinWeights.length === vertices.length;

		//

		for ( var i = 0; i < faces.length; i ++ ) {

			var face = faces[ i ];

			this.vertices.push( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );

			var vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				this.normals.push( vertexNormals[ 0 ], vertexNormals[ 1 ], vertexNormals[ 2 ] );

			} else {

				var normal = face.normal;

				this.normals.push( normal, normal, normal );

			}

			var vertexColors = face.vertexColors;

			if ( vertexColors.length === 3 ) {

				this.colors.push( vertexColors[ 0 ], vertexColors[ 1 ], vertexColors[ 2 ] );

			} else {

				var color = face.color;

				this.colors.push( color, color, color );

			}

			if ( hasFaceVertexUv === true ) {

				var vertexUvs = faceVertexUvs[ 0 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ', i );

					this.uvs.push( new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() );

				}

			}

			if ( hasFaceVertexUv2 === true ) {

				var vertexUvs = faceVertexUvs[ 1 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs2.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i );

					this.uvs2.push( new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() );

				}

			}

			// morphs

			for ( var j = 0; j < morphTargetsLength; j ++ ) {

				var morphTarget = morphTargets[ j ].vertices;

				morphTargetsPosition[ j ].push( morphTarget[ face.a ], morphTarget[ face.b ], morphTarget[ face.c ] );

			}

			for ( var j = 0; j < morphNormalsLength; j ++ ) {

				var morphNormal = morphNormals[ j ].vertexNormals[ i ];

				morphTargetsNormal[ j ].push( morphNormal.a, morphNormal.b, morphNormal.c );

			}

			// skins

			if ( hasSkinIndices ) {

				this.skinIndices.push( skinIndices[ face.a ], skinIndices[ face.b ], skinIndices[ face.c ] );

			}

			if ( hasSkinWeights ) {

				this.skinWeights.push( skinWeights[ face.a ], skinWeights[ face.b ], skinWeights[ face.c ] );

			}

		}

		this.computeGroups( geometry );

		this.verticesNeedUpdate = geometry.verticesNeedUpdate;
		this.normalsNeedUpdate = geometry.normalsNeedUpdate;
		this.colorsNeedUpdate = geometry.colorsNeedUpdate;
		this.uvsNeedUpdate = geometry.uvsNeedUpdate;
		this.groupsNeedUpdate = geometry.groupsNeedUpdate;

		return this;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

} );

// File:src/core/BufferGeometry.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'BufferGeometry';

	this.index = null;
	this.attributes = {};

	this.morphAttributes = {};

	this.groups = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	this.drawRange = { start: 0, count: Infinity };

};

Object.assign( THREE.BufferGeometry.prototype, THREE.EventDispatcher.prototype, {

	getIndex: function () {

		return this.index;

	},

	setIndex: function ( index ) {

		this.index = index;

	},

	addAttribute: function ( name, attribute ) {

		if ( attribute instanceof THREE.BufferAttribute === false && attribute instanceof THREE.InterleavedBufferAttribute === false ) {

			console.warn( 'THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

			this.addAttribute( name, new THREE.BufferAttribute( arguments[ 1 ], arguments[ 2 ] ) );

			return;

		}

		if ( name === 'index' ) {

			console.warn( 'THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.' );
			this.setIndex( attribute );

			return;

		}

		this.attributes[ name ] = attribute;

		return this;

	},

	getAttribute: function ( name ) {

		return this.attributes[ name ];

	},

	removeAttribute: function ( name ) {

		delete this.attributes[ name ];

		return this;

	},

	addGroup: function ( start, count, materialIndex ) {

		this.groups.push( {

			start: start,
			count: count,
			materialIndex: materialIndex !== undefined ? materialIndex : 0

		} );

	},

	clearGroups: function () {

		this.groups = [];

	},

	setDrawRange: function ( start, count ) {

		this.drawRange.start = start;
		this.drawRange.count = count;

	},

	applyMatrix: function ( matrix ) {

		var position = this.attributes.position;

		if ( position !== undefined ) {

			matrix.applyToVector3Array( position.array );
			position.needsUpdate = true;

		}

		var normal = this.attributes.normal;

		if ( normal !== undefined ) {

			var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

			normalMatrix.applyToVector3Array( normal.array );
			normal.needsUpdate = true;

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		return this;

	},

	rotateX: function () {

		// rotate geometry around world x-axis

		var m1;

		return function rotateX( angle ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeRotationX( angle );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	rotateY: function () {

		// rotate geometry around world y-axis

		var m1;

		return function rotateY( angle ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeRotationY( angle );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	rotateZ: function () {

		// rotate geometry around world z-axis

		var m1;

		return function rotateZ( angle ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeRotationZ( angle );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	translate: function () {

		// translate geometry

		var m1;

		return function translate( x, y, z ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeTranslation( x, y, z );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	scale: function () {

		// scale geometry

		var m1;

		return function scale( x, y, z ) {

			if ( m1 === undefined ) m1 = new THREE.Matrix4();

			m1.makeScale( x, y, z );

			this.applyMatrix( m1 );

			return this;

		};

	}(),

	lookAt: function () {

		var obj;

		return function lookAt( vector ) {

			if ( obj === undefined ) obj = new THREE.Object3D();

			obj.lookAt( vector );

			obj.updateMatrix();

			this.applyMatrix( obj.matrix );

		};

	}(),

	center: function () {

		this.computeBoundingBox();

		var offset = this.boundingBox.center().negate();

		this.translate( offset.x, offset.y, offset.z );

		return offset;

	},

	setFromObject: function ( object ) {

		// console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );

		var geometry = object.geometry;

		if ( object instanceof THREE.Points || object instanceof THREE.Line ) {

			var positions = new THREE.Float32Attribute( geometry.vertices.length * 3, 3 );
			var colors = new THREE.Float32Attribute( geometry.colors.length * 3, 3 );

			this.addAttribute( 'position', positions.copyVector3sArray( geometry.vertices ) );
			this.addAttribute( 'color', colors.copyColorsArray( geometry.colors ) );

			if ( geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length ) {

				var lineDistances = new THREE.Float32Attribute( geometry.lineDistances.length, 1 );

				this.addAttribute( 'lineDistance', lineDistances.copyArray( geometry.lineDistances ) );

			}

			if ( geometry.boundingSphere !== null ) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			if ( geometry.boundingBox !== null ) {

				this.boundingBox = geometry.boundingBox.clone();

			}

		} else if ( object instanceof THREE.Mesh ) {

			if ( geometry instanceof THREE.Geometry ) {

				this.fromGeometry( geometry );

			}

		}

		return this;

	},

	updateFromObject: function ( object ) {

		var geometry = object.geometry;

		if ( object instanceof THREE.Mesh ) {

			var direct = geometry.__directGeometry;

			if ( direct === undefined ) {

				return this.fromGeometry( geometry );

			}

			direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
			direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
			direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
			direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
			direct.groupsNeedUpdate = geometry.groupsNeedUpdate;

			geometry.verticesNeedUpdate = false;
			geometry.normalsNeedUpdate = false;
			geometry.colorsNeedUpdate = false;
			geometry.uvsNeedUpdate = false;
			geometry.groupsNeedUpdate = false;

			geometry = direct;

		}

		if ( geometry.verticesNeedUpdate === true ) {

			var attribute = this.attributes.position;

			if ( attribute !== undefined ) {

				attribute.copyVector3sArray( geometry.vertices );
				attribute.needsUpdate = true;

			}

			geometry.verticesNeedUpdate = false;

		}

		if ( geometry.normalsNeedUpdate === true ) {

			var attribute = this.attributes.normal;

			if ( attribute !== undefined ) {

				attribute.copyVector3sArray( geometry.normals );
				attribute.needsUpdate = true;

			}

			geometry.normalsNeedUpdate = false;

		}

		if ( geometry.colorsNeedUpdate === true ) {

			var attribute = this.attributes.color;

			if ( attribute !== undefined ) {

				attribute.copyColorsArray( geometry.colors );
				attribute.needsUpdate = true;

			}

			geometry.colorsNeedUpdate = false;

		}

		if ( geometry.uvsNeedUpdate ) {

			var attribute = this.attributes.uv;

			if ( attribute !== undefined ) {

				attribute.copyVector2sArray( geometry.uvs );
				attribute.needsUpdate = true;

			}

			geometry.uvsNeedUpdate = false;

		}

		if ( geometry.lineDistancesNeedUpdate ) {

			var attribute = this.attributes.lineDistance;

			if ( attribute !== undefined ) {

				attribute.copyArray( geometry.lineDistances );
				attribute.needsUpdate = true;

			}

			geometry.lineDistancesNeedUpdate = false;

		}

		if ( geometry.groupsNeedUpdate ) {

			geometry.computeGroups( object.geometry );
			this.groups = geometry.groups;

			geometry.groupsNeedUpdate = false;

		}

		return this;

	},

	fromGeometry: function ( geometry ) {

		geometry.__directGeometry = new THREE.DirectGeometry().fromGeometry( geometry );

		return this.fromDirectGeometry( geometry.__directGeometry );

	},

	fromDirectGeometry: function ( geometry ) {

		var positions = new Float32Array( geometry.vertices.length * 3 );
		this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).copyVector3sArray( geometry.vertices ) );

		if ( geometry.normals.length > 0 ) {

			var normals = new Float32Array( geometry.normals.length * 3 );
			this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ).copyVector3sArray( geometry.normals ) );

		}

		if ( geometry.colors.length > 0 ) {

			var colors = new Float32Array( geometry.colors.length * 3 );
			this.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).copyColorsArray( geometry.colors ) );

		}

		if ( geometry.uvs.length > 0 ) {

			var uvs = new Float32Array( geometry.uvs.length * 2 );
			this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ).copyVector2sArray( geometry.uvs ) );

		}

		if ( geometry.uvs2.length > 0 ) {

			var uvs2 = new Float32Array( geometry.uvs2.length * 2 );
			this.addAttribute( 'uv2', new THREE.BufferAttribute( uvs2, 2 ).copyVector2sArray( geometry.uvs2 ) );

		}

		if ( geometry.indices.length > 0 ) {

			var TypeArray = geometry.vertices.length > 65535 ? Uint32Array : Uint16Array;
			var indices = new TypeArray( geometry.indices.length * 3 );
			this.setIndex( new THREE.BufferAttribute( indices, 1 ).copyIndicesArray( geometry.indices ) );

		}

		// groups

		this.groups = geometry.groups;

		// morphs

		for ( var name in geometry.morphTargets ) {

			var array = [];
			var morphTargets = geometry.morphTargets[ name ];

			for ( var i = 0, l = morphTargets.length; i < l; i ++ ) {

				var morphTarget = morphTargets[ i ];

				var attribute = new THREE.Float32Attribute( morphTarget.length * 3, 3 );

				array.push( attribute.copyVector3sArray( morphTarget ) );

			}

			this.morphAttributes[ name ] = array;

		}

		// skinning

		if ( geometry.skinIndices.length > 0 ) {

			var skinIndices = new THREE.Float32Attribute( geometry.skinIndices.length * 4, 4 );
			this.addAttribute( 'skinIndex', skinIndices.copyVector4sArray( geometry.skinIndices ) );

		}

		if ( geometry.skinWeights.length > 0 ) {

			var skinWeights = new THREE.Float32Attribute( geometry.skinWeights.length * 4, 4 );
			this.addAttribute( 'skinWeight', skinWeights.copyVector4sArray( geometry.skinWeights ) );

		}

		//

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		return this;

	},

	computeBoundingBox: function () {

		if ( this.boundingBox === null ) {

			this.boundingBox = new THREE.Box3();

		}

		var positions = this.attributes.position.array;

		if ( positions !== undefined ) {

			this.boundingBox.setFromArray( positions );

		} else {

			this.boundingBox.makeEmpty();

		}

		if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

			console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

		}

	},

	computeBoundingSphere: function () {

		var box = new THREE.Box3();
		var vector = new THREE.Vector3();

		return function computeBoundingSphere() {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new THREE.Sphere();

			}

			var positions = this.attributes.position.array;

			if ( positions ) {

				var center = this.boundingSphere.center;

				box.setFromArray( positions );
				box.center( center );

				// hoping to find a boundingSphere with a radius smaller than the
				// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

				var maxRadiusSq = 0;

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.fromArray( positions, i );
					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

				}

				this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

				if ( isNaN( this.boundingSphere.radius ) ) {

					console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

				}

			}

		};

	}(),

	computeFaceNormals: function () {

		// backwards compatibility

	},

	computeVertexNormals: function () {

		var index = this.index;
		var attributes = this.attributes;
		var groups = this.groups;

		if ( attributes.position ) {

			var positions = attributes.position.array;

			if ( attributes.normal === undefined ) {

				this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( positions.length ), 3 ) );

			} else {

				// reset existing normals to zero

				var array = attributes.normal.array;

				for ( var i = 0, il = array.length; i < il; i ++ ) {

					array[ i ] = 0;

				}

			}

			var normals = attributes.normal.array;

			var vA, vB, vC,

			pA = new THREE.Vector3(),
			pB = new THREE.Vector3(),
			pC = new THREE.Vector3(),

			cb = new THREE.Vector3(),
			ab = new THREE.Vector3();

			// indexed elements

			if ( index ) {

				var indices = index.array;

				if ( groups.length === 0 ) {

					this.addGroup( 0, indices.length );

				}

				for ( var j = 0, jl = groups.length; j < jl; ++ j ) {

					var group = groups[ j ];

					var start = group.start;
					var count = group.count;

					for ( var i = start, il = start + count; i < il; i += 3 ) {

						vA = indices[ i + 0 ] * 3;
						vB = indices[ i + 1 ] * 3;
						vC = indices[ i + 2 ] * 3;

						pA.fromArray( positions, vA );
						pB.fromArray( positions, vB );
						pC.fromArray( positions, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normals[ vA ] += cb.x;
						normals[ vA + 1 ] += cb.y;
						normals[ vA + 2 ] += cb.z;

						normals[ vB ] += cb.x;
						normals[ vB + 1 ] += cb.y;
						normals[ vB + 2 ] += cb.z;

						normals[ vC ] += cb.x;
						normals[ vC + 1 ] += cb.y;
						normals[ vC + 2 ] += cb.z;

					}

				}

			} else {

				// non-indexed elements (unconnected triangle soup)

				for ( var i = 0, il = positions.length; i < il; i += 9 ) {

					pA.fromArray( positions, i );
					pB.fromArray( positions, i + 3 );
					pC.fromArray( positions, i + 6 );

					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
					cb.cross( ab );

					normals[ i ] = cb.x;
					normals[ i + 1 ] = cb.y;
					normals[ i + 2 ] = cb.z;

					normals[ i + 3 ] = cb.x;
					normals[ i + 4 ] = cb.y;
					normals[ i + 5 ] = cb.z;

					normals[ i + 6 ] = cb.x;
					normals[ i + 7 ] = cb.y;
					normals[ i + 8 ] = cb.z;

				}

			}

			this.normalizeNormals();

			attributes.normal.needsUpdate = true;

		}

	},

	merge: function ( geometry, offset ) {

		if ( geometry instanceof THREE.BufferGeometry === false ) {

			console.error( 'THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry );
			return;

		}

		if ( offset === undefined ) offset = 0;

		var attributes = this.attributes;

		for ( var key in attributes ) {

			if ( geometry.attributes[ key ] === undefined ) continue;

			var attribute1 = attributes[ key ];
			var attributeArray1 = attribute1.array;

			var attribute2 = geometry.attributes[ key ];
			var attributeArray2 = attribute2.array;

			var attributeSize = attribute2.itemSize;

			for ( var i = 0, j = attributeSize * offset; i < attributeArray2.length; i ++, j ++ ) {

				attributeArray1[ j ] = attributeArray2[ i ];

			}

		}

		return this;

	},

	normalizeNormals: function () {

		var normals = this.attributes.normal.array;

		var x, y, z, n;

		for ( var i = 0, il = normals.length; i < il; i += 3 ) {

			x = normals[ i ];
			y = normals[ i + 1 ];
			z = normals[ i + 2 ];

			n = 1.0 / Math.sqrt( x * x + y * y + z * z );

			normals[ i ] *= n;
			normals[ i + 1 ] *= n;
			normals[ i + 2 ] *= n;

		}

	},

	toNonIndexed: function () {

		if ( this.index === null ) {

			console.warn( 'THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.' );
			return this;

		}

		var geometry2 = new THREE.BufferGeometry();

		var indices = this.index.array;
		var attributes = this.attributes;

		for ( var name in attributes ) {

			var attribute = attributes[ name ];

			var array = attribute.array;
			var itemSize = attribute.itemSize;

			var array2 = new array.constructor( indices.length * itemSize );

			var index = 0, index2 = 0;

			for ( var i = 0, l = indices.length; i < l; i ++ ) {

				index = indices[ i ] * itemSize;

				for ( var j = 0; j < itemSize; j ++ ) {

					array2[ index2 ++ ] = array[ index ++ ];

				}

			}

			geometry2.addAttribute( name, new THREE.BufferAttribute( array2, itemSize ) );

		}

		return geometry2;

	},

	toJSON: function () {

		var data = {
			metadata: {
				version: 4.4,
				type: 'BufferGeometry',
				generator: 'BufferGeometry.toJSON'
			}
		};

		// standard BufferGeometry serialization

		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( this.parameters !== undefined ) {

			var parameters = this.parameters;

			for ( var key in parameters ) {

				if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

			}

			return data;

		}

		data.data = { attributes: {} };

		var index = this.index;

		if ( index !== null ) {

			var array = Array.prototype.slice.call( index.array );

			data.data.index = {
				type: index.array.constructor.name,
				array: array
			};

		}

		var attributes = this.attributes;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];

			var array = Array.prototype.slice.call( attribute.array );

			data.data.attributes[ key ] = {
				itemSize: attribute.itemSize,
				type: attribute.array.constructor.name,
				array: array,
				normalized: attribute.normalized
			};

		}

		var groups = this.groups;

		if ( groups.length > 0 ) {

			data.data.groups = JSON.parse( JSON.stringify( groups ) );

		}

		var boundingSphere = this.boundingSphere;

		if ( boundingSphere !== null ) {

			data.data.boundingSphere = {
				center: boundingSphere.center.toArray(),
				radius: boundingSphere.radius
			};

		}

		return data;

	},

	clone: function () {

		/*
		// Handle primitives

		var parameters = this.parameters;

		if ( parameters !== undefined ) {

			var values = [];

			for ( var key in parameters ) {

				values.push( parameters[ key ] );

			}

			var geometry = Object.create( this.constructor.prototype );
			this.constructor.apply( geometry, values );
			return geometry;

		}

		return new this.constructor().copy( this );
		*/

		return new THREE.BufferGeometry().copy( this );

	},

	copy: function ( source ) {

		var index = source.index;

		if ( index !== null ) {

			this.setIndex( index.clone() );

		}

		var attributes = source.attributes;

		for ( var name in attributes ) {

			var attribute = attributes[ name ];
			this.addAttribute( name, attribute.clone() );

		}

		var groups = source.groups;

		for ( var i = 0, l = groups.length; i < l; i ++ ) {

			var group = groups[ i ];
			this.addGroup( group.start, group.count, group.materialIndex );

		}

		return this;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

} );

THREE.BufferGeometry.MaxIndex = 65535;

// File:src/core/InstancedBufferGeometry.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InstancedBufferGeometry = function () {

	THREE.BufferGeometry.call( this );

	this.type = 'InstancedBufferGeometry';
	this.maxInstancedCount = undefined;

};

THREE.InstancedBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.InstancedBufferGeometry.prototype.constructor = THREE.InstancedBufferGeometry;

THREE.InstancedBufferGeometry.prototype.addGroup = function ( start, count, instances ) {

	this.groups.push( {

		start: start,
		count: count,
		instances: instances

	} );

};

THREE.InstancedBufferGeometry.prototype.copy = function ( source ) {

	var index = source.index;

	if ( index !== null ) {

		this.setIndex( index.clone() );

	}

	var attributes = source.attributes;

	for ( var name in attributes ) {

		var attribute = attributes[ name ];
		this.addAttribute( name, attribute.clone() );

	}

	var groups = source.groups;

	for ( var i = 0, l = groups.length; i < l; i ++ ) {

		var group = groups[ i ];
		this.addGroup( group.start, group.count, group.instances );

	}

	return this;

};

// File:src/core/Uniform.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Uniform = function ( value ) {

	if ( typeof value === 'string' ) {

		console.warn( 'THREE.Uniform: Type parameter is no longer needed.' );
		value = arguments[ 1 ];

	}

	this.value = value;

	this.dynamic = false;

};

THREE.Uniform.prototype = {

	constructor: THREE.Uniform,

	onUpdate: function ( callback ) {

		this.dynamic = true;
		this.onUpdateCallback = callback;

		return this;

	}

};

// File:src/animation/AnimationAction.js

/**
 *
 * Action provided by AnimationMixer for scheduling clip playback on specific
 * objects.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 *
 */

THREE.AnimationAction = function() {

	throw new Error( "THREE.AnimationAction: " +
			"Use mixer.clipAction for construction." );

};

THREE.AnimationAction._new =
		function AnimationAction( mixer, clip, localRoot ) {

	this._mixer = mixer;
	this._clip = clip;
	this._localRoot = localRoot || null;

	var tracks = clip.tracks,
		nTracks = tracks.length,
		interpolants = new Array( nTracks );

	var interpolantSettings = {
			endingStart: 	THREE.ZeroCurvatureEnding,
			endingEnd:		THREE.ZeroCurvatureEnding
	};

	for ( var i = 0; i !== nTracks; ++ i ) {

		var interpolant = tracks[ i ].createInterpolant( null );
		interpolants[ i ] = interpolant;
		interpolant.settings = interpolantSettings;

	}

	this._interpolantSettings = interpolantSettings;

	this._interpolants = interpolants;	// bound by the mixer

	// inside: PropertyMixer (managed by the mixer)
	this._propertyBindings = new Array( nTracks );

	this._cacheIndex = null;			// for the memory manager
	this._byClipCacheIndex = null;		// for the memory manager

	this._timeScaleInterpolant = null;
	this._weightInterpolant = null;

	this.loop = THREE.LoopRepeat;
	this._loopCount = -1;

	// global mixer time when the action is to be started
	// it's set back to 'null' upon start of the action
	this._startTime = null;

	// scaled local time of the action
	// gets clamped or wrapped to 0..clip.duration according to loop
	this.time = 0;

	this.timeScale = 1;
	this._effectiveTimeScale = 1;

	this.weight = 1;
	this._effectiveWeight = 1;

	this.repetitions = Infinity; 		// no. of repetitions when looping

	this.paused = false;				// false -> zero effective time scale
	this.enabled = true;				// true -> zero effective weight

	this.clampWhenFinished 	= false;	// keep feeding the last frame?

	this.zeroSlopeAtStart 	= true;		// for smooth interpolation w/o separate
	this.zeroSlopeAtEnd		= true;		// clips for start, loop and end

};

THREE.AnimationAction._new.prototype = {

	constructor: THREE.AnimationAction._new,

	// State & Scheduling

	play: function() {

		this._mixer._activateAction( this );

		return this;

	},

	stop: function() {

		this._mixer._deactivateAction( this );

		return this.reset();

	},

	reset: function() {

		this.paused = false;
		this.enabled = true;

		this.time = 0;			// restart clip
		this._loopCount = -1;	// forget previous loops
		this._startTime = null;	// forget scheduling

		return this.stopFading().stopWarping();

	},

	isRunning: function() {

		var start = this._startTime;

		return this.enabled && ! this.paused && this.timeScale !== 0 &&
				this._startTime === null && this._mixer._isActiveAction( this );

	},

	// return true when play has been called
	isScheduled: function() {

		return this._mixer._isActiveAction( this );

	},

	startAt: function( time ) {

		this._startTime = time;

		return this;

	},

	setLoop: function( mode, repetitions ) {

		this.loop = mode;
		this.repetitions = repetitions;

		return this;

	},

	// Weight

	// set the weight stopping any scheduled fading
	// although .enabled = false yields an effective weight of zero, this
	// method does *not* change .enabled, because it would be confusing
	setEffectiveWeight: function( weight ) {

		this.weight = weight;

		// note: same logic as when updated at runtime
		this._effectiveWeight = this.enabled ? weight : 0;

		return this.stopFading();

	},

	// return the weight considering fading and .enabled
	getEffectiveWeight: function() {

		return this._effectiveWeight;

	},

	fadeIn: function( duration ) {

		return this._scheduleFading( duration, 0, 1 );

	},

	fadeOut: function( duration ) {

		return this._scheduleFading( duration, 1, 0 );

	},

	crossFadeFrom: function( fadeOutAction, duration, warp ) {

		var mixer = this._mixer;

		fadeOutAction.fadeOut( duration );
		this.fadeIn( duration );

		if( warp ) {

			var fadeInDuration = this._clip.duration,
				fadeOutDuration = fadeOutAction._clip.duration,

				startEndRatio = fadeOutDuration / fadeInDuration,
				endStartRatio = fadeInDuration / fadeOutDuration;

			fadeOutAction.warp( 1.0, startEndRatio, duration );
			this.warp( endStartRatio, 1.0, duration );

		}

		return this;

	},

	crossFadeTo: function( fadeInAction, duration, warp ) {

		return fadeInAction.crossFadeFrom( this, duration, warp );

	},

	stopFading: function() {

		var weightInterpolant = this._weightInterpolant;

		if ( weightInterpolant !== null ) {

			this._weightInterpolant = null;
			this._mixer._takeBackControlInterpolant( weightInterpolant );

		}

		return this;

	},

	// Time Scale Control

	// set the weight stopping any scheduled warping
	// although .paused = true yields an effective time scale of zero, this
	// method does *not* change .paused, because it would be confusing
	setEffectiveTimeScale: function( timeScale ) {

		this.timeScale = timeScale;
		this._effectiveTimeScale = this.paused ? 0 :timeScale;

		return this.stopWarping();

	},

	// return the time scale considering warping and .paused
	getEffectiveTimeScale: function() {

		return this._effectiveTimeScale;

	},

	setDuration: function( duration ) {

		this.timeScale = this._clip.duration / duration;

		return this.stopWarping();

	},

	syncWith: function( action ) {

		this.time = action.time;
		this.timeScale = action.timeScale;

		return this.stopWarping();

	},

	halt: function( duration ) {

		return this.warp( this._effectiveTimeScale, 0, duration );

	},

	warp: function( startTimeScale, endTimeScale, duration ) {

		var mixer = this._mixer, now = mixer.time,
			interpolant = this._timeScaleInterpolant,

			timeScale = this.timeScale;

		if ( interpolant === null ) {

			interpolant = mixer._lendControlInterpolant(),
			this._timeScaleInterpolant = interpolant;

		}

		var times = interpolant.parameterPositions,
			values = interpolant.sampleValues;

		times[ 0 ] = now;
		times[ 1 ] = now + duration;

		values[ 0 ] = startTimeScale / timeScale;
		values[ 1 ] = endTimeScale / timeScale;

		return this;

	},

	stopWarping: function() {

		var timeScaleInterpolant = this._timeScaleInterpolant;

		if ( timeScaleInterpolant !== null ) {

			this._timeScaleInterpolant = null;
			this._mixer._takeBackControlInterpolant( timeScaleInterpolant );

		}

		return this;

	},

	// Object Accessors

	getMixer: function() {

		return this._mixer;

	},

	getClip: function() {

		return this._clip;

	},

	getRoot: function() {

		return this._localRoot || this._mixer._root;

	},

	// Interna

	_update: function( time, deltaTime, timeDirection, accuIndex ) {
		// called by the mixer

		var startTime = this._startTime;

		if ( startTime !== null ) {

			// check for scheduled start of action

			var timeRunning = ( time - startTime ) * timeDirection;
			if ( timeRunning < 0 || timeDirection === 0 ) {

				return; // yet to come / don't decide when delta = 0

			}

			// start

			this._startTime = null; // unschedule
			deltaTime = timeDirection * timeRunning;

		}

		// apply time scale and advance time

		deltaTime *= this._updateTimeScale( time );
		var clipTime = this._updateTime( deltaTime );

		// note: _updateTime may disable the action resulting in
		// an effective weight of 0

		var weight = this._updateWeight( time );

		if ( weight > 0 ) {

			var interpolants = this._interpolants;
			var propertyMixers = this._propertyBindings;

			for ( var j = 0, m = interpolants.length; j !== m; ++ j ) {

				interpolants[ j ].evaluate( clipTime );
				propertyMixers[ j ].accumulate( accuIndex, weight );

			}

		}

	},

	_updateWeight: function( time ) {

		var weight = 0;

		if ( this.enabled ) {

			weight = this.weight;
			var interpolant = this._weightInterpolant;

			if ( interpolant !== null ) {

				var interpolantValue = interpolant.evaluate( time )[ 0 ];

				weight *= interpolantValue;

				if ( time > interpolant.parameterPositions[ 1 ] ) {

					this.stopFading();

					if ( interpolantValue === 0 ) {

						// faded out, disable
						this.enabled = false;

					}

				}

			}

		}

		this._effectiveWeight = weight;
		return weight;

	},

	_updateTimeScale: function( time ) {

		var timeScale = 0;

		if ( ! this.paused ) {

			timeScale = this.timeScale;

			var interpolant = this._timeScaleInterpolant;

			if ( interpolant !== null ) {

				var interpolantValue = interpolant.evaluate( time )[ 0 ];

				timeScale *= interpolantValue;

				if ( time > interpolant.parameterPositions[ 1 ] ) {

					this.stopWarping();

					if ( timeScale === 0 ) {

						// motion has halted, pause
						this.paused = true;

					} else {

						// warp done - apply final time scale
						this.timeScale = timeScale;

					}

				}

			}

		}

		this._effectiveTimeScale = timeScale;
		return timeScale;

	},

	_updateTime: function( deltaTime ) {

		var time = this.time + deltaTime;

		if ( deltaTime === 0 ) return time;

		var duration = this._clip.duration,

			loop = this.loop,
			loopCount = this._loopCount;

		if ( loop === THREE.LoopOnce ) {

			if ( loopCount === -1 ) {
				// just started

				this.loopCount = 0;
				this._setEndings( true, true, false );

			}

			handle_stop: {

				if ( time >= duration ) {

					time = duration;

				} else if ( time < 0 ) {

					time = 0;

				} else break handle_stop;

				if ( this.clampWhenFinished ) this.paused = true;
				else this.enabled = false;

				this._mixer.dispatchEvent( {
					type: 'finished', action: this,
					direction: deltaTime < 0 ? -1 : 1
				} );

			}

		} else { // repetitive Repeat or PingPong

			var pingPong = ( loop === THREE.LoopPingPong );

			if ( loopCount === -1 ) {
				// just started

				if ( deltaTime >= 0 ) {

					loopCount = 0;

					this._setEndings(
							true, this.repetitions === 0, pingPong );

				} else {

					// when looping in reverse direction, the initial
					// transition through zero counts as a repetition,
					// so leave loopCount at -1

					this._setEndings(
							this.repetitions === 0, true, pingPong );

				}

			}

			if ( time >= duration || time < 0 ) {
				// wrap around

				var loopDelta = Math.floor( time / duration ); // signed
				time -= duration * loopDelta;

				loopCount += Math.abs( loopDelta );

				var pending = this.repetitions - loopCount;

				if ( pending < 0 ) {
					// have to stop (switch state, clamp time, fire event)

					if ( this.clampWhenFinished ) this.paused = true;
					else this.enabled = false;

					time = deltaTime > 0 ? duration : 0;

					this._mixer.dispatchEvent( {
						type: 'finished', action: this,
						direction: deltaTime > 0 ? 1 : -1
					} );

				} else {
					// keep running

					if ( pending === 0 ) {
						// entering the last round

						var atStart = deltaTime < 0;
						this._setEndings( atStart, ! atStart, pingPong );

					} else {

						this._setEndings( false, false, pingPong );

					}

					this._loopCount = loopCount;

					this._mixer.dispatchEvent( {
						type: 'loop', action: this, loopDelta: loopDelta
					} );

				}

			}

			if ( pingPong && ( loopCount & 1 ) === 1 ) {
				// invert time for the "pong round"

				this.time = time;
				return duration - time;

			}

		}

		this.time = time;
		return time;

	},

	_setEndings: function( atStart, atEnd, pingPong ) {

		var settings = this._interpolantSettings;

		if ( pingPong ) {

			settings.endingStart 	= THREE.ZeroSlopeEnding;
			settings.endingEnd		= THREE.ZeroSlopeEnding;

		} else {

			// assuming for LoopOnce atStart == atEnd == true

			if ( atStart ) {

				settings.endingStart = this.zeroSlopeAtStart ?
						THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;

			} else {

				settings.endingStart = THREE.WrapAroundEnding;

			}

			if ( atEnd ) {

				settings.endingEnd = this.zeroSlopeAtEnd ?
						THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;

			} else {

				settings.endingEnd 	 = THREE.WrapAroundEnding;

			}

		}

	},

	_scheduleFading: function( duration, weightNow, weightThen ) {

		var mixer = this._mixer, now = mixer.time,
			interpolant = this._weightInterpolant;

		if ( interpolant === null ) {

			interpolant = mixer._lendControlInterpolant(),
			this._weightInterpolant = interpolant;

		}

		var times = interpolant.parameterPositions,
			values = interpolant.sampleValues;

		times[ 0 ] = now; 				values[ 0 ] = weightNow;
		times[ 1 ] = now + duration;	values[ 1 ] = weightThen;

		return this;

	}

};


// File:src/animation/AnimationClip.js

/**
 *
 * Reusable set of Tracks that represent an animation.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

THREE.AnimationClip = function ( name, duration, tracks ) {

	this.name = name;
	this.tracks = tracks;
	this.duration = ( duration !== undefined ) ? duration : -1;

	this.uuid = THREE.Math.generateUUID();

	// this means it should figure out its duration by scanning the tracks
	if ( this.duration < 0 ) {

		this.resetDuration();

	}

	// maybe only do these on demand, as doing them here could potentially slow down loading
	// but leaving these here during development as this ensures a lot of testing of these functions
	this.trim();
	this.optimize();

};

THREE.AnimationClip.prototype = {

	constructor: THREE.AnimationClip,

	resetDuration: function() {

		var tracks = this.tracks,
			duration = 0;

		for ( var i = 0, n = tracks.length; i !== n; ++ i ) {

			var track = this.tracks[ i ];

			duration = Math.max(
					duration, track.times[ track.times.length - 1 ] );

		}

		this.duration = duration;

	},

	trim: function() {

		for ( var i = 0; i < this.tracks.length; i ++ ) {

			this.tracks[ i ].trim( 0, this.duration );

		}

		return this;

	},

	optimize: function() {

		for ( var i = 0; i < this.tracks.length; i ++ ) {

			this.tracks[ i ].optimize();

		}

		return this;

	}

};

// Static methods:

Object.assign( THREE.AnimationClip, {

	parse: function( json ) {

		var tracks = [],
			jsonTracks = json.tracks,
			frameTime = 1.0 / ( json.fps || 1.0 );

		for ( var i = 0, n = jsonTracks.length; i !== n; ++ i ) {

			tracks.push( THREE.KeyframeTrack.parse( jsonTracks[ i ] ).scale( frameTime ) );

		}

		return new THREE.AnimationClip( json.name, json.duration, tracks );

	},


	toJSON: function( clip ) {

		var tracks = [],
			clipTracks = clip.tracks;

		var json = {

			'name': clip.name,
			'duration': clip.duration,
			'tracks': tracks

		};

		for ( var i = 0, n = clipTracks.length; i !== n; ++ i ) {

			tracks.push( THREE.KeyframeTrack.toJSON( clipTracks[ i ] ) );

		}

		return json;

	},


	CreateFromMorphTargetSequence: function( name, morphTargetSequence, fps, noLoop ) {

		var numMorphTargets = morphTargetSequence.length;
		var tracks = [];

		for ( var i = 0; i < numMorphTargets; i ++ ) {

			var times = [];
			var values = [];

			times.push(
					( i + numMorphTargets - 1 ) % numMorphTargets,
					i,
					( i + 1 ) % numMorphTargets );

			values.push( 0, 1, 0 );

			var order = THREE.AnimationUtils.getKeyframeOrder( times );
			times = THREE.AnimationUtils.sortedArray( times, 1, order );
			values = THREE.AnimationUtils.sortedArray( values, 1, order );

			// if there is a key at the first frame, duplicate it as the
			// last frame as well for perfect loop.
			if ( ! noLoop && times[ 0 ] === 0 ) {

				times.push( numMorphTargets );
				values.push( values[ 0 ] );

			}

			tracks.push(
					new THREE.NumberKeyframeTrack(
						'.morphTargetInfluences[' + morphTargetSequence[ i ].name + ']',
						times, values
					).scale( 1.0 / fps ) );
		}

		return new THREE.AnimationClip( name, -1, tracks );

	},

	findByName: function( objectOrClipArray, name ) {

		var clipArray = objectOrClipArray;

		if ( ! Array.isArray( objectOrClipArray ) ) {

			var o = objectOrClipArray;
			clipArray = o.geometry && o.geometry.animations || o.animations;

		}

		for ( var i = 0; i < clipArray.length; i ++ ) {

			if ( clipArray[ i ].name === name ) {

				return clipArray[ i ];

			}
		}

		return null;

	},

	CreateClipsFromMorphTargetSequences: function( morphTargets, fps, noLoop ) {

		var animationToMorphTargets = {};

		// tested with https://regex101.com/ on trick sequences
		// such flamingo_flyA_003, flamingo_run1_003, crdeath0059
		var pattern = /^([\w-]*?)([\d]+)$/;

		// sort morph target names into animation groups based
		// patterns like Walk_001, Walk_002, Run_001, Run_002
		for ( var i = 0, il = morphTargets.length; i < il; i ++ ) {

			var morphTarget = morphTargets[ i ];
			var parts = morphTarget.name.match( pattern );

			if ( parts && parts.length > 1 ) {

				var name = parts[ 1 ];

				var animationMorphTargets = animationToMorphTargets[ name ];
				if ( ! animationMorphTargets ) {

					animationToMorphTargets[ name ] = animationMorphTargets = [];

				}

				animationMorphTargets.push( morphTarget );

			}

		}

		var clips = [];

		for ( var name in animationToMorphTargets ) {

			clips.push( THREE.AnimationClip.CreateFromMorphTargetSequence( name, animationToMorphTargets[ name ], fps, noLoop ) );

		}

		return clips;

	},

	// parse the animation.hierarchy format
	parseAnimation: function( animation, bones, nodeName ) {

		if ( ! animation ) {

			console.error( "  no animation in JSONLoader data" );
			return null;

		}

		var addNonemptyTrack = function(
				trackType, trackName, animationKeys, propertyName, destTracks ) {

			// only return track if there are actually keys.
			if ( animationKeys.length !== 0 ) {

				var times = [];
				var values = [];

				THREE.AnimationUtils.flattenJSON(
						animationKeys, times, values, propertyName );

				// empty keys are filtered out, so check again
				if ( times.length !== 0 ) {

					destTracks.push( new trackType( trackName, times, values ) );

				}

			}

		};

		var tracks = [];

		var clipName = animation.name || 'default';
		// automatic length determination in AnimationClip.
		var duration = animation.length || -1;
		var fps = animation.fps || 30;

		var hierarchyTracks = animation.hierarchy || [];

		for ( var h = 0; h < hierarchyTracks.length; h ++ ) {

			var animationKeys = hierarchyTracks[ h ].keys;

			// skip empty tracks
			if ( ! animationKeys || animationKeys.length === 0 ) continue;

			// process morph targets in a way exactly compatible
			// with AnimationHandler.init( animation )
			if ( animationKeys[0].morphTargets ) {

				// figure out all morph targets used in this track
				var morphTargetNames = {};
				for ( var k = 0; k < animationKeys.length; k ++ ) {

					if ( animationKeys[k].morphTargets ) {

						for ( var m = 0; m < animationKeys[k].morphTargets.length; m ++ ) {

							morphTargetNames[ animationKeys[k].morphTargets[m] ] = -1;
						}

					}

				}

				// create a track for each morph target with all zero
				// morphTargetInfluences except for the keys in which
				// the morphTarget is named.
				for ( var morphTargetName in morphTargetNames ) {

					var times = [];
					var values = [];

					for ( var m = 0;
							m !== animationKeys[k].morphTargets.length; ++ m ) {

						var animationKey = animationKeys[k];

						times.push( animationKey.time );
						values.push( ( animationKey.morphTarget === morphTargetName ) ? 1 : 0 );

					}

					tracks.push( new THREE.NumberKeyframeTrack(
							'.morphTargetInfluence[' + morphTargetName + ']', times, values ) );

				}

				duration = morphTargetNames.length * ( fps || 1.0 );

			} else {
				// ...assume skeletal animation

				var boneName = '.bones[' + bones[ h ].name + ']';

				addNonemptyTrack(
						THREE.VectorKeyframeTrack, boneName + '.position',
						animationKeys, 'pos', tracks );

				addNonemptyTrack(
						THREE.QuaternionKeyframeTrack, boneName + '.quaternion',
						animationKeys, 'rot', tracks );

				addNonemptyTrack(
						THREE.VectorKeyframeTrack, boneName + '.scale',
						animationKeys, 'scl', tracks );

			}

		}

		if ( tracks.length === 0 ) {

			return null;

		}

		var clip = new THREE.AnimationClip( clipName, duration, tracks );

		return clip;

	}

} );

// File:src/animation/AnimationMixer.js

/**
 *
 * Player for AnimationClips.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.AnimationMixer = function( root ) {

	this._root = root;
	this._initMemoryManager();
	this._accuIndex = 0;

	this.time = 0;

	this.timeScale = 1.0;

};

Object.assign( THREE.AnimationMixer.prototype, THREE.EventDispatcher.prototype, {

	// return an action for a clip optionally using a custom root target
	// object (this method allocates a lot of dynamic memory in case a
	// previously unknown clip/root combination is specified)
	clipAction: function( clip, optionalRoot ) {

		var root = optionalRoot || this._root,
			rootUuid = root.uuid,

			clipObject = typeof clip === 'string' ?
					THREE.AnimationClip.findByName( root, clip ) : clip,

			clipUuid = clipObject !== null ? clipObject.uuid : clip,

			actionsForClip = this._actionsByClip[ clipUuid ],
			prototypeAction = null;

		if ( actionsForClip !== undefined ) {

			var existingAction =
					actionsForClip.actionByRoot[ rootUuid ];

			if ( existingAction !== undefined ) {

				return existingAction;

			}

			// we know the clip, so we don't have to parse all
			// the bindings again but can just copy
			prototypeAction = actionsForClip.knownActions[ 0 ];

			// also, take the clip from the prototype action
			if ( clipObject === null )
				clipObject = prototypeAction._clip;

		}

		// clip must be known when specified via string
		if ( clipObject === null ) return null;

		// allocate all resources required to run it
		var newAction = new THREE.
				AnimationMixer._Action( this, clipObject, optionalRoot );

		this._bindAction( newAction, prototypeAction );

		// and make the action known to the memory manager
		this._addInactiveAction( newAction, clipUuid, rootUuid );

		return newAction;

	},

	// get an existing action
	existingAction: function( clip, optionalRoot ) {

		var root = optionalRoot || this._root,
			rootUuid = root.uuid,

			clipObject = typeof clip === 'string' ?
					THREE.AnimationClip.findByName( root, clip ) : clip,

			clipUuid = clipObject ? clipObject.uuid : clip,

			actionsForClip = this._actionsByClip[ clipUuid ];

		if ( actionsForClip !== undefined ) {

			return actionsForClip.actionByRoot[ rootUuid ] || null;

		}

		return null;

	},

	// deactivates all previously scheduled actions
	stopAllAction: function() {

		var actions = this._actions,
			nActions = this._nActiveActions,
			bindings = this._bindings,
			nBindings = this._nActiveBindings;

		this._nActiveActions = 0;
		this._nActiveBindings = 0;

		for ( var i = 0; i !== nActions; ++ i ) {

			actions[ i ].reset();

		}

		for ( var i = 0; i !== nBindings; ++ i ) {

			bindings[ i ].useCount = 0;

		}

		return this;

	},

	// advance the time and update apply the animation
	update: function( deltaTime ) {

		deltaTime *= this.timeScale;

		var actions = this._actions,
			nActions = this._nActiveActions,

			time = this.time += deltaTime,
			timeDirection = Math.sign( deltaTime ),

			accuIndex = this._accuIndex ^= 1;

		// run active actions

		for ( var i = 0; i !== nActions; ++ i ) {

			var action = actions[ i ];

			if ( action.enabled ) {

				action._update( time, deltaTime, timeDirection, accuIndex );

			}

		}

		// update scene graph

		var bindings = this._bindings,
			nBindings = this._nActiveBindings;

		for ( var i = 0; i !== nBindings; ++ i ) {

			bindings[ i ].apply( accuIndex );

		}

		return this;

	},

	// return this mixer's root target object
	getRoot: function() {

		return this._root;

	},

	// free all resources specific to a particular clip
	uncacheClip: function( clip ) {

		var actions = this._actions,
			clipUuid = clip.uuid,
			actionsByClip = this._actionsByClip,
			actionsForClip = actionsByClip[ clipUuid ];

		if ( actionsForClip !== undefined ) {

			// note: just calling _removeInactiveAction would mess up the
			// iteration state and also require updating the state we can
			// just throw away

			var actionsToRemove = actionsForClip.knownActions;

			for ( var i = 0, n = actionsToRemove.length; i !== n; ++ i ) {

				var action = actionsToRemove[ i ];

				this._deactivateAction( action );

				var cacheIndex = action._cacheIndex,
					lastInactiveAction = actions[ actions.length - 1 ];

				action._cacheIndex = null;
				action._byClipCacheIndex = null;

				lastInactiveAction._cacheIndex = cacheIndex;
				actions[ cacheIndex ] = lastInactiveAction;
				actions.pop();

				this._removeInactiveBindingsForAction( action );

			}

			delete actionsByClip[ clipUuid ];

		}

	},

	// free all resources specific to a particular root target object
	uncacheRoot: function( root ) {

		var rootUuid = root.uuid,
			actionsByClip = this._actionsByClip;

		for ( var clipUuid in actionsByClip ) {

			var actionByRoot = actionsByClip[ clipUuid ].actionByRoot,
				action = actionByRoot[ rootUuid ];

			if ( action !== undefined ) {

				this._deactivateAction( action );
				this._removeInactiveAction( action );

			}

		}

		var bindingsByRoot = this._bindingsByRootAndName,
			bindingByName = bindingsByRoot[ rootUuid ];

		if ( bindingByName !== undefined ) {

			for ( var trackName in bindingByName ) {

				var binding = bindingByName[ trackName ];
				binding.restoreOriginalState();
				this._removeInactiveBinding( binding );

			}

		}

	},

	// remove a targeted clip from the cache
	uncacheAction: function( clip, optionalRoot ) {

		var action = this.existingAction( clip, optionalRoot );

		if ( action !== null ) {

			this._deactivateAction( action );
			this._removeInactiveAction( action );

		}

	}

} );

THREE.AnimationMixer._Action = THREE.AnimationAction._new;

// Implementation details:

Object.assign( THREE.AnimationMixer.prototype, {

	_bindAction: function( action, prototypeAction ) {

		var root = action._localRoot || this._root,
			tracks = action._clip.tracks,
			nTracks = tracks.length,
			bindings = action._propertyBindings,
			interpolants = action._interpolants,
			rootUuid = root.uuid,
			bindingsByRoot = this._bindingsByRootAndName,
			bindingsByName = bindingsByRoot[ rootUuid ];

		if ( bindingsByName === undefined ) {

			bindingsByName = {};
			bindingsByRoot[ rootUuid ] = bindingsByName;

		}

		for ( var i = 0; i !== nTracks; ++ i ) {

			var track = tracks[ i ],
				trackName = track.name,
				binding = bindingsByName[ trackName ];

			if ( binding !== undefined ) {

				bindings[ i ] = binding;

			} else {

				binding = bindings[ i ];

				if ( binding !== undefined ) {

					// existing binding, make sure the cache knows

					if ( binding._cacheIndex === null ) {

						++ binding.referenceCount;
						this._addInactiveBinding( binding, rootUuid, trackName );

					}

					continue;

				}

				var path = prototypeAction && prototypeAction.
						_propertyBindings[ i ].binding.parsedPath;

				binding = new THREE.PropertyMixer(
						THREE.PropertyBinding.create( root, trackName, path ),
						track.ValueTypeName, track.getValueSize() );

				++ binding.referenceCount;
				this._addInactiveBinding( binding, rootUuid, trackName );

				bindings[ i ] = binding;

			}

			interpolants[ i ].resultBuffer = binding.buffer;

		}

	},

	_activateAction: function( action ) {

		if ( ! this._isActiveAction( action ) ) {

			if ( action._cacheIndex === null ) {

				// this action has been forgotten by the cache, but the user
				// appears to be still using it -> rebind

				var rootUuid = ( action._localRoot || this._root ).uuid,
					clipUuid = action._clip.uuid,
					actionsForClip = this._actionsByClip[ clipUuid ];

				this._bindAction( action,
						actionsForClip && actionsForClip.knownActions[ 0 ] );

				this._addInactiveAction( action, clipUuid, rootUuid );

			}

			var bindings = action._propertyBindings;

			// increment reference counts / sort out state
			for ( var i = 0, n = bindings.length; i !== n; ++ i ) {

				var binding = bindings[ i ];

				if ( binding.useCount ++ === 0 ) {

					this._lendBinding( binding );
					binding.saveOriginalState();

				}

			}

			this._lendAction( action );

		}

	},

	_deactivateAction: function( action ) {

		if ( this._isActiveAction( action ) ) {

			var bindings = action._propertyBindings;

			// decrement reference counts / sort out state
			for ( var i = 0, n = bindings.length; i !== n; ++ i ) {

				var binding = bindings[ i ];

				if ( -- binding.useCount === 0 ) {

					binding.restoreOriginalState();
					this._takeBackBinding( binding );

				}

			}

			this._takeBackAction( action );

		}

	},

	// Memory manager

	_initMemoryManager: function() {

		this._actions = []; // 'nActiveActions' followed by inactive ones
		this._nActiveActions = 0;

		this._actionsByClip = {};
		// inside:
		// {
		// 		knownActions: Array< _Action >	- used as prototypes
		// 		actionByRoot: _Action			- lookup
		// }


		this._bindings = []; // 'nActiveBindings' followed by inactive ones
		this._nActiveBindings = 0;

		this._bindingsByRootAndName = {}; // inside: Map< name, PropertyMixer >


		this._controlInterpolants = []; // same game as above
		this._nActiveControlInterpolants = 0;

		var scope = this;

		this.stats = {

			actions: {
				get total() { return scope._actions.length; },
				get inUse() { return scope._nActiveActions; }
			},
			bindings: {
				get total() { return scope._bindings.length; },
				get inUse() { return scope._nActiveBindings; }
			},
			controlInterpolants: {
				get total() { return scope._controlInterpolants.length; },
				get inUse() { return scope._nActiveControlInterpolants; }
			}

		};

	},

	// Memory management for _Action objects

	_isActiveAction: function( action ) {

		var index = action._cacheIndex;
		return index !== null && index < this._nActiveActions;

	},

	_addInactiveAction: function( action, clipUuid, rootUuid ) {

		var actions = this._actions,
			actionsByClip = this._actionsByClip,
			actionsForClip = actionsByClip[ clipUuid ];

		if ( actionsForClip === undefined ) {

			actionsForClip = {

				knownActions: [ action ],
				actionByRoot: {}

			};

			action._byClipCacheIndex = 0;

			actionsByClip[ clipUuid ] = actionsForClip;

		} else {

			var knownActions = actionsForClip.knownActions;

			action._byClipCacheIndex = knownActions.length;
			knownActions.push( action );

		}

		action._cacheIndex = actions.length;
		actions.push( action );

		actionsForClip.actionByRoot[ rootUuid ] = action;

	},

	_removeInactiveAction: function( action ) {

		var actions = this._actions,
			lastInactiveAction = actions[ actions.length - 1 ],
			cacheIndex = action._cacheIndex;

		lastInactiveAction._cacheIndex = cacheIndex;
		actions[ cacheIndex ] = lastInactiveAction;
		actions.pop();

		action._cacheIndex = null;


		var clipUuid = action._clip.uuid,
			actionsByClip = this._actionsByClip,
			actionsForClip = actionsByClip[ clipUuid ],
			knownActionsForClip = actionsForClip.knownActions,

			lastKnownAction =
				knownActionsForClip[ knownActionsForClip.length - 1 ],

			byClipCacheIndex = action._byClipCacheIndex;

		lastKnownAction._byClipCacheIndex = byClipCacheIndex;
		knownActionsForClip[ byClipCacheIndex ] = lastKnownAction;
		knownActionsForClip.pop();

		action._byClipCacheIndex = null;


		var actionByRoot = actionsForClip.actionByRoot,
			rootUuid = ( actions._localRoot || this._root ).uuid;

		delete actionByRoot[ rootUuid ];

		if ( knownActionsForClip.length === 0 ) {

			delete actionsByClip[ clipUuid ];

		}

		this._removeInactiveBindingsForAction( action );

	},

	_removeInactiveBindingsForAction: function( action ) {

		var bindings = action._propertyBindings;
		for ( var i = 0, n = bindings.length; i !== n; ++ i ) {

			var binding = bindings[ i ];

			if ( -- binding.referenceCount === 0 ) {

				this._removeInactiveBinding( binding );

			}

		}

	},

	_lendAction: function( action ) {

		// [ active actions |  inactive actions  ]
		// [  active actions >| inactive actions ]
		//                 s        a
		//                  <-swap->
		//                 a        s

		var actions = this._actions,
			prevIndex = action._cacheIndex,

			lastActiveIndex = this._nActiveActions ++,

			firstInactiveAction = actions[ lastActiveIndex ];

		action._cacheIndex = lastActiveIndex;
		actions[ lastActiveIndex ] = action;

		firstInactiveAction._cacheIndex = prevIndex;
		actions[ prevIndex ] = firstInactiveAction;

	},

	_takeBackAction: function( action ) {

		// [  active actions  | inactive actions ]
		// [ active actions |< inactive actions  ]
		//        a        s
		//         <-swap->
		//        s        a

		var actions = this._actions,
			prevIndex = action._cacheIndex,

			firstInactiveIndex = -- this._nActiveActions,

			lastActiveAction = actions[ firstInactiveIndex ];

		action._cacheIndex = firstInactiveIndex;
		actions[ firstInactiveIndex ] = action;

		lastActiveAction._cacheIndex = prevIndex;
		actions[ prevIndex ] = lastActiveAction;

	},

	// Memory management for PropertyMixer objects

	_addInactiveBinding: function( binding, rootUuid, trackName ) {

		var bindingsByRoot = this._bindingsByRootAndName,
			bindingByName = bindingsByRoot[ rootUuid ],

			bindings = this._bindings;

		if ( bindingByName === undefined ) {

			bindingByName = {};
			bindingsByRoot[ rootUuid ] = bindingByName;

		}

		bindingByName[ trackName ] = binding;

		binding._cacheIndex = bindings.length;
		bindings.push( binding );

	},

	_removeInactiveBinding: function( binding ) {

		var bindings = this._bindings,
			propBinding = binding.binding,
			rootUuid = propBinding.rootNode.uuid,
			trackName = propBinding.path,
			bindingsByRoot = this._bindingsByRootAndName,
			bindingByName = bindingsByRoot[ rootUuid ],

			lastInactiveBinding = bindings[ bindings.length - 1 ],
			cacheIndex = binding._cacheIndex;

		lastInactiveBinding._cacheIndex = cacheIndex;
		bindings[ cacheIndex ] = lastInactiveBinding;
		bindings.pop();

		delete bindingByName[ trackName ];

		remove_empty_map: {

			for ( var _ in bindingByName ) break remove_empty_map;

			delete bindingsByRoot[ rootUuid ];

		}

	},

	_lendBinding: function( binding ) {

		var bindings = this._bindings,
			prevIndex = binding._cacheIndex,

			lastActiveIndex = this._nActiveBindings ++,

			firstInactiveBinding = bindings[ lastActiveIndex ];

		binding._cacheIndex = lastActiveIndex;
		bindings[ lastActiveIndex ] = binding;

		firstInactiveBinding._cacheIndex = prevIndex;
		bindings[ prevIndex ] = firstInactiveBinding;

	},

	_takeBackBinding: function( binding ) {

		var bindings = this._bindings,
			prevIndex = binding._cacheIndex,

			firstInactiveIndex = -- this._nActiveBindings,

			lastActiveBinding = bindings[ firstInactiveIndex ];

		binding._cacheIndex = firstInactiveIndex;
		bindings[ firstInactiveIndex ] = binding;

		lastActiveBinding._cacheIndex = prevIndex;
		bindings[ prevIndex ] = lastActiveBinding;

	},


	// Memory management of Interpolants for weight and time scale

	_lendControlInterpolant: function() {

		var interpolants = this._controlInterpolants,
			lastActiveIndex = this._nActiveControlInterpolants ++,
			interpolant = interpolants[ lastActiveIndex ];

		if ( interpolant === undefined ) {

			interpolant = new THREE.LinearInterpolant(
					new Float32Array( 2 ), new Float32Array( 2 ),
						1, this._controlInterpolantsResultBuffer );

			interpolant.__cacheIndex = lastActiveIndex;
			interpolants[ lastActiveIndex ] = interpolant;

		}

		return interpolant;

	},

	_takeBackControlInterpolant: function( interpolant ) {

		var interpolants = this._controlInterpolants,
			prevIndex = interpolant.__cacheIndex,

			firstInactiveIndex = -- this._nActiveControlInterpolants,

			lastActiveInterpolant = interpolants[ firstInactiveIndex ];

		interpolant.__cacheIndex = firstInactiveIndex;
		interpolants[ firstInactiveIndex ] = interpolant;

		lastActiveInterpolant.__cacheIndex = prevIndex;
		interpolants[ prevIndex ] = lastActiveInterpolant;

	},

	_controlInterpolantsResultBuffer: new Float32Array( 1 )

} );

// File:src/animation/AnimationObjectGroup.js

/**
 *
 * A group of objects that receives a shared animation state.
 *
 * Usage:
 *
 * 	-	Add objects you would otherwise pass as 'root' to the
 * 		constructor or the .clipAction method of AnimationMixer.
 *
 * 	-	Instead pass this object as 'root'.
 *
 * 	-	You can also add and remove objects later when the mixer
 * 		is running.
 *
 * Note:
 *
 *  	Objects of this class appear as one object to the mixer,
 *  	so cache control of the individual objects must be done
 *  	on the group.
 *
 * Limitation:
 *
 * 	- 	The animated properties must be compatible among the
 * 		all objects in the group.
 *
 *  -	A single property can either be controlled through a
 *  	target group or directly, but not both.
 *
 * @author tschw
 */

THREE.AnimationObjectGroup = function( var_args ) {

	this.uuid = THREE.Math.generateUUID();

	// cached objects followed by the active ones
	this._objects = Array.prototype.slice.call( arguments );

	this.nCachedObjects_ = 0;			// threshold
	// note: read by PropertyBinding.Composite

	var indices = {};
	this._indicesByUUID = indices;		// for bookkeeping

	for ( var i = 0, n = arguments.length; i !== n; ++ i ) {

		indices[ arguments[ i ].uuid ] = i;

	}

	this._paths = [];					// inside: string
	this._parsedPaths = [];				// inside: { we don't care, here }
	this._bindings = []; 				// inside: Array< PropertyBinding >
	this._bindingsIndicesByPath = {}; 	// inside: indices in these arrays

	var scope = this;

	this.stats = {

		objects: {
			get total() { return scope._objects.length; },
			get inUse() { return this.total - scope.nCachedObjects_;  }
		},

		get bindingsPerObject() { return scope._bindings.length; }

	};

};

THREE.AnimationObjectGroup.prototype = {

	constructor: THREE.AnimationObjectGroup,

	add: function( var_args ) {

		var objects = this._objects,
			nObjects = objects.length,
			nCachedObjects = this.nCachedObjects_,
			indicesByUUID = this._indicesByUUID,
			paths = this._paths,
			parsedPaths = this._parsedPaths,
			bindings = this._bindings,
			nBindings = bindings.length;

		for ( var i = 0, n = arguments.length; i !== n; ++ i ) {

			var object = arguments[ i ],
				uuid = object.uuid,
				index = indicesByUUID[ uuid ];

			if ( index === undefined ) {

				// unknown object -> add it to the ACTIVE region

				index = nObjects ++;
				indicesByUUID[ uuid ] = index;
				objects.push( object );

				// accounting is done, now do the same for all bindings

				for ( var j = 0, m = nBindings; j !== m; ++ j ) {

					bindings[ j ].push(
							new THREE.PropertyBinding(
								object, paths[ j ], parsedPaths[ j ] ) );

				}

			} else if ( index < nCachedObjects ) {

				var knownObject = objects[ index ];

				// move existing object to the ACTIVE region

				var firstActiveIndex = -- nCachedObjects,
					lastCachedObject = objects[ firstActiveIndex ];

				indicesByUUID[ lastCachedObject.uuid ] = index;
				objects[ index ] = lastCachedObject;

				indicesByUUID[ uuid ] = firstActiveIndex;
				objects[ firstActiveIndex ] = object;

				// accounting is done, now do the same for all bindings

				for ( var j = 0, m = nBindings; j !== m; ++ j ) {

					var bindingsForPath = bindings[ j ],
						lastCached = bindingsForPath[ firstActiveIndex ],
						binding = bindingsForPath[ index ];

					bindingsForPath[ index ] = lastCached;

					if ( binding === undefined ) {

						// since we do not bother to create new bindings
						// for objects that are cached, the binding may
						// or may not exist

						binding = new THREE.PropertyBinding(
								object, paths[ j ], parsedPaths[ j ] );

					}

					bindingsForPath[ firstActiveIndex ] = binding;

				}

			} else if ( objects[ index ] !== knownObject) {

				console.error( "Different objects with the same UUID " +
						"detected. Clean the caches or recreate your " +
						"infrastructure when reloading scenes..." );

			} // else the object is already where we want it to be

		} // for arguments

		this.nCachedObjects_ = nCachedObjects;

	},

	remove: function( var_args ) {

		var objects = this._objects,
			nObjects = objects.length,
			nCachedObjects = this.nCachedObjects_,
			indicesByUUID = this._indicesByUUID,
			bindings = this._bindings,
			nBindings = bindings.length;

		for ( var i = 0, n = arguments.length; i !== n; ++ i ) {

			var object = arguments[ i ],
				uuid = object.uuid,
				index = indicesByUUID[ uuid ];

			if ( index !== undefined && index >= nCachedObjects ) {

				// move existing object into the CACHED region

				var lastCachedIndex = nCachedObjects ++,
					firstActiveObject = objects[ lastCachedIndex ];

				indicesByUUID[ firstActiveObject.uuid ] = index;
				objects[ index ] = firstActiveObject;

				indicesByUUID[ uuid ] = lastCachedIndex;
				objects[ lastCachedIndex ] = object;

				// accounting is done, now do the same for all bindings

				for ( var j = 0, m = nBindings; j !== m; ++ j ) {

					var bindingsForPath = bindings[ j ],
						firstActive = bindingsForPath[ lastCachedIndex ],
						binding = bindingsForPath[ index ];

					bindingsForPath[ index ] = firstActive;
					bindingsForPath[ lastCachedIndex ] = binding;

				}

			}

		} // for arguments

		this.nCachedObjects_ = nCachedObjects;

	},

	// remove & forget
	uncache: function( var_args ) {

		var objects = this._objects,
			nObjects = objects.length,
			nCachedObjects = this.nCachedObjects_,
			indicesByUUID = this._indicesByUUID,
			bindings = this._bindings,
			nBindings = bindings.length;

		for ( var i = 0, n = arguments.length; i !== n; ++ i ) {

			var object = arguments[ i ],
				uuid = object.uuid,
				index = indicesByUUID[ uuid ];

			if ( index !== undefined ) {

				delete indicesByUUID[ uuid ];

				if ( index < nCachedObjects ) {

					// object is cached, shrink the CACHED region

					var firstActiveIndex = -- nCachedObjects,
						lastCachedObject = objects[ firstActiveIndex ],
						lastIndex = -- nObjects,
						lastObject = objects[ lastIndex ];

					// last cached object takes this object's place
					indicesByUUID[ lastCachedObject.uuid ] = index;
					objects[ index ] = lastCachedObject;

					// last object goes to the activated slot and pop
					indicesByUUID[ lastObject.uuid ] = firstActiveIndex;
					objects[ firstActiveIndex ] = lastObject;
					objects.pop();

					// accounting is done, now do the same for all bindings

					for ( var j = 0, m = nBindings; j !== m; ++ j ) {

						var bindingsForPath = bindings[ j ],
							lastCached = bindingsForPath[ firstActiveIndex ],
							last = bindingsForPath[ lastIndex ];

						bindingsForPath[ index ] = lastCached;
						bindingsForPath[ firstActiveIndex ] = last;
						bindingsForPath.pop();

					}

				} else {

					// object is active, just swap with the last and pop

					var lastIndex = -- nObjects,
						lastObject = objects[ lastIndex ];

					indicesByUUID[ lastObject.uuid ] = index;
					objects[ index ] = lastObject;
					objects.pop();

					// accounting is done, now do the same for all bindings

					for ( var j = 0, m = nBindings; j !== m; ++ j ) {

						var bindingsForPath = bindings[ j ];

						bindingsForPath[ index ] = bindingsForPath[ lastIndex ];
						bindingsForPath.pop();

					}

				} // cached or active

			} // if object is known

		} // for arguments

		this.nCachedObjects_ = nCachedObjects;

	},

	// Internal interface used by befriended PropertyBinding.Composite:

	subscribe_: function( path, parsedPath ) {
		// returns an array of bindings for the given path that is changed
		// according to the contained objects in the group

		var indicesByPath = this._bindingsIndicesByPath,
			index = indicesByPath[ path ],
			bindings = this._bindings;

		if ( index !== undefined ) return bindings[ index ];

		var paths = this._paths,
			parsedPaths = this._parsedPaths,
			objects = this._objects,
			nObjects = objects.length,
			nCachedObjects = this.nCachedObjects_,
			bindingsForPath = new Array( nObjects );

		index = bindings.length;

		indicesByPath[ path ] = index;

		paths.push( path );
		parsedPaths.push( parsedPath );
		bindings.push( bindingsForPath );

		for ( var i = nCachedObjects,
				n = objects.length; i !== n; ++ i ) {

			var object = objects[ i ];

			bindingsForPath[ i ] =
					new THREE.PropertyBinding( object, path, parsedPath );

		}

		return bindingsForPath;

	},

	unsubscribe_: function( path ) {
		// tells the group to forget about a property path and no longer
		// update the array previously obtained with 'subscribe_'

		var indicesByPath = this._bindingsIndicesByPath,
			index = indicesByPath[ path ];

		if ( index !== undefined ) {

			var paths = this._paths,
				parsedPaths = this._parsedPaths,
				bindings = this._bindings,
				lastBindingsIndex = bindings.length - 1,
				lastBindings = bindings[ lastBindingsIndex ],
				lastBindingsPath = path[ lastBindingsIndex ];

			indicesByPath[ lastBindingsPath ] = index;

			bindings[ index ] = lastBindings;
			bindings.pop();

			parsedPaths[ index ] = parsedPaths[ lastBindingsIndex ];
			parsedPaths.pop();

			paths[ index ] = paths[ lastBindingsIndex ];
			paths.pop();

		}

	}

};


// File:src/animation/AnimationUtils.js

/**
 * @author tschw
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

THREE.AnimationUtils = {

	// same as Array.prototype.slice, but also works on typed arrays
	arraySlice: function( array, from, to ) {

		if ( THREE.AnimationUtils.isTypedArray( array ) ) {

			return new array.constructor( array.subarray( from, to ) );

		}

		return array.slice( from, to );

	},

	// converts an array to a specific type
	convertArray: function( array, type, forceClone ) {

		if ( ! array || // let 'undefined' and 'null' pass
				! forceClone && array.constructor === type ) return array;

		if ( typeof type.BYTES_PER_ELEMENT === 'number' ) {

			return new type( array ); // create typed array

		}

		return Array.prototype.slice.call( array ); // create Array

	},

	isTypedArray: function( object ) {

		return ArrayBuffer.isView( object ) &&
				! ( object instanceof DataView );

	},

	// returns an array by which times and values can be sorted
	getKeyframeOrder: function( times ) {

		function compareTime( i, j ) {

			return times[ i ] - times[ j ];

		}

		var n = times.length;
		var result = new Array( n );
		for ( var i = 0; i !== n; ++ i ) result[ i ] = i;

		result.sort( compareTime );

		return result;

	},

	// uses the array previously returned by 'getKeyframeOrder' to sort data
	sortedArray: function( values, stride, order ) {

		var nValues = values.length;
		var result = new values.constructor( nValues );

		for ( var i = 0, dstOffset = 0; dstOffset !== nValues; ++ i ) {

			var srcOffset = order[ i ] * stride;

			for ( var j = 0; j !== stride; ++ j ) {

				result[ dstOffset ++ ] = values[ srcOffset + j ];

			}

		}

		return result;

	},

	// function for parsing AOS keyframe formats
	flattenJSON: function( jsonKeys, times, values, valuePropertyName ) {

		var i = 1, key = jsonKeys[ 0 ];

		while ( key !== undefined && key[ valuePropertyName ] === undefined ) {

			key = jsonKeys[ i ++ ];

		}

		if ( key === undefined ) return; // no data

		var value = key[ valuePropertyName ];
		if ( value === undefined ) return; // no data

		if ( Array.isArray( value ) ) {

			do {

				value = key[ valuePropertyName ];

				if ( value !== undefined ) {

					times.push( key.time );
					values.push.apply( values, value ); // push all elements

				}

				key = jsonKeys[ i ++ ];

			} while ( key !== undefined );

		} else if ( value.toArray !== undefined ) {
			// ...assume THREE.Math-ish

			do {

				value = key[ valuePropertyName ];

				if ( value !== undefined ) {

					times.push( key.time );
					value.toArray( values, values.length );

				}

				key = jsonKeys[ i ++ ];

			} while ( key !== undefined );

		} else {
			// otherwise push as-is

			do {

				value = key[ valuePropertyName ];

				if ( value !== undefined ) {

					times.push( key.time );
					values.push( value );

				}

				key = jsonKeys[ i ++ ];

			} while ( key !== undefined );

		}

	}

};

// File:src/animation/KeyframeTrack.js

/**
 *
 * A timed sequence of keyframes for a specific property.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.KeyframeTrack = function ( name, times, values, interpolation ) {

	if( name === undefined ) throw new Error( "track name is undefined" );

	if( times === undefined || times.length === 0 ) {

		throw new Error( "no keyframes in track named " + name );

	}

	this.name = name;

	this.times = THREE.AnimationUtils.convertArray( times, this.TimeBufferType );
	this.values = THREE.AnimationUtils.convertArray( values, this.ValueBufferType );

	this.setInterpolation( interpolation || this.DefaultInterpolation );

	this.validate();
	this.optimize();

};

THREE.KeyframeTrack.prototype = {

	constructor: THREE.KeyframeTrack,

	TimeBufferType: Float32Array,
	ValueBufferType: Float32Array,

	DefaultInterpolation: THREE.InterpolateLinear,

	InterpolantFactoryMethodDiscrete: function( result ) {

		return new THREE.DiscreteInterpolant(
				this.times, this.values, this.getValueSize(), result );

	},

	InterpolantFactoryMethodLinear: function( result ) {

		return new THREE.LinearInterpolant(
				this.times, this.values, this.getValueSize(), result );

	},

	InterpolantFactoryMethodSmooth: function( result ) {

		return new THREE.CubicInterpolant(
				this.times, this.values, this.getValueSize(), result );

	},

	setInterpolation: function( interpolation ) {

		var factoryMethod;

		switch ( interpolation ) {

			case THREE.InterpolateDiscrete:

				factoryMethod = this.InterpolantFactoryMethodDiscrete;

				break;

			case THREE.InterpolateLinear:

				factoryMethod = this.InterpolantFactoryMethodLinear;

				break;

			case THREE.InterpolateSmooth:

				factoryMethod = this.InterpolantFactoryMethodSmooth;

				break;

		}

		if ( factoryMethod === undefined ) {

			var message = "unsupported interpolation for " +
					this.ValueTypeName + " keyframe track named " + this.name;

			if ( this.createInterpolant === undefined ) {

				// fall back to default, unless the default itself is messed up
				if ( interpolation !== this.DefaultInterpolation ) {

					this.setInterpolation( this.DefaultInterpolation );

				} else {

					throw new Error( message ); // fatal, in this case

				}

			}

			console.warn( message );
			return;

		}

		this.createInterpolant = factoryMethod;

	},

	getInterpolation: function() {

		switch ( this.createInterpolant ) {

			case this.InterpolantFactoryMethodDiscrete:

				return THREE.InterpolateDiscrete;

			case this.InterpolantFactoryMethodLinear:

				return THREE.InterpolateLinear;

			case this.InterpolantFactoryMethodSmooth:

				return THREE.InterpolateSmooth;

		}

	},

	getValueSize: function() {

		return this.values.length / this.times.length;

	},

	// move all keyframes either forwards or backwards in time
	shift: function( timeOffset ) {

		if( timeOffset !== 0.0 ) {

			var times = this.times;

			for( var i = 0, n = times.length; i !== n; ++ i ) {

				times[ i ] += timeOffset;

			}

		}

		return this;

	},

	// scale all keyframe times by a factor (useful for frame <-> seconds conversions)
	scale: function( timeScale ) {

		if( timeScale !== 1.0 ) {

			var times = this.times;

			for( var i = 0, n = times.length; i !== n; ++ i ) {

				times[ i ] *= timeScale;

			}

		}

		return this;

	},

	// removes keyframes before and after animation without changing any values within the range [startTime, endTime].
	// IMPORTANT: We do not shift around keys to the start of the track time, because for interpolated keys this will change their values
	trim: function( startTime, endTime ) {

		var times = this.times,
			nKeys = times.length,
			from = 0,
			to = nKeys - 1;

		while ( from !== nKeys && times[ from ] < startTime ) ++ from;
		while ( to !== -1 && times[ to ] > endTime ) -- to;

		++ to; // inclusive -> exclusive bound

		if( from !== 0 || to !== nKeys ) {

			// empty tracks are forbidden, so keep at least one keyframe
			if ( from >= to ) to = Math.max( to , 1 ), from = to - 1;

			var stride = this.getValueSize();
			this.times = THREE.AnimationUtils.arraySlice( times, from, to );
			this.values = THREE.AnimationUtils.
					arraySlice( this.values, from * stride, to * stride );

		}

		return this;

	},

	// ensure we do not get a GarbageInGarbageOut situation, make sure tracks are at least minimally viable
	validate: function() {

		var valid = true;

		var valueSize = this.getValueSize();
		if ( valueSize - Math.floor( valueSize ) !== 0 ) {

			console.error( "invalid value size in track", this );
			valid = false;

		}

		var times = this.times,
			values = this.values,

			nKeys = times.length;

		if( nKeys === 0 ) {

			console.error( "track is empty", this );
			valid = false;

		}

		var prevTime = null;

		for( var i = 0; i !== nKeys; i ++ ) {

			var currTime = times[ i ];

			if ( typeof currTime === 'number' && isNaN( currTime ) ) {

				console.error( "time is not a valid number", this, i, currTime );
				valid = false;
				break;

			}

			if( prevTime !== null && prevTime > currTime ) {

				console.error( "out of order keys", this, i, currTime, prevTime );
				valid = false;
				break;

			}

			prevTime = currTime;

		}

		if ( values !== undefined ) {

			if ( THREE.AnimationUtils.isTypedArray( values ) ) {

				for ( var i = 0, n = values.length; i !== n; ++ i ) {

					var value = values[ i ];

					if ( isNaN( value ) ) {

						console.error( "value is not a valid number", this, i, value );
						valid = false;
						break;

					}

				}

			}

		}

		return valid;

	},

	// removes equivalent sequential keys as common in morph target sequences
	// (0,0,0,0,1,1,1,0,0,0,0,0,0,0) --> (0,0,1,1,0,0)
	optimize: function() {

		var times = this.times,
			values = this.values,
			stride = this.getValueSize(),

			writeIndex = 1;

		for( var i = 1, n = times.length - 1; i <= n; ++ i ) {

			var keep = false;

			var time = times[ i ];
			var timeNext = times[ i + 1 ];

			// remove adjacent keyframes scheduled at the same time

			if ( time !== timeNext && ( i !== 1 || time !== time[ 0 ] ) ) {

				// remove unnecessary keyframes same as their neighbors
				var offset = i * stride,
					offsetP = offset - stride,
					offsetN = offset + stride;

				for ( var j = 0; j !== stride; ++ j ) {

					var value = values[ offset + j ];

					if ( value !== values[ offsetP + j ] ||
							value !== values[ offsetN + j ] ) {

						keep = true;
						break;

					}

				}

			}

			// in-place compaction

			if ( keep ) {

				if ( i !== writeIndex ) {

					times[ writeIndex ] = times[ i ];

					var readOffset = i * stride,
						writeOffset = writeIndex * stride;

					for ( var j = 0; j !== stride; ++ j ) {

						values[ writeOffset + j ] = values[ readOffset + j ];

					}


				}

				++ writeIndex;

			}

		}

		if ( writeIndex !== times.length ) {

			this.times = THREE.AnimationUtils.arraySlice( times, 0, writeIndex );
			this.values = THREE.AnimationUtils.arraySlice( values, 0, writeIndex * stride );

		}

		return this;

	}

};

// Static methods:

Object.assign( THREE.KeyframeTrack, {

	// Serialization (in static context, because of constructor invocation
	// and automatic invocation of .toJSON):

	parse: function( json ) {

		if( json.type === undefined ) {

			throw new Error( "track type undefined, can not parse" );

		}

		var trackType = THREE.KeyframeTrack._getTrackTypeForValueTypeName( json.type );

		if ( json.times === undefined ) {

			var times = [], values = [];

			THREE.AnimationUtils.flattenJSON( json.keys, times, values, 'value' );

			json.times = times;
			json.values = values;

		}

		// derived classes can define a static parse method
		if ( trackType.parse !== undefined ) {

			return trackType.parse( json );

		} else {

			// by default, we asssume a constructor compatible with the base
			return new trackType(
					json.name, json.times, json.values, json.interpolation );

		}

	},

	toJSON: function( track ) {

		var trackType = track.constructor;

		var json;

		// derived classes can define a static toJSON method
		if ( trackType.toJSON !== undefined ) {

			json = trackType.toJSON( track );

		} else {

			// by default, we assume the data can be serialized as-is
			json = {

				'name': track.name,
				'times': THREE.AnimationUtils.convertArray( track.times, Array ),
				'values': THREE.AnimationUtils.convertArray( track.values, Array )

			};

			var interpolation = track.getInterpolation();

			if ( interpolation !== track.DefaultInterpolation ) {

				json.interpolation = interpolation;

			}

		}

		json.type = track.ValueTypeName; // mandatory

		return json;

	},

	_getTrackTypeForValueTypeName: function( typeName ) {

		switch( typeName.toLowerCase() ) {

			case "scalar":
			case "double":
			case "float":
			case "number":
			case "integer":

				return THREE.NumberKeyframeTrack;

			case "vector":
			case "vector2":
			case "vector3":
			case "vector4":

				return THREE.VectorKeyframeTrack;

			case "color":

				return THREE.ColorKeyframeTrack;

			case "quaternion":

				return THREE.QuaternionKeyframeTrack;

			case "bool":
			case "boolean":

				return THREE.BooleanKeyframeTrack;

			case "string":

				return THREE.StringKeyframeTrack;

		}

		throw new Error( "Unsupported typeName: " + typeName );

	}

} );

// File:src/animation/PropertyBinding.js

/**
 *
 * A reference to a real property in the scene graph.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.PropertyBinding = function ( rootNode, path, parsedPath ) {

	this.path = path;
	this.parsedPath = parsedPath ||
			THREE.PropertyBinding.parseTrackName( path );

	this.node = THREE.PropertyBinding.findNode(
			rootNode, this.parsedPath.nodeName ) || rootNode;

	this.rootNode = rootNode;

};

THREE.PropertyBinding.prototype = {

	constructor: THREE.PropertyBinding,

	getValue: function getValue_unbound( targetArray, offset ) {

		this.bind();
		this.getValue( targetArray, offset );

		// Note: This class uses a State pattern on a per-method basis:
		// 'bind' sets 'this.getValue' / 'setValue' and shadows the
		// prototype version of these methods with one that represents
		// the bound state. When the property is not found, the methods
		// become no-ops.

	},

	setValue: function getValue_unbound( sourceArray, offset ) {

		this.bind();
		this.setValue( sourceArray, offset );

	},

	// create getter / setter pair for a property in the scene graph
	bind: function() {

		var targetObject = this.node,
			parsedPath = this.parsedPath,

			objectName = parsedPath.objectName,
			propertyName = parsedPath.propertyName,
			propertyIndex = parsedPath.propertyIndex;

		if ( ! targetObject ) {

			targetObject = THREE.PropertyBinding.findNode(
					this.rootNode, parsedPath.nodeName ) || this.rootNode;

			this.node = targetObject;

		}

		// set fail state so we can just 'return' on error
		this.getValue = this._getValue_unavailable;
		this.setValue = this._setValue_unavailable;

 		// ensure there is a value node
		if ( ! targetObject ) {

			console.error( "  trying to update node for track: " + this.path + " but it wasn't found." );
			return;

		}

		if( objectName ) {

			var objectIndex = parsedPath.objectIndex;

			// special cases were we need to reach deeper into the hierarchy to get the face materials....
			switch ( objectName ) {

				case 'materials':

					if( ! targetObject.material ) {

						console.error( '  can not bind to material as node does not have a material', this );
						return;

					}

					if( ! targetObject.material.materials ) {

						console.error( '  can not bind to material.materials as node.material does not have a materials array', this );
						return;

					}

					targetObject = targetObject.material.materials;

					break;

				case 'bones':

					if( ! targetObject.skeleton ) {

						console.error( '  can not bind to bones as node does not have a skeleton', this );
						return;

					}

					// potential future optimization: skip this if propertyIndex is already an integer
					// and convert the integer string to a true integer.

					targetObject = targetObject.skeleton.bones;

					// support resolving morphTarget names into indices.
					for ( var i = 0; i < targetObject.length; i ++ ) {

						if ( targetObject[i].name === objectIndex ) {

							objectIndex = i;
							break;

						}

					}

					break;

				default:

					if ( targetObject[ objectName ] === undefined ) {

						console.error( '  can not bind to objectName of node, undefined', this );
						return;

					}

					targetObject = targetObject[ objectName ];

			}


			if ( objectIndex !== undefined ) {

				if( targetObject[ objectIndex ] === undefined ) {

					console.error( "  trying to bind to objectIndex of objectName, but is undefined:", this, targetObject );
					return;

				}

				targetObject = targetObject[ objectIndex ];

			}

		}

		// resolve property
		var nodeProperty = targetObject[ propertyName ];

		if ( ! nodeProperty ) {

			var nodeName = parsedPath.nodeName;

			console.error( "  trying to update property for track: " + nodeName +
					'.' + propertyName + " but it wasn't found.", targetObject );
			return;

		}

		// determine versioning scheme
		var versioning = this.Versioning.None;

		if ( targetObject.needsUpdate !== undefined ) { // material

			versioning = this.Versioning.NeedsUpdate;
			this.targetObject = targetObject;

		} else if ( targetObject.matrixWorldNeedsUpdate !== undefined ) { // node transform

			versioning = this.Versioning.MatrixWorldNeedsUpdate;
			this.targetObject = targetObject;

		}

		// determine how the property gets bound
		var bindingType = this.BindingType.Direct;

		if ( propertyIndex !== undefined ) {
			// access a sub element of the property array (only primitives are supported right now)

			if ( propertyName === "morphTargetInfluences" ) {
				// potential optimization, skip this if propertyIndex is already an integer, and convert the integer string to a true integer.

				// support resolving morphTarget names into indices.
				if ( ! targetObject.geometry ) {

					console.error( '  can not bind to morphTargetInfluences becasuse node does not have a geometry', this );
					return;

				}

				if ( ! targetObject.geometry.morphTargets ) {

					console.error( '  can not bind to morphTargetInfluences becasuse node does not have a geometry.morphTargets', this );
					return;

				}

				for ( var i = 0; i < this.node.geometry.morphTargets.length; i ++ ) {

					if ( targetObject.geometry.morphTargets[i].name === propertyIndex ) {

						propertyIndex = i;
						break;

					}

				}

			}

			bindingType = this.BindingType.ArrayElement;

			this.resolvedProperty = nodeProperty;
			this.propertyIndex = propertyIndex;

		} else if ( nodeProperty.fromArray !== undefined && nodeProperty.toArray !== undefined ) {
			// must use copy for Object3D.Euler/Quaternion

			bindingType = this.BindingType.HasFromToArray;

			this.resolvedProperty = nodeProperty;

		} else if ( nodeProperty.length !== undefined ) {

			bindingType = this.BindingType.EntireArray;

			this.resolvedProperty = nodeProperty;

		} else {

			this.propertyName = propertyName;

		}

		// select getter / setter
		this.getValue = this.GetterByBindingType[ bindingType ];
		this.setValue = this.SetterByBindingTypeAndVersioning[ bindingType ][ versioning ];

	},

	unbind: function() {

		this.node = null;

		// back to the prototype version of getValue / setValue
		// note: avoiding to mutate the shape of 'this' via 'delete'
		this.getValue = this._getValue_unbound;
		this.setValue = this._setValue_unbound;

	}

};

Object.assign( THREE.PropertyBinding.prototype, { // prototype, continued

	// these are used to "bind" a nonexistent property
	_getValue_unavailable: function() {},
	_setValue_unavailable: function() {},

	// initial state of these methods that calls 'bind'
	_getValue_unbound: THREE.PropertyBinding.prototype.getValue,
	_setValue_unbound: THREE.PropertyBinding.prototype.setValue,

	BindingType: {
		Direct: 0,
		EntireArray: 1,
		ArrayElement: 2,
		HasFromToArray: 3
	},

	Versioning: {
		None: 0,
		NeedsUpdate: 1,
		MatrixWorldNeedsUpdate: 2
	},

	GetterByBindingType: [

		function getValue_direct( buffer, offset ) {

			buffer[ offset ] = this.node[ this.propertyName ];

		},

		function getValue_array( buffer, offset ) {

			var source = this.resolvedProperty;

			for ( var i = 0, n = source.length; i !== n; ++ i ) {

				buffer[ offset ++ ] = source[ i ];

			}

		},

		function getValue_arrayElement( buffer, offset ) {

			buffer[ offset ] = this.resolvedProperty[ this.propertyIndex ];

		},

		function getValue_toArray( buffer, offset ) {

			this.resolvedProperty.toArray( buffer, offset );

		}

	],

	SetterByBindingTypeAndVersioning: [

		[
			// Direct

			function setValue_direct( buffer, offset ) {

				this.node[ this.propertyName ] = buffer[ offset ];

			},

			function setValue_direct_setNeedsUpdate( buffer, offset ) {

				this.node[ this.propertyName ] = buffer[ offset ];
				this.targetObject.needsUpdate = true;

			},

			function setValue_direct_setMatrixWorldNeedsUpdate( buffer, offset ) {

				this.node[ this.propertyName ] = buffer[ offset ];
				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		], [

			// EntireArray

			function setValue_array( buffer, offset ) {

				var dest = this.resolvedProperty;

				for ( var i = 0, n = dest.length; i !== n; ++ i ) {

					dest[ i ] = buffer[ offset ++ ];

				}

			},

			function setValue_array_setNeedsUpdate( buffer, offset ) {

				var dest = this.resolvedProperty;

				for ( var i = 0, n = dest.length; i !== n; ++ i ) {

					dest[ i ] = buffer[ offset ++ ];

				}

				this.targetObject.needsUpdate = true;

			},

			function setValue_array_setMatrixWorldNeedsUpdate( buffer, offset ) {

				var dest = this.resolvedProperty;

				for ( var i = 0, n = dest.length; i !== n; ++ i ) {

					dest[ i ] = buffer[ offset ++ ];

				}

				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		], [

			// ArrayElement

			function setValue_arrayElement( buffer, offset ) {

				this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];

			},

			function setValue_arrayElement_setNeedsUpdate( buffer, offset ) {

				this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
				this.targetObject.needsUpdate = true;

			},

			function setValue_arrayElement_setMatrixWorldNeedsUpdate( buffer, offset ) {

				this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		], [

			// HasToFromArray

			function setValue_fromArray( buffer, offset ) {

				this.resolvedProperty.fromArray( buffer, offset );

			},

			function setValue_fromArray_setNeedsUpdate( buffer, offset ) {

				this.resolvedProperty.fromArray( buffer, offset );
				this.targetObject.needsUpdate = true;

			},

			function setValue_fromArray_setMatrixWorldNeedsUpdate( buffer, offset ) {

				this.resolvedProperty.fromArray( buffer, offset );
				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		]

	]

} );

THREE.PropertyBinding.Composite =
		function( targetGroup, path, optionalParsedPath ) {

	var parsedPath = optionalParsedPath ||
			THREE.PropertyBinding.parseTrackName( path );

	this._targetGroup = targetGroup;
	this._bindings = targetGroup.subscribe_( path, parsedPath );

};

THREE.PropertyBinding.Composite.prototype = {

	constructor: THREE.PropertyBinding.Composite,

	getValue: function( array, offset ) {

		this.bind(); // bind all binding

		var firstValidIndex = this._targetGroup.nCachedObjects_,
			binding = this._bindings[ firstValidIndex ];

		// and only call .getValue on the first
		if ( binding !== undefined ) binding.getValue( array, offset );

	},

	setValue: function( array, offset ) {

		var bindings = this._bindings;

		for ( var i = this._targetGroup.nCachedObjects_,
				n = bindings.length; i !== n; ++ i ) {

			bindings[ i ].setValue( array, offset );

		}

	},

	bind: function() {

		var bindings = this._bindings;

		for ( var i = this._targetGroup.nCachedObjects_,
				n = bindings.length; i !== n; ++ i ) {

			bindings[ i ].bind();

		}

	},

	unbind: function() {

		var bindings = this._bindings;

		for ( var i = this._targetGroup.nCachedObjects_,
				n = bindings.length; i !== n; ++ i ) {

			bindings[ i ].unbind();

		}

	}

};

THREE.PropertyBinding.create = function( root, path, parsedPath ) {

	if ( ! ( root instanceof THREE.AnimationObjectGroup ) ) {

		return new THREE.PropertyBinding( root, path, parsedPath );

	} else {

		return new THREE.PropertyBinding.Composite( root, path, parsedPath );

	}

};

THREE.PropertyBinding.parseTrackName = function( trackName ) {

	// matches strings in the form of:
	//    nodeName.property
	//    nodeName.property[accessor]
	//    nodeName.material.property[accessor]
	//    uuid.property[accessor]
	//    uuid.objectName[objectIndex].propertyName[propertyIndex]
	//    parentName/nodeName.property
	//    parentName/parentName/nodeName.property[index]
	//	  .bone[Armature.DEF_cog].position
	// created and tested via https://regex101.com/#javascript

	var re = /^(([\w]+\/)*)([\w-\d]+)?(\.([\w]+)(\[([\w\d\[\]\_.:\- ]+)\])?)?(\.([\w.]+)(\[([\w\d\[\]\_. ]+)\])?)$/;
	var matches = re.exec(trackName);

	if( ! matches ) {
		throw new Error( "cannot parse trackName at all: " + trackName );
	}

    if (matches.index === re.lastIndex) {
        re.lastIndex++;
    }

	var results = {
		// directoryName: matches[1], // (tschw) currently unused
		nodeName: matches[3], 	// allowed to be null, specified root node.
		objectName: matches[5],
		objectIndex: matches[7],
		propertyName: matches[9],
		propertyIndex: matches[11]	// allowed to be null, specifies that the whole property is set.
	};

	if( results.propertyName === null || results.propertyName.length === 0 ) {
		throw new Error( "can not parse propertyName from trackName: " + trackName );
	}

	return results;

};

THREE.PropertyBinding.findNode = function( root, nodeName ) {

	if( ! nodeName || nodeName === "" || nodeName === "root" || nodeName === "." || nodeName === -1 || nodeName === root.name || nodeName === root.uuid ) {

		return root;

	}

	// search into skeleton bones.
	if( root.skeleton ) {

		var searchSkeleton = function( skeleton ) {

			for( var i = 0; i < skeleton.bones.length; i ++ ) {

				var bone = skeleton.bones[i];

				if( bone.name === nodeName ) {

					return bone;

				}
			}

			return null;

		};

		var bone = searchSkeleton( root.skeleton );

		if( bone ) {

			return bone;

		}
	}

	// search into node subtree.
	if( root.children ) {

		var searchNodeSubtree = function( children ) {

			for( var i = 0; i < children.length; i ++ ) {

				var childNode = children[i];

				if( childNode.name === nodeName || childNode.uuid === nodeName ) {

					return childNode;

				}

				var result = searchNodeSubtree( childNode.children );

				if( result ) return result;

			}

			return null;

		};

		var subTreeNode = searchNodeSubtree( root.children );

		if( subTreeNode ) {

			return subTreeNode;

		}

	}

	return null;

};

// File:src/animation/PropertyMixer.js

/**
 *
 * Buffered scene graph property that allows weighted accumulation.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.PropertyMixer = function ( binding, typeName, valueSize ) {

	this.binding = binding;
	this.valueSize = valueSize;

	var bufferType = Float64Array,
		mixFunction;

	switch ( typeName ) {

		case 'quaternion':			mixFunction = this._slerp;		break;

		case 'string':
		case 'bool':

			bufferType = Array,		mixFunction = this._select;		break;

		default:					mixFunction = this._lerp;

	}

	this.buffer = new bufferType( valueSize * 4 );
	// layout: [ incoming | accu0 | accu1 | orig ]
	//
	// interpolators can use .buffer as their .result
	// the data then goes to 'incoming'
	//
	// 'accu0' and 'accu1' are used frame-interleaved for
	// the cumulative result and are compared to detect
	// changes
	//
	// 'orig' stores the original state of the property

	this._mixBufferRegion = mixFunction;

	this.cumulativeWeight = 0;

	this.useCount = 0;
	this.referenceCount = 0;

};

THREE.PropertyMixer.prototype = {

	constructor: THREE.PropertyMixer,

	// accumulate data in the 'incoming' region into 'accu<i>'
	accumulate: function( accuIndex, weight ) {

		// note: happily accumulating nothing when weight = 0, the caller knows
		// the weight and shouldn't have made the call in the first place

		var buffer = this.buffer,
			stride = this.valueSize,
			offset = accuIndex * stride + stride,

			currentWeight = this.cumulativeWeight;

		if ( currentWeight === 0 ) {

			// accuN := incoming * weight

			for ( var i = 0; i !== stride; ++ i ) {

				buffer[ offset + i ] = buffer[ i ];

			}

			currentWeight = weight;

		} else {

			// accuN := accuN + incoming * weight

			currentWeight += weight;
			var mix = weight / currentWeight;
			this._mixBufferRegion( buffer, offset, 0, mix, stride );

		}

		this.cumulativeWeight = currentWeight;

	},

	// apply the state of 'accu<i>' to the binding when accus differ
	apply: function( accuIndex ) {

		var stride = this.valueSize,
			buffer = this.buffer,
			offset = accuIndex * stride + stride,

			weight = this.cumulativeWeight,

			binding = this.binding;

		this.cumulativeWeight = 0;

		if ( weight < 1 ) {

			// accuN := accuN + original * ( 1 - cumulativeWeight )

			var originalValueOffset = stride * 3;

			this._mixBufferRegion(
					buffer, offset, originalValueOffset, 1 - weight, stride );

		}

		for ( var i = stride, e = stride + stride; i !== e; ++ i ) {

			if ( buffer[ i ] !== buffer[ i + stride ] ) {

				// value has changed -> update scene graph

				binding.setValue( buffer, offset );
				break;

			}

		}

	},

	// remember the state of the bound property and copy it to both accus
	saveOriginalState: function() {

		var binding = this.binding;

		var buffer = this.buffer,
			stride = this.valueSize,

			originalValueOffset = stride * 3;

		binding.getValue( buffer, originalValueOffset );

		// accu[0..1] := orig -- initially detect changes against the original
		for ( var i = stride, e = originalValueOffset; i !== e; ++ i ) {

			buffer[ i ] = buffer[ originalValueOffset + ( i % stride ) ];

		}

		this.cumulativeWeight = 0;

	},

	// apply the state previously taken via 'saveOriginalState' to the binding
	restoreOriginalState: function() {

		var originalValueOffset = this.valueSize * 3;
		this.binding.setValue( this.buffer, originalValueOffset );

	},


	// mix functions

	_select: function( buffer, dstOffset, srcOffset, t, stride ) {

		if ( t >= 0.5 ) {

			for ( var i = 0; i !== stride; ++ i ) {

				buffer[ dstOffset + i ] = buffer[ srcOffset + i ];

			}

		}

	},

	_slerp: function( buffer, dstOffset, srcOffset, t, stride ) {

		THREE.Quaternion.slerpFlat( buffer, dstOffset,
				buffer, dstOffset, buffer, srcOffset, t );

	},

	_lerp: function( buffer, dstOffset, srcOffset, t, stride ) {

		var s = 1 - t;

		for ( var i = 0; i !== stride; ++ i ) {

			var j = dstOffset + i;

			buffer[ j ] = buffer[ j ] * s + buffer[ srcOffset + i ] * t;

		}

	}

};

// File:src/animation/tracks/BooleanKeyframeTrack.js

/**
 *
 * A Track of Boolean keyframe values.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.BooleanKeyframeTrack = function ( name, times, values ) {

	THREE.KeyframeTrack.call( this, name, times, values );

};

THREE.BooleanKeyframeTrack.prototype =
		Object.assign( Object.create( THREE.KeyframeTrack.prototype ), {

	constructor: THREE.BooleanKeyframeTrack,

	ValueTypeName: 'bool',
	ValueBufferType: Array,

	DefaultInterpolation: THREE.InterpolateDiscrete,

	InterpolantFactoryMethodLinear: undefined,
	InterpolantFactoryMethodSmooth: undefined

	// Note: Actually this track could have a optimized / compressed
	// representation of a single value and a custom interpolant that
	// computes "firstValue ^ isOdd( index )".

} );

// File:src/animation/tracks/ColorKeyframeTrack.js

/**
 *
 * A Track of keyframe values that represent color.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.ColorKeyframeTrack = function ( name, times, values, interpolation ) {

	THREE.KeyframeTrack.call( this, name, times, values, interpolation );

};

THREE.ColorKeyframeTrack.prototype =
		Object.assign( Object.create( THREE.KeyframeTrack.prototype ), {

	constructor: THREE.ColorKeyframeTrack,

	ValueTypeName: 'color'

	// ValueBufferType is inherited

	// DefaultInterpolation is inherited


	// Note: Very basic implementation and nothing special yet.
	// However, this is the place for color space parameterization.

} );

// File:src/animation/tracks/NumberKeyframeTrack.js

/**
 *
 * A Track of numeric keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.NumberKeyframeTrack = function ( name, times, values, interpolation ) {

	THREE.KeyframeTrack.call( this, name, times, values, interpolation );

};

THREE.NumberKeyframeTrack.prototype =
		Object.assign( Object.create( THREE.KeyframeTrack.prototype ), {

	constructor: THREE.NumberKeyframeTrack,

	ValueTypeName: 'number',

	// ValueBufferType is inherited

	// DefaultInterpolation is inherited

} );

// File:src/animation/tracks/QuaternionKeyframeTrack.js

/**
 *
 * A Track of quaternion keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.QuaternionKeyframeTrack = function ( name, times, values, interpolation ) {

	THREE.KeyframeTrack.call( this, name, times, values, interpolation );

};

THREE.QuaternionKeyframeTrack.prototype =
		Object.assign( Object.create( THREE.KeyframeTrack.prototype ), {

	constructor: THREE.QuaternionKeyframeTrack,

	ValueTypeName: 'quaternion',

	// ValueBufferType is inherited

	DefaultInterpolation: THREE.InterpolateLinear,

	InterpolantFactoryMethodLinear: function( result ) {

		return new THREE.QuaternionLinearInterpolant(
				this.times, this.values, this.getValueSize(), result );

	},

	InterpolantFactoryMethodSmooth: undefined // not yet implemented

} );

// File:src/animation/tracks/StringKeyframeTrack.js

/**
 *
 * A Track that interpolates Strings
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.StringKeyframeTrack = function ( name, times, values, interpolation ) {

	THREE.KeyframeTrack.call( this, name, times, values, interpolation );

};

THREE.StringKeyframeTrack.prototype =
		Object.assign( Object.create( THREE.KeyframeTrack.prototype ), {

	constructor: THREE.StringKeyframeTrack,

	ValueTypeName: 'string',
	ValueBufferType: Array,

	DefaultInterpolation: THREE.InterpolateDiscrete,

	InterpolantFactoryMethodLinear: undefined,

	InterpolantFactoryMethodSmooth: undefined

} );

// File:src/animation/tracks/VectorKeyframeTrack.js

/**
 *
 * A Track of vectored keyframe values.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

THREE.VectorKeyframeTrack = function ( name, times, values, interpolation ) {

	THREE.KeyframeTrack.call( this, name, times, values, interpolation );

};

THREE.VectorKeyframeTrack.prototype =
		Object.assign( Object.create( THREE.KeyframeTrack.prototype ), {

	constructor: THREE.VectorKeyframeTrack,

	ValueTypeName: 'vector'

	// ValueBufferType is inherited

	// DefaultInterpolation is inherited

} );

// File:src/audio/Audio.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

THREE.Audio = function ( listener ) {

	THREE.Object3D.call( this );

	this.type = 'Audio';

	this.context = listener.context;
	this.source = this.context.createBufferSource();
	this.source.onended = this.onEnded.bind( this );

	this.gain = this.context.createGain();
	this.gain.connect( listener.getInput() );

	this.autoplay = false;

	this.startTime = 0;
	this.playbackRate = 1;
	this.isPlaying = false;
	this.hasPlaybackControl = true;
	this.sourceType = 'empty';

	this.filters = [];

};

THREE.Audio.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Audio,

	getOutput: function () {

		return this.gain;

	},

	setNodeSource: function ( audioNode ) {

		this.hasPlaybackControl = false;
		this.sourceType = 'audioNode';
		this.source = audioNode;
		this.connect();

		return this;

	},

	setBuffer: function ( audioBuffer ) {

		this.source.buffer = audioBuffer;
		this.sourceType = 'buffer';

		if ( this.autoplay ) this.play();

		return this;

	},

	play: function () {

		if ( this.isPlaying === true ) {

			console.warn( 'THREE.Audio: Audio is already playing.' );
			return;

		}

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		var source = this.context.createBufferSource();

		source.buffer = this.source.buffer;
		source.loop = this.source.loop;
		source.onended = this.source.onended;
		source.start( 0, this.startTime );
		source.playbackRate.value = this.playbackRate;

		this.isPlaying = true;

		this.source = source;

		return this.connect();

	},

	pause: function () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.source.stop();
		this.startTime = this.context.currentTime;

		return this;

	},

	stop: function () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.source.stop();
		this.startTime = 0;

		return this;

	},

	connect: function () {

		if ( this.filters.length > 0 ) {

			this.source.connect( this.filters[ 0 ] );

			for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

				this.filters[ i - 1 ].connect( this.filters[ i ] );

			}

			this.filters[ this.filters.length - 1 ].connect( this.getOutput() );

		} else {

			this.source.connect( this.getOutput() );

		}

		return this;

	},

	disconnect: function () {

		if ( this.filters.length > 0 ) {

			this.source.disconnect( this.filters[ 0 ] );

			for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

				this.filters[ i - 1 ].disconnect( this.filters[ i ] );

			}

			this.filters[ this.filters.length - 1 ].disconnect( this.getOutput() );

		} else {

			this.source.disconnect( this.getOutput() );

		}

		return this;

	},

	getFilters: function () {

		return this.filters;

	},

	setFilters: function ( value ) {

		if ( ! value ) value = [];

		if ( this.isPlaying === true ) {

			this.disconnect();
			this.filters = value;
			this.connect();

		} else {

			this.filters = value;

		}

		return this;

	},

	getFilter: function () {

		return this.getFilters()[ 0 ];

	},

	setFilter: function ( filter ) {

		return this.setFilters( filter ? [ filter ] : [] );

	},

	setPlaybackRate: function ( value ) {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.playbackRate = value;

		if ( this.isPlaying === true ) {

			this.source.playbackRate.value = this.playbackRate;

		}

		return this;

	},

	getPlaybackRate: function () {

		return this.playbackRate;

	},

	onEnded: function () {

		this.isPlaying = false;

	},

	getLoop: function () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return false;

		}

		return this.source.loop;

	},

	setLoop: function ( value ) {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.source.loop = value;

	},

	getVolume: function () {

		return this.gain.gain.value;

	},


	setVolume: function ( value ) {

		this.gain.gain.value = value;

		return this;

	}

} );

// File:src/audio/AudioAnalyser.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AudioAnalyser = function ( audio, fftSize ) {

	this.analyser = audio.context.createAnalyser();
	this.analyser.fftSize = fftSize !== undefined ? fftSize : 2048;

	this.data = new Uint8Array( this.analyser.frequencyBinCount );

	audio.getOutput().connect( this.analyser );

};

Object.assign( THREE.AudioAnalyser.prototype, {

	getFrequencyData: function () {

		this.analyser.getByteFrequencyData( this.data );

		return this.data;

	},

	getAverageFrequency: function () {

		var value = 0, data = this.getFrequencyData();

		for ( var i = 0; i < data.length; i ++ ) {

			value += data[ i ];

		}

		return value / data.length;

	}

} );

// File:src/audio/AudioContext.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Object.defineProperty( THREE, 'AudioContext', {

	get: ( function () {

		var context;

		return function () {

			if ( context === undefined ) {

				context = new ( window.AudioContext || window.webkitAudioContext )();

			}

			return context;

		};

	} )()

} );

// File:src/audio/PositionalAudio.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PositionalAudio = function ( listener ) {

	THREE.Audio.call( this, listener );

	this.panner = this.context.createPanner();
	this.panner.connect( this.gain );

};

THREE.PositionalAudio.prototype = Object.assign( Object.create( THREE.Audio.prototype ), {

	constructor: THREE.PositionalAudio,

	getOutput: function () {

		return this.panner;

	},

	getRefDistance: function () {

		return this.panner.refDistance;

	},

	setRefDistance: function ( value ) {

		this.panner.refDistance = value;

	},

	getRolloffFactor: function () {

		return this.panner.rolloffFactor;

	},

	setRolloffFactor: function ( value ) {

		this.panner.rolloffFactor = value;

	},

	getDistanceModel: function () {

		return this.panner.distanceModel;

	},

	setDistanceModel: function ( value ) {

		this.panner.distanceModel = value;

	},

	getMaxDistance: function () {

		return this.panner.maxDistance;

	},

	setMaxDistance: function ( value ) {

		this.panner.maxDistance = value;

	},

	updateMatrixWorld: ( function () {

		var position = new THREE.Vector3();

		return function updateMatrixWorld( force ) {

			THREE.Object3D.prototype.updateMatrixWorld.call( this, force );

			position.setFromMatrixPosition( this.matrixWorld );

			this.panner.setPosition( position.x, position.y, position.z );

		};

	} )()


} );

// File:src/audio/AudioListener.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AudioListener = function () {

	THREE.Object3D.call( this );

	this.type = 'AudioListener';

	this.context = THREE.AudioContext;

	this.gain = this.context.createGain();
	this.gain.connect( this.context.destination );

	this.filter = null;

};

THREE.AudioListener.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.AudioListener,

	getInput: function () {

		return this.gain;

	},

	removeFilter: function ( ) {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );
			this.gain.connect( this.context.destination );
			this.filter = null;

		}

	},

	getFilter: function () {

		return this.filter;

	},

	setFilter: function ( value ) {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );

		} else {

			this.gain.disconnect( this.context.destination );

		}

		this.filter = value;
		this.gain.connect( this.filter );
		this.filter.connect( this.context.destination );

	},

	getMasterVolume: function () {

		return this.gain.gain.value;

	},

	setMasterVolume: function ( value ) {

		this.gain.gain.value = value;

	},

	updateMatrixWorld: ( function () {

		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();
		var scale = new THREE.Vector3();

		var orientation = new THREE.Vector3();

		return function updateMatrixWorld( force ) {

			THREE.Object3D.prototype.updateMatrixWorld.call( this, force );

			var listener = this.context.listener;
			var up = this.up;

			this.matrixWorld.decompose( position, quaternion, scale );

			orientation.set( 0, 0, - 1 ).applyQuaternion( quaternion );

			listener.setPosition( position.x, position.y, position.z );
			listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

		};

	} )()

} );

// File:src/cameras/Camera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.Camera = function () {

	THREE.Object3D.call( this );

	this.type = 'Camera';

	this.matrixWorldInverse = new THREE.Matrix4();
	this.projectionMatrix = new THREE.Matrix4();

};

THREE.Camera.prototype = Object.create( THREE.Object3D.prototype );
THREE.Camera.prototype.constructor = THREE.Camera;

THREE.Camera.prototype.getWorldDirection = function () {

	var quaternion = new THREE.Quaternion();

	return function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.getWorldQuaternion( quaternion );

		return result.set( 0, 0, - 1 ).applyQuaternion( quaternion );

	};

}();

THREE.Camera.prototype.lookAt = function () {

	// This routine does not support cameras with rotated and/or translated parent(s)

	var m1 = new THREE.Matrix4();

	return function ( vector ) {

		m1.lookAt( this.position, vector, this.up );

		this.quaternion.setFromRotationMatrix( m1 );

	};

}();

THREE.Camera.prototype.clone = function () {

	return new this.constructor().copy( this );

};

THREE.Camera.prototype.copy = function ( source ) {

	THREE.Object3D.prototype.copy.call( this, source );

	this.matrixWorldInverse.copy( source.matrixWorldInverse );
	this.projectionMatrix.copy( source.projectionMatrix );

	return this;

};

// File:src/cameras/CubeCamera.js

/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CubeCamera = function ( near, far, cubeResolution ) {

	THREE.Object3D.call( this );

	this.type = 'CubeCamera';

	var fov = 90, aspect = 1;

	var cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPX.up.set( 0, - 1, 0 );
	cameraPX.lookAt( new THREE.Vector3( 1, 0, 0 ) );
	this.add( cameraPX );

	var cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNX.up.set( 0, - 1, 0 );
	cameraNX.lookAt( new THREE.Vector3( - 1, 0, 0 ) );
	this.add( cameraNX );

	var cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPY.up.set( 0, 0, 1 );
	cameraPY.lookAt( new THREE.Vector3( 0, 1, 0 ) );
	this.add( cameraPY );

	var cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNY.up.set( 0, 0, - 1 );
	cameraNY.lookAt( new THREE.Vector3( 0, - 1, 0 ) );
	this.add( cameraNY );

	var cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPZ.up.set( 0, - 1, 0 );
	cameraPZ.lookAt( new THREE.Vector3( 0, 0, 1 ) );
	this.add( cameraPZ );

	var cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNZ.up.set( 0, - 1, 0 );
	cameraNZ.lookAt( new THREE.Vector3( 0, 0, - 1 ) );
	this.add( cameraNZ );

	var options = { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter };

	this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, options );

	this.updateCubeMap = function ( renderer, scene ) {

		if ( this.parent === null ) this.updateMatrixWorld();

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.texture.generateMipmaps;

		renderTarget.texture.generateMipmaps = false;

		renderTarget.activeCubeFace = 0;
		renderer.render( scene, cameraPX, renderTarget );

		renderTarget.activeCubeFace = 1;
		renderer.render( scene, cameraNX, renderTarget );

		renderTarget.activeCubeFace = 2;
		renderer.render( scene, cameraPY, renderTarget );

		renderTarget.activeCubeFace = 3;
		renderer.render( scene, cameraNY, renderTarget );

		renderTarget.activeCubeFace = 4;
		renderer.render( scene, cameraPZ, renderTarget );

		renderTarget.texture.generateMipmaps = generateMipmaps;

		renderTarget.activeCubeFace = 5;
		renderer.render( scene, cameraNZ, renderTarget );

		renderer.setRenderTarget( null );

	};

};

THREE.CubeCamera.prototype = Object.create( THREE.Object3D.prototype );
THREE.CubeCamera.prototype.constructor = THREE.CubeCamera;

// File:src/cameras/OrthographicCamera.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.OrthographicCamera = function ( left, right, top, bottom, near, far ) {

	THREE.Camera.call( this );

	this.type = 'OrthographicCamera';

	this.zoom = 1;

	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.near = ( near !== undefined ) ? near : 0.1;
	this.far = ( far !== undefined ) ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.OrthographicCamera.prototype = Object.assign( Object.create( THREE.Camera.prototype ), {

	constructor: THREE.OrthographicCamera,

	copy: function ( source ) {

		THREE.Camera.prototype.copy.call( this, source );

		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;

		this.zoom = source.zoom;

		return this;

	},

	updateProjectionMatrix: function () {

		var dx = ( this.right - this.left ) / ( 2 * this.zoom );
		var dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
		var cx = ( this.right + this.left ) / 2;
		var cy = ( this.top + this.bottom ) / 2;

		this.projectionMatrix.makeOrthographic( cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far );

	},

	toJSON: function ( meta ) {

		var data = THREE.Object3D.prototype.toJSON.call( this, meta );

		data.object.zoom = this.zoom;
		data.object.left = this.left;
		data.object.right = this.right;
		data.object.top = this.top;
		data.object.bottom = this.bottom;
		data.object.near = this.near;
		data.object.far = this.far;

		return data;

	}

} );

// File:src/cameras/PerspectiveCamera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author tschw
 */

THREE.PerspectiveCamera = function( fov, aspect, near, far ) {

	THREE.Camera.call( this );

	this.type = 'PerspectiveCamera';

	this.fov = fov !== undefined ? fov : 50;
	this.zoom = 1;

	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;
	this.focus = 10;

	this.aspect = aspect !== undefined ? aspect : 1;
	this.view = null;

	this.filmGauge = 35;	// width of the film (default in millimeters)
	this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype = Object.assign( Object.create( THREE.Camera.prototype ), {

	constructor: THREE.PerspectiveCamera,

	copy: function ( source ) {

		THREE.Camera.prototype.copy.call( this, source );

		this.fov = source.fov;
		this.zoom = source.zoom;

		this.near = source.near;
		this.far = source.far;
		this.focus = source.focus;

		this.aspect = source.aspect;
		this.view = source.view === null ? null : Object.assign( {}, source.view );

		this.filmGauge = source.filmGauge;
		this.filmOffset = source.filmOffset;

		return this;

	},

	/**
	 * Sets the FOV by focal length in respect to the current .filmGauge.
	 *
	 * The default film gauge is 35, so that the focal length can be specified for
	 * a 35mm (full frame) camera.
	 *
	 * Values for focal length and film gauge must have the same unit.
	 */
	setFocalLength: function ( focalLength ) {

		// see http://www.bobatkins.com/photography/technical/field_of_view.html
		var vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;

		this.fov = THREE.Math.RAD2DEG * 2 * Math.atan( vExtentSlope );
		this.updateProjectionMatrix();

	},

	/**
	 * Calculates the focal length from the current .fov and .filmGauge.
	 */
	getFocalLength: function () {

		var vExtentSlope = Math.tan( THREE.Math.DEG2RAD * 0.5 * this.fov );

		return 0.5 * this.getFilmHeight() / vExtentSlope;

	},

	getEffectiveFOV: function () {

		return THREE.Math.RAD2DEG * 2 * Math.atan(
				Math.tan( THREE.Math.DEG2RAD * 0.5 * this.fov ) / this.zoom );

	},

	getFilmWidth: function () {

		// film not completely covered in portrait format (aspect < 1)
		return this.filmGauge * Math.min( this.aspect, 1 );

	},

	getFilmHeight: function () {

		// film not completely covered in landscape format (aspect > 1)
		return this.filmGauge / Math.max( this.aspect, 1 );

	},

	/**
	 * Sets an offset in a larger frustum. This is useful for multi-window or
	 * multi-monitor/multi-machine setups.
	 *
	 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
	 * the monitors are in grid like this
	 *
	 *   +---+---+---+
	 *   | A | B | C |
	 *   +---+---+---+
	 *   | D | E | F |
	 *   +---+---+---+
	 *
	 * then for each monitor you would call it like this
	 *
	 *   var w = 1920;
	 *   var h = 1080;
	 *   var fullWidth = w * 3;
	 *   var fullHeight = h * 2;
	 *
	 *   --A--
	 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
	 *   --B--
	 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
	 *   --C--
	 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
	 *   --D--
	 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
	 *   --E--
	 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
	 *   --F--
	 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
	 *
	 *   Note there is no reason monitors have to be the same size or in a grid.
	 */
	setViewOffset: function ( fullWidth, fullHeight, x, y, width, height ) {

		this.aspect = fullWidth / fullHeight;

		this.view = {
			fullWidth: fullWidth,
			fullHeight: fullHeight,
			offsetX: x,
			offsetY: y,
			width: width,
			height: height
		};

		this.updateProjectionMatrix();

	},

	clearViewOffset: function() {

		this.view = null;
		this.updateProjectionMatrix();

	},

	updateProjectionMatrix: function () {

		var near = this.near,
			top = near * Math.tan(
					THREE.Math.DEG2RAD * 0.5 * this.fov ) / this.zoom,
			height = 2 * top,
			width = this.aspect * height,
			left = - 0.5 * width,
			view = this.view;

		if ( view !== null ) {

			var fullWidth = view.fullWidth,
				fullHeight = view.fullHeight;

			left += view.offsetX * width / fullWidth;
			top -= view.offsetY * height / fullHeight;
			width *= view.width / fullWidth;
			height *= view.height / fullHeight;

		}

		var skew = this.filmOffset;
		if ( skew !== 0 ) left += near * skew / this.getFilmWidth();

		this.projectionMatrix.makeFrustum(
				left, left + width, top - height, top, near, this.far );

	},

	toJSON: function ( meta ) {

		var data = THREE.Object3D.prototype.toJSON.call( this, meta );

		data.object.fov = this.fov;
		data.object.zoom = this.zoom;

		data.object.near = this.near;
		data.object.far = this.far;
		data.object.focus = this.focus;

		data.object.aspect = this.aspect;

		if ( this.view !== null ) data.object.view = Object.assign( {}, this.view );

		data.object.filmGauge = this.filmGauge;
		data.object.filmOffset = this.filmOffset;

		return data;

	}

} );

// File:src/cameras/StereoCamera.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.StereoCamera = function () {

	this.type = 'StereoCamera';

	this.aspect = 1;

	this.cameraL = new THREE.PerspectiveCamera();
	this.cameraL.layers.enable( 1 );
	this.cameraL.matrixAutoUpdate = false;

	this.cameraR = new THREE.PerspectiveCamera();
	this.cameraR.layers.enable( 2 );
	this.cameraR.matrixAutoUpdate = false;

};

Object.assign( THREE.StereoCamera.prototype, {

	update: ( function () {

		var focus, fov, aspect, near, far;

		var eyeRight = new THREE.Matrix4();
		var eyeLeft = new THREE.Matrix4();

		return function update ( camera ) {

			var needsUpdate = focus !== camera.focus || fov !== camera.fov ||
												aspect !== camera.aspect * this.aspect || near !== camera.near ||
												far !== camera.far;

			if ( needsUpdate ) {

				focus = camera.focus;
				fov = camera.fov;
				aspect = camera.aspect * this.aspect;
				near = camera.near;
				far = camera.far;

				// Off-axis stereoscopic effect based on
				// http://paulbourke.net/stereographics/stereorender/

				var projectionMatrix = camera.projectionMatrix.clone();
				var eyeSep = 0.064 / 2;
				var eyeSepOnProjection = eyeSep * near / focus;
				var ymax = near * Math.tan( THREE.Math.DEG2RAD * fov * 0.5 );
				var xmin, xmax;

				// translate xOffset

				eyeLeft.elements[ 12 ] = - eyeSep;
				eyeRight.elements[ 12 ] = eyeSep;

				// for left eye

				xmin = - ymax * aspect + eyeSepOnProjection;
				xmax = ymax * aspect + eyeSepOnProjection;

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraL.projectionMatrix.copy( projectionMatrix );

				// for right eye

				xmin = - ymax * aspect - eyeSepOnProjection;
				xmax = ymax * aspect - eyeSepOnProjection;

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraR.projectionMatrix.copy( projectionMatrix );

			}

			this.cameraL.matrixWorld.copy( camera.matrixWorld ).multiply( eyeLeft );
			this.cameraR.matrixWorld.copy( camera.matrixWorld ).multiply( eyeRight );

		};

	} )()

} );

// File:src/lights/Light.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Light = function ( color, intensity ) {

	THREE.Object3D.call( this );

	this.type = 'Light';

	this.color = new THREE.Color( color );
	this.intensity = intensity !== undefined ? intensity : 1;

	this.receiveShadow = undefined;

};

THREE.Light.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Light,

	copy: function ( source ) {

		THREE.Object3D.prototype.copy.call( this, source );

		this.color.copy( source.color );
		this.intensity = source.intensity;

		return this;

	},

	toJSON: function ( meta ) {

		var data = THREE.Object3D.prototype.toJSON.call( this, meta );

		data.object.color = this.color.getHex();
		data.object.intensity = this.intensity;

		if ( this.groundColor !== undefined ) data.object.groundColor = this.groundColor.getHex();

		if ( this.distance !== undefined ) data.object.distance = this.distance;
		if ( this.angle !== undefined ) data.object.angle = this.angle;
		if ( this.decay !== undefined ) data.object.decay = this.decay;
		if ( this.penumbra !== undefined ) data.object.penumbra = this.penumbra;

		return data;

	}

} );

// File:src/lights/LightShadow.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LightShadow = function ( camera ) {

	this.camera = camera;

	this.bias = 0;
	this.radius = 1;

	this.mapSize = new THREE.Vector2( 512, 512 );

	this.map = null;
	this.matrix = new THREE.Matrix4();

};

Object.assign( THREE.LightShadow.prototype, {

	copy: function ( source ) {

		this.camera = source.camera.clone();

		this.bias = source.bias;
		this.radius = source.radius;

		this.mapSize.copy( source.mapSize );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	}

} );

// File:src/lights/AmbientLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AmbientLight = function ( color, intensity ) {

	THREE.Light.call( this, color, intensity );

	this.type = 'AmbientLight';

	this.castShadow = undefined;

};

THREE.AmbientLight.prototype = Object.assign( Object.create( THREE.Light.prototype ), {

	constructor: THREE.AmbientLight

} );

// File:src/lights/DirectionalLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DirectionalLight = function ( color, intensity ) {

	THREE.Light.call( this, color, intensity );

	this.type = 'DirectionalLight';

	this.position.set( 0, 1, 0 );
	this.updateMatrix();

	this.target = new THREE.Object3D();

	this.shadow = new THREE.DirectionalLightShadow();

};

THREE.DirectionalLight.prototype = Object.assign( Object.create( THREE.Light.prototype ), {

	constructor: THREE.DirectionalLight,

	copy: function ( source ) {

		THREE.Light.prototype.copy.call( this, source );

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		return this;

	}

} );

// File:src/lights/DirectionalLightShadow.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.DirectionalLightShadow = function ( light ) {

	THREE.LightShadow.call( this, new THREE.OrthographicCamera( - 5, 5, 5, - 5, 0.5, 500 ) );

};

THREE.DirectionalLightShadow.prototype = Object.assign( Object.create( THREE.LightShadow.prototype ), {

	constructor: THREE.DirectionalLightShadow

} );

// File:src/lights/HemisphereLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.HemisphereLight = function ( skyColor, groundColor, intensity ) {

	THREE.Light.call( this, skyColor, intensity );

	this.type = 'HemisphereLight';

	this.castShadow = undefined;

	this.position.set( 0, 1, 0 );
	this.updateMatrix();

	this.groundColor = new THREE.Color( groundColor );

};

THREE.HemisphereLight.prototype = Object.assign( Object.create( THREE.Light.prototype ), {

	constructor: THREE.HemisphereLight,

	copy: function ( source ) {

		THREE.Light.prototype.copy.call( this, source );

		this.groundColor.copy( source.groundColor );

		return this;

	}

} );

// File:src/lights/PointLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */


THREE.PointLight = function ( color, intensity, distance, decay ) {

	THREE.Light.call( this, color, intensity );

	this.type = 'PointLight';

	Object.defineProperty( this, 'power', {
		get: function () {
			// intensity = power per solid angle.
			// ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			return this.intensity * 4 * Math.PI;

		},
		set: function ( power ) {
			// intensity = power per solid angle.
			// ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			this.intensity = power / ( 4 * Math.PI );
		}
	} );

	this.distance = ( distance !== undefined ) ? distance : 0;
	this.decay = ( decay !== undefined ) ? decay : 1;	// for physically correct lights, should be 2.

	this.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 90, 1, 0.5, 500 ) );

};

THREE.PointLight.prototype = Object.assign( Object.create( THREE.Light.prototype ), {

	constructor: THREE.PointLight,

	copy: function ( source ) {

		THREE.Light.prototype.copy.call( this, source );

		this.distance = source.distance;
		this.decay = source.decay;

		this.shadow = source.shadow.clone();

		return this;

	}

} );

// File:src/lights/SpotLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpotLight = function ( color, intensity, distance, angle, penumbra, decay ) {

	THREE.Light.call( this, color, intensity );

	this.type = 'SpotLight';

	this.position.set( 0, 1, 0 );
	this.updateMatrix();

	this.target = new THREE.Object3D();

	Object.defineProperty( this, 'power', {
		get: function () {
			// intensity = power per solid angle.
			// ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			return this.intensity * Math.PI;
		},
		set: function ( power ) {
			// intensity = power per solid angle.
			// ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			this.intensity = power / Math.PI;
		}
	} );

	this.distance = ( distance !== undefined ) ? distance : 0;
	this.angle = ( angle !== undefined ) ? angle : Math.PI / 3;
	this.penumbra = ( penumbra !== undefined ) ? penumbra : 0;
	this.decay = ( decay !== undefined ) ? decay : 1;	// for physically correct lights, should be 2.

	this.shadow = new THREE.SpotLightShadow();

};

THREE.SpotLight.prototype = Object.assign( Object.create( THREE.Light.prototype ), {

	constructor: THREE.SpotLight,

	copy: function ( source ) {

		THREE.Light.prototype.copy.call( this, source );

		this.distance = source.distance;
		this.angle = source.angle;
		this.penumbra = source.penumbra;
		this.decay = source.decay;

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		return this;

	}

} );

// File:src/lights/SpotLightShadow.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.SpotLightShadow = function () {

	THREE.LightShadow.call( this, new THREE.PerspectiveCamera( 50, 1, 0.5, 500 ) );

};

THREE.SpotLightShadow.prototype = Object.assign( Object.create( THREE.LightShadow.prototype ), {

	constructor: THREE.SpotLightShadow,

	update: function ( light ) {

		var fov = THREE.Math.RAD2DEG * 2 * light.angle;
		var aspect = this.mapSize.width / this.mapSize.height;
		var far = light.distance || 500;

		var camera = this.camera;

		if ( fov !== camera.fov || aspect !== camera.aspect || far !== camera.far ) {

			camera.fov = fov;
			camera.aspect = aspect;
			camera.far = far;
			camera.updateProjectionMatrix();

		}

	}

} );

// File:src/loaders/AudioLoader.js

/**
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

THREE.AudioLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.AudioLoader.prototype = {

	constructor: THREE.AudioLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var loader = new THREE.XHRLoader( this.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( buffer ) {

			var context = THREE.AudioContext;

			context.decodeAudioData( buffer, function ( audioBuffer ) {

				onLoad( audioBuffer );

			} );

		}, onProgress, onError );

	}

};

// File:src/loaders/Cache.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Cache = {

	enabled: false,

	files: {},

	add: function ( key, file ) {

		if ( this.enabled === false ) return;

		// console.log( 'THREE.Cache', 'Adding key:', key );

		this.files[ key ] = file;

	},

	get: function ( key ) {

		if ( this.enabled === false ) return;

		// console.log( 'THREE.Cache', 'Checking key:', key );

		return this.files[ key ];

	},

	remove: function ( key ) {

		delete this.files[ key ];

	},

	clear: function () {

		this.files = {};

	}

};

// File:src/loaders/Loader.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function () {

	this.onLoadStart = function () {};
	this.onLoadProgress = function () {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	constructor: THREE.Loader,

	crossOrigin: undefined,

	extractUrlBase: function ( url ) {

		var parts = url.split( '/' );

		if ( parts.length === 1 ) return './';

		parts.pop();

		return parts.join( '/' ) + '/';

	},

	initMaterials: function ( materials, texturePath, crossOrigin ) {

		var array = [];

		for ( var i = 0; i < materials.length; ++ i ) {

			array[ i ] = this.createMaterial( materials[ i ], texturePath, crossOrigin );

		}

		return array;

	},

	createMaterial: ( function () {

		var color, textureLoader, materialLoader;

		return function ( m, texturePath, crossOrigin ) {

			if ( color === undefined ) color = new THREE.Color();
			if ( textureLoader === undefined ) textureLoader = new THREE.TextureLoader();
			if ( materialLoader === undefined ) materialLoader = new THREE.MaterialLoader();

			// convert from old material format

			var textures = {};

			function loadTexture( path, repeat, offset, wrap, anisotropy ) {

				var fullPath = texturePath + path;
				var loader = THREE.Loader.Handlers.get( fullPath );

				var texture;

				if ( loader !== null ) {

					texture = loader.load( fullPath );

				} else {

					textureLoader.setCrossOrigin( crossOrigin );
					texture = textureLoader.load( fullPath );

				}

				if ( repeat !== undefined ) {

					texture.repeat.fromArray( repeat );

					if ( repeat[ 0 ] !== 1 ) texture.wrapS = THREE.RepeatWrapping;
					if ( repeat[ 1 ] !== 1 ) texture.wrapT = THREE.RepeatWrapping;

				}

				if ( offset !== undefined ) {

					texture.offset.fromArray( offset );

				}

				if ( wrap !== undefined ) {

					if ( wrap[ 0 ] === 'repeat' ) texture.wrapS = THREE.RepeatWrapping;
					if ( wrap[ 0 ] === 'mirror' ) texture.wrapS = THREE.MirroredRepeatWrapping;

					if ( wrap[ 1 ] === 'repeat' ) texture.wrapT = THREE.RepeatWrapping;
					if ( wrap[ 1 ] === 'mirror' ) texture.wrapT = THREE.MirroredRepeatWrapping;

				}

				if ( anisotropy !== undefined ) {

					texture.anisotropy = anisotropy;

				}

				var uuid = THREE.Math.generateUUID();

				textures[ uuid ] = texture;

				return uuid;

			}

			//

			var json = {
				uuid: THREE.Math.generateUUID(),
				type: 'MeshLambertMaterial'
			};

			for ( var name in m ) {

				var value = m[ name ];

				switch ( name ) {
					case 'DbgColor':
					case 'DbgIndex':
					case 'opticalDensity':
					case 'illumination':
						break;
					case 'DbgName':
						json.name = value;
						break;
					case 'blending':
						json.blending = THREE[ value ];
						break;
					case 'colorAmbient':
					case 'mapAmbient':
						console.warn( 'THREE.Loader.createMaterial:', name, 'is no longer supported.' );
						break;
					case 'colorDiffuse':
						json.color = color.fromArray( value ).getHex();
						break;
					case 'colorSpecular':
						json.specular = color.fromArray( value ).getHex();
						break;
					case 'colorEmissive':
						json.emissive = color.fromArray( value ).getHex();
						break;
					case 'specularCoef':
						json.shininess = value;
						break;
					case 'shading':
						if ( value.toLowerCase() === 'basic' ) json.type = 'MeshBasicMaterial';
						if ( value.toLowerCase() === 'phong' ) json.type = 'MeshPhongMaterial';
						break;
					case 'mapDiffuse':
						json.map = loadTexture( value, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy );
						break;
					case 'mapDiffuseRepeat':
					case 'mapDiffuseOffset':
					case 'mapDiffuseWrap':
					case 'mapDiffuseAnisotropy':
						break;
					case 'mapLight':
						json.lightMap = loadTexture( value, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy );
						break;
					case 'mapLightRepeat':
					case 'mapLightOffset':
					case 'mapLightWrap':
					case 'mapLightAnisotropy':
						break;
					case 'mapAO':
						json.aoMap = loadTexture( value, m.mapAORepeat, m.mapAOOffset, m.mapAOWrap, m.mapAOAnisotropy );
						break;
					case 'mapAORepeat':
					case 'mapAOOffset':
					case 'mapAOWrap':
					case 'mapAOAnisotropy':
						break;
					case 'mapBump':
						json.bumpMap = loadTexture( value, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy );
						break;
					case 'mapBumpScale':
						json.bumpScale = value;
						break;
					case 'mapBumpRepeat':
					case 'mapBumpOffset':
					case 'mapBumpWrap':
					case 'mapBumpAnisotropy':
						break;
					case 'mapNormal':
						json.normalMap = loadTexture( value, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy );
						break;
					case 'mapNormalFactor':
						json.normalScale = [ value, value ];
						break;
					case 'mapNormalRepeat':
					case 'mapNormalOffset':
					case 'mapNormalWrap':
					case 'mapNormalAnisotropy':
						break;
					case 'mapSpecular':
						json.specularMap = loadTexture( value, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy );
						break;
					case 'mapSpecularRepeat':
					case 'mapSpecularOffset':
					case 'mapSpecularWrap':
					case 'mapSpecularAnisotropy':
						break;
					case 'mapAlpha':
						json.alphaMap = loadTexture( value, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy );
						break;
					case 'mapAlphaRepeat':
					case 'mapAlphaOffset':
					case 'mapAlphaWrap':
					case 'mapAlphaAnisotropy':
						break;
					case 'flipSided':
						json.side = THREE.BackSide;
						break;
					case 'doubleSided':
						json.side = THREE.DoubleSide;
						break;
					case 'transparency':
						console.warn( 'THREE.Loader.createMaterial: transparency has been renamed to opacity' );
						json.opacity = value;
						break;
					case 'depthTest':
					case 'depthWrite':
					case 'colorWrite':
					case 'opacity':
					case 'reflectivity':
					case 'transparent':
					case 'visible':
					case 'wireframe':
						json[ name ] = value;
						break;
					case 'vertexColors':
						if ( value === true ) json.vertexColors = THREE.VertexColors;
						if ( value === 'face' ) json.vertexColors = THREE.FaceColors;
						break;
					default:
						console.error( 'THREE.Loader.createMaterial: Unsupported', name, value );
						break;
				}

			}

			if ( json.type === 'MeshBasicMaterial' ) delete json.emissive;
			if ( json.type !== 'MeshPhongMaterial' ) delete json.specular;

			if ( json.opacity < 1 ) json.transparent = true;

			materialLoader.setTextures( textures );

			return materialLoader.parse( json );

		};

	} )()

};

THREE.Loader.Handlers = {

	handlers: [],

	add: function ( regex, loader ) {

		this.handlers.push( regex, loader );

	},

	get: function ( file ) {

		var handlers = this.handlers;

		for ( var i = 0, l = handlers.length; i < l; i += 2 ) {

			var regex = handlers[ i ];
			var loader  = handlers[ i + 1 ];

			if ( regex.test( file ) ) {

				return loader;

			}

		}

		return null;

	}

};

// File:src/loaders/XHRLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.XHRLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.XHRLoader.prototype = {

	constructor: THREE.XHRLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.path !== undefined ) url = this.path + url;

		var scope = this;

		var cached = THREE.Cache.get( url );

		if ( cached !== undefined ) {

			if ( onLoad ) {

				setTimeout( function () {

					onLoad( cached );

				}, 0 );

			}

			return cached;

		}

		var request = new XMLHttpRequest();
		request.overrideMimeType( 'text/plain' );
		request.open( 'GET', url, true );

		request.addEventListener( 'load', function ( event ) {

			var response = event.target.response;

			THREE.Cache.add( url, response );

			if ( this.status === 200 ) {

				if ( onLoad ) onLoad( response );

				scope.manager.itemEnd( url );

			} else if ( this.status === 0 ) {

				// Some browsers return HTTP Status 0 when using non-http protocol
				// e.g. 'file://' or 'data://'. Handle as success.

				console.warn( 'THREE.XHRLoader: HTTP Status 0 received.' );

				if ( onLoad ) onLoad( response );

				scope.manager.itemEnd( url );

			} else {

				if ( onError ) onError( event );

				scope.manager.itemError( url );

			}

		}, false );

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		request.addEventListener( 'error', function ( event ) {

			if ( onError ) onError( event );

			scope.manager.itemError( url );

		}, false );

		if ( this.responseType !== undefined ) request.responseType = this.responseType;
		if ( this.withCredentials !== undefined ) request.withCredentials = this.withCredentials;

		request.send( null );

		scope.manager.itemStart( url );

		return request;

	},

	setPath: function ( value ) {

		this.path = value;

	},

	setResponseType: function ( value ) {

		this.responseType = value;

	},

	setWithCredentials: function ( value ) {

		this.withCredentials = value;

	}

};

// File:src/loaders/FontLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.FontLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.FontLoader.prototype = {

	constructor: THREE.FontLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( this.manager );
		loader.load( url, function ( text ) {

			var json;

			try {

				json = JSON.parse( text );

			} catch ( e ) {

				console.warn( 'THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead.' );
				json = JSON.parse( text.substring( 65, text.length - 2 ) );

			}

			var font = scope.parse( json );

			if ( onLoad ) onLoad( font );

		}, onProgress, onError );

	},

	parse: function ( json ) {

		return new THREE.Font( json );

	}

};

// File:src/loaders/ImageLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ImageLoader.prototype = {

	constructor: THREE.ImageLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.path !== undefined ) url = this.path + url;

		var scope = this;

		var cached = THREE.Cache.get( url );

		if ( cached !== undefined ) {

			scope.manager.itemStart( url );

			if ( onLoad ) {

				setTimeout( function () {

					onLoad( cached );

					scope.manager.itemEnd( url );

				}, 0 );

			} else {

				scope.manager.itemEnd( url );

			}

			return cached;

		}

		var image = document.createElement( 'img' );

		image.addEventListener( 'load', function ( event ) {

			THREE.Cache.add( url, this );

			if ( onLoad ) onLoad( this );

			scope.manager.itemEnd( url );

		}, false );

		if ( onProgress !== undefined ) {

			image.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		image.addEventListener( 'error', function ( event ) {

			if ( onError ) onError( event );

			scope.manager.itemError( url );

		}, false );

		if ( this.crossOrigin !== undefined ) image.crossOrigin = this.crossOrigin;

		scope.manager.itemStart( url );

		image.src = url;

		return image;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	setPath: function ( value ) {

		this.path = value;

	}

};

// File:src/loaders/JSONLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONLoader = function ( manager ) {

	if ( typeof manager === 'boolean' ) {

		console.warn( 'THREE.JSONLoader: showStatus parameter has been removed from constructor.' );
		manager = undefined;

	}

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	this.withCredentials = false;

};

THREE.JSONLoader.prototype = {

	constructor: THREE.JSONLoader,

	// Deprecated

	get statusDomElement () {

		if ( this._statusDomElement === undefined ) {

			this._statusDomElement = document.createElement( 'div' );

		}

		console.warn( 'THREE.JSONLoader: .statusDomElement has been removed.' );
		return this._statusDomElement;

	},

	load: function( url, onLoad, onProgress, onError ) {

		var scope = this;

		var texturePath = this.texturePath && ( typeof this.texturePath === "string" ) ? this.texturePath : THREE.Loader.prototype.extractUrlBase( url );

		var loader = new THREE.XHRLoader( this.manager );
		loader.setWithCredentials( this.withCredentials );
		loader.load( url, function ( text ) {

			var json = JSON.parse( text );
			var metadata = json.metadata;

			if ( metadata !== undefined ) {

				var type = metadata.type;

				if ( type !== undefined ) {

					if ( type.toLowerCase() === 'object' ) {

						console.error( 'THREE.JSONLoader: ' + url + ' should be loaded with THREE.ObjectLoader instead.' );
						return;

					}

					if ( type.toLowerCase() === 'scene' ) {

						console.error( 'THREE.JSONLoader: ' + url + ' should be loaded with THREE.SceneLoader instead.' );
						return;

					}

				}

			}

			var object = scope.parse( json, texturePath );
			onLoad( object.geometry, object.materials );

		}, onProgress, onError );

	},

	setTexturePath: function ( value ) {

		this.texturePath = value;

	},

	parse: function ( json, texturePath ) {

		var geometry = new THREE.Geometry(),
		scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

		parseModel( scale );

		parseSkin();
		parseMorphing( scale );
		parseAnimations();

		geometry.computeFaceNormals();
		geometry.computeBoundingSphere();

		function parseModel( scale ) {

			function isBitSet( value, position ) {

				return value & ( 1 << position );

			}

			var i, j, fi,

			offset, zLength,

		colorIndex, normalIndex, uvIndex, materialIndex,

			type,
			isQuad,
			hasMaterial,
			hasFaceVertexUv,
			hasFaceNormal, hasFaceVertexNormal,
			hasFaceColor, hasFaceVertexColor,

		vertex, face, faceA, faceB, hex, normal,

			uvLayer, uv, u, v,

			faces = json.faces,
			vertices = json.vertices,
			normals = json.normals,
			colors = json.colors,

			nUvLayers = 0;

			if ( json.uvs !== undefined ) {

				// disregard empty arrays

				for ( i = 0; i < json.uvs.length; i ++ ) {

					if ( json.uvs[ i ].length ) nUvLayers ++;

				}

				for ( i = 0; i < nUvLayers; i ++ ) {

					geometry.faceVertexUvs[ i ] = [];

				}

			}

			offset = 0;
			zLength = vertices.length;

			while ( offset < zLength ) {

				vertex = new THREE.Vector3();

				vertex.x = vertices[ offset ++ ] * scale;
				vertex.y = vertices[ offset ++ ] * scale;
				vertex.z = vertices[ offset ++ ] * scale;

				geometry.vertices.push( vertex );

			}

			offset = 0;
			zLength = faces.length;

			while ( offset < zLength ) {

				type = faces[ offset ++ ];


				isQuad              = isBitSet( type, 0 );
				hasMaterial         = isBitSet( type, 1 );
				hasFaceVertexUv     = isBitSet( type, 3 );
				hasFaceNormal       = isBitSet( type, 4 );
				hasFaceVertexNormal = isBitSet( type, 5 );
				hasFaceColor	     = isBitSet( type, 6 );
				hasFaceVertexColor  = isBitSet( type, 7 );

				// console.log("type", type, "bits", isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

				if ( isQuad ) {

					faceA = new THREE.Face3();
					faceA.a = faces[ offset ];
					faceA.b = faces[ offset + 1 ];
					faceA.c = faces[ offset + 3 ];

					faceB = new THREE.Face3();
					faceB.a = faces[ offset + 1 ];
					faceB.b = faces[ offset + 2 ];
					faceB.c = faces[ offset + 3 ];

					offset += 4;

					if ( hasMaterial ) {

						materialIndex = faces[ offset ++ ];
						faceA.materialIndex = materialIndex;
						faceB.materialIndex = materialIndex;

					}

					// to get face <=> uv index correspondence

					fi = geometry.faces.length;

					if ( hasFaceVertexUv ) {

						for ( i = 0; i < nUvLayers; i ++ ) {

							uvLayer = json.uvs[ i ];

							geometry.faceVertexUvs[ i ][ fi ] = [];
							geometry.faceVertexUvs[ i ][ fi + 1 ] = [];

							for ( j = 0; j < 4; j ++ ) {

								uvIndex = faces[ offset ++ ];

								u = uvLayer[ uvIndex * 2 ];
								v = uvLayer[ uvIndex * 2 + 1 ];

								uv = new THREE.Vector2( u, v );

								if ( j !== 2 ) geometry.faceVertexUvs[ i ][ fi ].push( uv );
								if ( j !== 0 ) geometry.faceVertexUvs[ i ][ fi + 1 ].push( uv );

							}

						}

					}

					if ( hasFaceNormal ) {

						normalIndex = faces[ offset ++ ] * 3;

						faceA.normal.set(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);

						faceB.normal.copy( faceA.normal );

					}

					if ( hasFaceVertexNormal ) {

						for ( i = 0; i < 4; i ++ ) {

							normalIndex = faces[ offset ++ ] * 3;

							normal = new THREE.Vector3(
								normals[ normalIndex ++ ],
								normals[ normalIndex ++ ],
								normals[ normalIndex ]
							);


							if ( i !== 2 ) faceA.vertexNormals.push( normal );
							if ( i !== 0 ) faceB.vertexNormals.push( normal );

						}

					}


					if ( hasFaceColor ) {

						colorIndex = faces[ offset ++ ];
						hex = colors[ colorIndex ];

						faceA.color.setHex( hex );
						faceB.color.setHex( hex );

					}


					if ( hasFaceVertexColor ) {

						for ( i = 0; i < 4; i ++ ) {

							colorIndex = faces[ offset ++ ];
							hex = colors[ colorIndex ];

							if ( i !== 2 ) faceA.vertexColors.push( new THREE.Color( hex ) );
							if ( i !== 0 ) faceB.vertexColors.push( new THREE.Color( hex ) );

						}

					}

					geometry.faces.push( faceA );
					geometry.faces.push( faceB );

				} else {

					face = new THREE.Face3();
					face.a = faces[ offset ++ ];
					face.b = faces[ offset ++ ];
					face.c = faces[ offset ++ ];

					if ( hasMaterial ) {

						materialIndex = faces[ offset ++ ];
						face.materialIndex = materialIndex;

					}

					// to get face <=> uv index correspondence

					fi = geometry.faces.length;

					if ( hasFaceVertexUv ) {

						for ( i = 0; i < nUvLayers; i ++ ) {

							uvLayer = json.uvs[ i ];

							geometry.faceVertexUvs[ i ][ fi ] = [];

							for ( j = 0; j < 3; j ++ ) {

								uvIndex = faces[ offset ++ ];

								u = uvLayer[ uvIndex * 2 ];
								v = uvLayer[ uvIndex * 2 + 1 ];

								uv = new THREE.Vector2( u, v );

								geometry.faceVertexUvs[ i ][ fi ].push( uv );

							}

						}

					}

					if ( hasFaceNormal ) {

						normalIndex = faces[ offset ++ ] * 3;

						face.normal.set(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);

					}

					if ( hasFaceVertexNormal ) {

						for ( i = 0; i < 3; i ++ ) {

							normalIndex = faces[ offset ++ ] * 3;

							normal = new THREE.Vector3(
								normals[ normalIndex ++ ],
								normals[ normalIndex ++ ],
								normals[ normalIndex ]
							);

							face.vertexNormals.push( normal );

						}

					}


					if ( hasFaceColor ) {

						colorIndex = faces[ offset ++ ];
						face.color.setHex( colors[ colorIndex ] );

					}


					if ( hasFaceVertexColor ) {

						for ( i = 0; i < 3; i ++ ) {

							colorIndex = faces[ offset ++ ];
							face.vertexColors.push( new THREE.Color( colors[ colorIndex ] ) );

						}

					}

					geometry.faces.push( face );

				}

			}

		}

		function parseSkin() {

			var influencesPerVertex = ( json.influencesPerVertex !== undefined ) ? json.influencesPerVertex : 2;

			if ( json.skinWeights ) {

				for ( var i = 0, l = json.skinWeights.length; i < l; i += influencesPerVertex ) {

					var x =                               json.skinWeights[ i ];
					var y = ( influencesPerVertex > 1 ) ? json.skinWeights[ i + 1 ] : 0;
					var z = ( influencesPerVertex > 2 ) ? json.skinWeights[ i + 2 ] : 0;
					var w = ( influencesPerVertex > 3 ) ? json.skinWeights[ i + 3 ] : 0;

					geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

				}

			}

			if ( json.skinIndices ) {

				for ( var i = 0, l = json.skinIndices.length; i < l; i += influencesPerVertex ) {

					var a =                               json.skinIndices[ i ];
					var b = ( influencesPerVertex > 1 ) ? json.skinIndices[ i + 1 ] : 0;
					var c = ( influencesPerVertex > 2 ) ? json.skinIndices[ i + 2 ] : 0;
					var d = ( influencesPerVertex > 3 ) ? json.skinIndices[ i + 3 ] : 0;

					geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

				}

			}

			geometry.bones = json.bones;

			if ( geometry.bones && geometry.bones.length > 0 && ( geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length ) ) {

				console.warn( 'When skinning, number of vertices (' + geometry.vertices.length + '), skinIndices (' +
					geometry.skinIndices.length + '), and skinWeights (' + geometry.skinWeights.length + ') should match.' );

			}

		}

		function parseMorphing( scale ) {

			if ( json.morphTargets !== undefined ) {

				for ( var i = 0, l = json.morphTargets.length; i < l; i ++ ) {

					geometry.morphTargets[ i ] = {};
					geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
					geometry.morphTargets[ i ].vertices = [];

					var dstVertices = geometry.morphTargets[ i ].vertices;
					var srcVertices = json.morphTargets[ i ].vertices;

					for ( var v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

						var vertex = new THREE.Vector3();
						vertex.x = srcVertices[ v ] * scale;
						vertex.y = srcVertices[ v + 1 ] * scale;
						vertex.z = srcVertices[ v + 2 ] * scale;

						dstVertices.push( vertex );

					}

				}

			}

			if ( json.morphColors !== undefined && json.morphColors.length > 0 ) {

				console.warn( 'THREE.JSONLoader: "morphColors" no longer supported. Using them as face colors.' );

				var faces = geometry.faces;
				var morphColors = json.morphColors[ 0 ].colors;

				for ( var i = 0, l = faces.length; i < l; i ++ ) {

					faces[ i ].color.fromArray( morphColors, i * 3 );

				}

			}

		}

		function parseAnimations() {

			var outputAnimations = [];

			// parse old style Bone/Hierarchy animations
			var animations = [];

			if ( json.animation !== undefined ) {

				animations.push( json.animation );

			}

			if ( json.animations !== undefined ) {

				if ( json.animations.length ) {

					animations = animations.concat( json.animations );

				} else {

					animations.push( json.animations );

				}

			}

			for ( var i = 0; i < animations.length; i ++ ) {

				var clip = THREE.AnimationClip.parseAnimation( animations[ i ], geometry.bones );
				if ( clip ) outputAnimations.push( clip );

			}

			// parse implicit morph animations
			if ( geometry.morphTargets ) {

				// TODO: Figure out what an appropraite FPS is for morph target animations -- defaulting to 10, but really it is completely arbitrary.
				var morphAnimationClips = THREE.AnimationClip.CreateClipsFromMorphTargetSequences( geometry.morphTargets, 10 );
				outputAnimations = outputAnimations.concat( morphAnimationClips );

			}

			if ( outputAnimations.length > 0 ) geometry.animations = outputAnimations;

		}

		if ( json.materials === undefined || json.materials.length === 0 ) {

			return { geometry: geometry };

		} else {

			var materials = THREE.Loader.prototype.initMaterials( json.materials, texturePath, this.crossOrigin );

			return { geometry: geometry, materials: materials };

		}

	}

};

// File:src/loaders/LoadingManager.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LoadingManager = function ( onLoad, onProgress, onError ) {

	var scope = this;

	var isLoading = false, itemsLoaded = 0, itemsTotal = 0;

	this.onStart = undefined;
	this.onLoad = onLoad;
	this.onProgress = onProgress;
	this.onError = onError;

	this.itemStart = function ( url ) {

		itemsTotal ++;

		if ( isLoading === false ) {

			if ( scope.onStart !== undefined ) {

				scope.onStart( url, itemsLoaded, itemsTotal );

			}

		}

		isLoading = true;

	};

	this.itemEnd = function ( url ) {

		itemsLoaded ++;

		if ( scope.onProgress !== undefined ) {

			scope.onProgress( url, itemsLoaded, itemsTotal );

		}

		if ( itemsLoaded === itemsTotal ) {

			isLoading = false;

			if ( scope.onLoad !== undefined ) {

				scope.onLoad();

			}

		}

	};

	this.itemError = function ( url ) {

		if ( scope.onError !== undefined ) {

			scope.onError( url );

		}

	};

};

THREE.DefaultLoadingManager = new THREE.LoadingManager();

// File:src/loaders/BufferGeometryLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometryLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.BufferGeometryLoader.prototype = {

	constructor: THREE.BufferGeometryLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	parse: function ( json ) {

		var geometry = new THREE.BufferGeometry();

		var index = json.data.index;

		var TYPED_ARRAYS = {
			'Int8Array': Int8Array,
			'Uint8Array': Uint8Array,
			'Uint8ClampedArray': Uint8ClampedArray,
			'Int16Array': Int16Array,
			'Uint16Array': Uint16Array,
			'Int32Array': Int32Array,
			'Uint32Array': Uint32Array,
			'Float32Array': Float32Array,
			'Float64Array': Float64Array
		};

		if ( index !== undefined ) {

			var typedArray = new TYPED_ARRAYS[ index.type ]( index.array );
			geometry.setIndex( new THREE.BufferAttribute( typedArray, 1 ) );

		}

		var attributes = json.data.attributes;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];
			var typedArray = new TYPED_ARRAYS[ attribute.type ]( attribute.array );

			geometry.addAttribute( key, new THREE.BufferAttribute( typedArray, attribute.itemSize, attribute.normalized ) );

		}

		var groups = json.data.groups || json.data.drawcalls || json.data.offsets;

		if ( groups !== undefined ) {

			for ( var i = 0, n = groups.length; i !== n; ++ i ) {

				var group = groups[ i ];

				geometry.addGroup( group.start, group.count, group.materialIndex );

			}

		}

		var boundingSphere = json.data.boundingSphere;

		if ( boundingSphere !== undefined ) {

			var center = new THREE.Vector3();

			if ( boundingSphere.center !== undefined ) {

				center.fromArray( boundingSphere.center );

			}

			geometry.boundingSphere = new THREE.Sphere( center, boundingSphere.radius );

		}

		return geometry;

	}

};

// File:src/loaders/MaterialLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MaterialLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	this.textures = {};

};

THREE.MaterialLoader.prototype = {

	constructor: THREE.MaterialLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setTextures: function ( value ) {

		this.textures = value;

	},

	getTexture: function ( name ) {

		var textures = this.textures;

		if ( textures[ name ] === undefined ) {

			console.warn( 'THREE.MaterialLoader: Undefined texture', name );

		}

		return textures[ name ];

	},

	parse: function ( json ) {

		var material = new THREE[ json.type ];

		if ( json.uuid !== undefined ) material.uuid = json.uuid;
		if ( json.name !== undefined ) material.name = json.name;
		if ( json.color !== undefined ) material.color.setHex( json.color );
		if ( json.roughness !== undefined ) material.roughness = json.roughness;
		if ( json.metalness !== undefined ) material.metalness = json.metalness;
		if ( json.emissive !== undefined ) material.emissive.setHex( json.emissive );
		if ( json.specular !== undefined ) material.specular.setHex( json.specular );
		if ( json.shininess !== undefined ) material.shininess = json.shininess;
		if ( json.uniforms !== undefined ) material.uniforms = json.uniforms;
		if ( json.vertexShader !== undefined ) material.vertexShader = json.vertexShader;
		if ( json.fragmentShader !== undefined ) material.fragmentShader = json.fragmentShader;
		if ( json.vertexColors !== undefined ) material.vertexColors = json.vertexColors;
		if ( json.shading !== undefined ) material.shading = json.shading;
		if ( json.blending !== undefined ) material.blending = json.blending;
		if ( json.side !== undefined ) material.side = json.side;
		if ( json.opacity !== undefined ) material.opacity = json.opacity;
		if ( json.transparent !== undefined ) material.transparent = json.transparent;
		if ( json.alphaTest !== undefined ) material.alphaTest = json.alphaTest;
		if ( json.depthTest !== undefined ) material.depthTest = json.depthTest;
		if ( json.depthWrite !== undefined ) material.depthWrite = json.depthWrite;
		if ( json.colorWrite !== undefined ) material.colorWrite = json.colorWrite;
		if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;
		if ( json.wireframeLinewidth !== undefined ) material.wireframeLinewidth = json.wireframeLinewidth;

		// for PointsMaterial
		if ( json.size !== undefined ) material.size = json.size;
		if ( json.sizeAttenuation !== undefined ) material.sizeAttenuation = json.sizeAttenuation;

		// maps

		if ( json.map !== undefined ) material.map = this.getTexture( json.map );

		if ( json.alphaMap !== undefined ) {

			material.alphaMap = this.getTexture( json.alphaMap );
			material.transparent = true;

		}

		if ( json.bumpMap !== undefined ) material.bumpMap = this.getTexture( json.bumpMap );
		if ( json.bumpScale !== undefined ) material.bumpScale = json.bumpScale;

		if ( json.normalMap !== undefined ) material.normalMap = this.getTexture( json.normalMap );
		if ( json.normalScale !== undefined ) {

			var normalScale = json.normalScale;

			if ( Array.isArray( normalScale ) === false ) {

				// Blender exporter used to export a scalar. See #7459

				normalScale = [ normalScale, normalScale ];

			}

			material.normalScale = new THREE.Vector2().fromArray( normalScale );

		}

		if ( json.displacementMap !== undefined ) material.displacementMap = this.getTexture( json.displacementMap );
		if ( json.displacementScale !== undefined ) material.displacementScale = json.displacementScale;
		if ( json.displacementBias !== undefined ) material.displacementBias = json.displacementBias;

		if ( json.roughnessMap !== undefined ) material.roughnessMap = this.getTexture( json.roughnessMap );
		if ( json.metalnessMap !== undefined ) material.metalnessMap = this.getTexture( json.metalnessMap );

		if ( json.emissiveMap !== undefined ) material.emissiveMap = this.getTexture( json.emissiveMap );
		if ( json.emissiveIntensity !== undefined ) material.emissiveIntensity = json.emissiveIntensity;

		if ( json.specularMap !== undefined ) material.specularMap = this.getTexture( json.specularMap );

		if ( json.envMap !== undefined ) {

			material.envMap = this.getTexture( json.envMap );
			material.combine = THREE.MultiplyOperation;

		}

		if ( json.reflectivity ) material.reflectivity = json.reflectivity;

		if ( json.lightMap !== undefined ) material.lightMap = this.getTexture( json.lightMap );
		if ( json.lightMapIntensity !== undefined ) material.lightMapIntensity = json.lightMapIntensity;

		if ( json.aoMap !== undefined ) material.aoMap = this.getTexture( json.aoMap );
		if ( json.aoMapIntensity !== undefined ) material.aoMapIntensity = json.aoMapIntensity;

		// MultiMaterial

		if ( json.materials !== undefined ) {

			for ( var i = 0, l = json.materials.length; i < l; i ++ ) {

				material.materials.push( this.parse( json.materials[ i ] ) );

			}

		}

		return material;

	}

};

// File:src/loaders/ObjectLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ObjectLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	this.texturePath = '';

};

THREE.ObjectLoader.prototype = {

	constructor: THREE.ObjectLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.texturePath === '' ) {

			this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

		}

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			scope.parse( JSON.parse( text ), onLoad );

		}, onProgress, onError );

	},

	setTexturePath: function ( value ) {

		this.texturePath = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json, onLoad ) {

		var geometries = this.parseGeometries( json.geometries );

		var images = this.parseImages( json.images, function () {

			if ( onLoad !== undefined ) onLoad( object );

		} );

		var textures  = this.parseTextures( json.textures, images );
		var materials = this.parseMaterials( json.materials, textures );

		var object = this.parseObject( json.object, geometries, materials );

		if ( json.animations ) {

			object.animations = this.parseAnimations( json.animations );

		}

		if ( json.images === undefined || json.images.length === 0 ) {

			if ( onLoad !== undefined ) onLoad( object );

		}

		return object;

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new THREE.JSONLoader();
			var bufferGeometryLoader = new THREE.BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':
					case 'PlaneBufferGeometry':

						geometry = new THREE[ data.type ](
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'BoxBufferGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new THREE[ data.type ](
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleGeometry':
					case 'CircleBufferGeometry':

						geometry = new THREE[ data.type ](
							data.radius,
							data.segments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'CylinderGeometry':
					case 'CylinderBufferGeometry':

						geometry = new THREE[ data.type ](
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'ConeGeometry':
					case 'ConeBufferGeometry':

						geometry = new THREE [ data.type ](
							data.radius,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'SphereGeometry':
					case 'SphereBufferGeometry':

						geometry = new THREE[ data.type ](
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'DodecahedronGeometry':
					case 'IcosahedronGeometry':
					case 'OctahedronGeometry':
					case 'TetrahedronGeometry':

						geometry = new THREE[ data.type ](
							data.radius,
							data.detail
						);

						break;

					case 'RingGeometry':
					case 'RingBufferGeometry':

						geometry = new THREE[ data.type ](
							data.innerRadius,
							data.outerRadius,
							data.thetaSegments,
							data.phiSegments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'TorusGeometry':
					case 'TorusBufferGeometry':

						geometry = new THREE[ data.type ](
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':
					case 'TorusKnotBufferGeometry':

						geometry = new THREE[ data.type ](
							data.radius,
							data.tube,
							data.tubularSegments,
							data.radialSegments,
							data.p,
							data.q
						);

						break;

					case 'LatheGeometry':
					case 'LatheBufferGeometry':

						geometry = new THREE[ data.type ](
							data.points,
							data.segments,
							data.phiStart,
							data.phiLength
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data.data, this.texturePath ).geometry;

						break;

					default:

						console.warn( 'THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"' );

						continue;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	},

	parseMaterials: function ( json, textures ) {

		var materials = {};

		if ( json !== undefined ) {

			var loader = new THREE.MaterialLoader();
			loader.setTextures( textures );

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var material = loader.parse( json[ i ] );
				materials[ material.uuid ] = material;

			}

		}

		return materials;

	},

	parseAnimations: function ( json ) {

		var animations = [];

		for ( var i = 0; i < json.length; i ++ ) {

			var clip = THREE.AnimationClip.parse( json[ i ] );

			animations.push( clip );

		}

		return animations;

	},

	parseImages: function ( json, onLoad ) {

		var scope = this;
		var images = {};

		function loadImage( url ) {

			scope.manager.itemStart( url );

			return loader.load( url, function () {

				scope.manager.itemEnd( url );

			} );

		}

		if ( json !== undefined && json.length > 0 ) {

			var manager = new THREE.LoadingManager( onLoad );

			var loader = new THREE.ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var image = json[ i ];
				var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test( image.url ) ? image.url : scope.texturePath + image.url;

				images[ image.uuid ] = loadImage( path );

			}

		}

		return images;

	},

	parseTextures: function ( json, images ) {

		function parseConstant( value ) {

			if ( typeof( value ) === 'number' ) return value;

			console.warn( 'THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value );

			return THREE[ value ];

		}

		var textures = {};

		if ( json !== undefined ) {

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

				if ( data.image === undefined ) {

					console.warn( 'THREE.ObjectLoader: No "image" specified for', data.uuid );

				}

				if ( images[ data.image ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined image', data.image );

				}

				var texture = new THREE.Texture( images[ data.image ] );
				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;
				if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping );
				if ( data.offset !== undefined ) texture.offset = new THREE.Vector2( data.offset[ 0 ], data.offset[ 1 ] );
				if ( data.repeat !== undefined ) texture.repeat = new THREE.Vector2( data.repeat[ 0 ], data.repeat[ 1 ] );
				if ( data.minFilter !== undefined ) texture.minFilter = parseConstant( data.minFilter );
				if ( data.magFilter !== undefined ) texture.magFilter = parseConstant( data.magFilter );
				if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;
				if ( Array.isArray( data.wrap ) ) {

					texture.wrapS = parseConstant( data.wrap[ 0 ] );
					texture.wrapT = parseConstant( data.wrap[ 1 ] );

				}

				textures[ data.uuid ] = texture;

			}

		}

		return textures;

	},

	parseObject: function () {

		var matrix = new THREE.Matrix4();

		return function ( data, geometries, materials ) {

			var object;

			function getGeometry( name ) {

				if ( geometries[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined geometry', name );

				}

				return geometries[ name ];

			}

			function getMaterial( name ) {

				if ( name === undefined ) return undefined;

				if ( materials[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined material', name );

				}

				return materials[ name ];

			}

			switch ( data.type ) {

				case 'Scene':

					object = new THREE.Scene();

					break;

				case 'PerspectiveCamera':

					object = new THREE.PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					if ( data.focus !== undefined ) object.focus = data.focus;
					if ( data.zoom !== undefined ) object.zoom = data.zoom;
					if ( data.filmGauge !== undefined ) object.filmGauge = data.filmGauge;
					if ( data.filmOffset !== undefined ) object.filmOffset = data.filmOffset;
					if ( data.view !== undefined ) object.view = Object.assign( {}, data.view );

					break;

				case 'OrthographicCamera':

					object = new THREE.OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new THREE.AmbientLight( data.color, data.intensity );

					break;

				case 'DirectionalLight':

					object = new THREE.DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new THREE.PointLight( data.color, data.intensity, data.distance, data.decay );

					break;

				case 'SpotLight':

					object = new THREE.SpotLight( data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay );

					break;

				case 'HemisphereLight':

					object = new THREE.HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'Mesh':

					var geometry = getGeometry( data.geometry );
					var material = getMaterial( data.material );

					if ( geometry.bones && geometry.bones.length > 0 ) {

						object = new THREE.SkinnedMesh( geometry, material );

					} else {

						object = new THREE.Mesh( geometry, material );

					}

					break;

				case 'LOD':

					object = new THREE.LOD();

					break;

				case 'Line':

					object = new THREE.Line( getGeometry( data.geometry ), getMaterial( data.material ), data.mode );

					break;

				case 'PointCloud':
				case 'Points':

					object = new THREE.Points( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Sprite':

					object = new THREE.Sprite( getMaterial( data.material ) );

					break;

				case 'Group':

					object = new THREE.Group();

					break;

				default:

					object = new THREE.Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;
			if ( data.matrix !== undefined ) {

				matrix.fromArray( data.matrix );
				matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
			if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				for ( var child in data.children ) {

					object.add( this.parseObject( data.children[ child ], geometries, materials ) );

				}

			}

			if ( data.type === 'LOD' ) {

				var levels = data.levels;

				for ( var l = 0; l < levels.length; l ++ ) {

					var level = levels[ l ];
					var child = object.getObjectByProperty( 'uuid', level.object );

					if ( child !== undefined ) {

						object.addLevel( child, level.distance );

					}

				}

			}

			return object;

		};

	}()

};

// File:src/loaders/TextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.TextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.TextureLoader.prototype = {

	constructor: THREE.TextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var texture = new THREE.Texture();

		var loader = new THREE.ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );
		loader.load( url, function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

		return texture;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	setPath: function ( value ) {

		this.path = value;

	}

};

// File:src/loaders/CubeTextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CubeTextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.CubeTextureLoader.prototype = {

	constructor: THREE.CubeTextureLoader,

	load: function ( urls, onLoad, onProgress, onError ) {

		var texture = new THREE.CubeTexture();

		var loader = new THREE.ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		var loaded = 0;

		function loadTexture( i ) {

			loader.load( urls[ i ], function ( image ) {

				texture.images[ i ] = image;

				loaded ++;

				if ( loaded === 6 ) {

					texture.needsUpdate = true;

					if ( onLoad ) onLoad( texture );

				}

			}, undefined, onError );

		}

		for ( var i = 0; i < urls.length; ++ i ) {

			loadTexture( i );

		}

		return texture;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	setPath: function ( value ) {

		this.path = value;

	}

};

// File:src/loaders/BinaryTextureLoader.js

/**
 * @author Nikos M. / https://github.com/foo123/
 *
 * Abstract Base class to load generic binary textures formats (rgbe, hdr, ...)
 */

THREE.DataTextureLoader = THREE.BinaryTextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	// override in sub classes
	this._parser = null;

};

THREE.BinaryTextureLoader.prototype = {

	constructor: THREE.BinaryTextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var texture = new THREE.DataTexture();

		var loader = new THREE.XHRLoader( this.manager );
		loader.setResponseType( 'arraybuffer' );

		loader.load( url, function ( buffer ) {

			var texData = scope._parser( buffer );

			if ( ! texData ) return;

			if ( undefined !== texData.image ) {

				texture.image = texData.image;

			} else if ( undefined !== texData.data ) {

				texture.image.width = texData.width;
				texture.image.height = texData.height;
				texture.image.data = texData.data;

			}

			texture.wrapS = undefined !== texData.wrapS ? texData.wrapS : THREE.ClampToEdgeWrapping;
			texture.wrapT = undefined !== texData.wrapT ? texData.wrapT : THREE.ClampToEdgeWrapping;

			texture.magFilter = undefined !== texData.magFilter ? texData.magFilter : THREE.LinearFilter;
			texture.minFilter = undefined !== texData.minFilter ? texData.minFilter : THREE.LinearMipMapLinearFilter;

			texture.anisotropy = undefined !== texData.anisotropy ? texData.anisotropy : 1;

			if ( undefined !== texData.format ) {

				texture.format = texData.format;

			}
			if ( undefined !== texData.type ) {

				texture.type = texData.type;

			}

			if ( undefined !== texData.mipmaps ) {

				texture.mipmaps = texData.mipmaps;

			}

			if ( 1 === texData.mipmapCount ) {

				texture.minFilter = THREE.LinearFilter;

			}

			texture.needsUpdate = true;

			if ( onLoad ) onLoad( texture, texData );

		}, onProgress, onError );


		return texture;

	}

};

// File:src/loaders/CompressedTextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * Abstract Base class to block based textures loader (dds, pvr, ...)
 */

THREE.CompressedTextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	// override in sub classes
	this._parser = null;

};


THREE.CompressedTextureLoader.prototype = {

	constructor: THREE.CompressedTextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var images = [];

		var texture = new THREE.CompressedTexture();
		texture.image = images;

		var loader = new THREE.XHRLoader( this.manager );
		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );

		function loadTexture( i ) {

			loader.load( url[ i ], function ( buffer ) {

				var texDatas = scope._parser( buffer, true );

				images[ i ] = {
					width: texDatas.width,
					height: texDatas.height,
					format: texDatas.format,
					mipmaps: texDatas.mipmaps
				};

				loaded += 1;

				if ( loaded === 6 ) {

					if ( texDatas.mipmapCount === 1 )
						texture.minFilter = THREE.LinearFilter;

					texture.format = texDatas.format;
					texture.needsUpdate = true;

					if ( onLoad ) onLoad( texture );

				}

			}, onProgress, onError );

		}

		if ( Array.isArray( url ) ) {

			var loaded = 0;

			for ( var i = 0, il = url.length; i < il; ++ i ) {

				loadTexture( i );

			}

		} else {

			// compressed cubemap texture stored in a single DDS file

			loader.load( url, function ( buffer ) {

				var texDatas = scope._parser( buffer, true );

				if ( texDatas.isCubemap ) {

					var faces = texDatas.mipmaps.length / texDatas.mipmapCount;

					for ( var f = 0; f < faces; f ++ ) {

						images[ f ] = { mipmaps : [] };

						for ( var i = 0; i < texDatas.mipmapCount; i ++ ) {

							images[ f ].mipmaps.push( texDatas.mipmaps[ f * texDatas.mipmapCount + i ] );
							images[ f ].format = texDatas.format;
							images[ f ].width = texDatas.width;
							images[ f ].height = texDatas.height;

						}

					}

				} else {

					texture.image.width = texDatas.width;
					texture.image.height = texDatas.height;
					texture.mipmaps = texDatas.mipmaps;

				}

				if ( texDatas.mipmapCount === 1 ) {

					texture.minFilter = THREE.LinearFilter;

				}

				texture.format = texDatas.format;
				texture.needsUpdate = true;

				if ( onLoad ) onLoad( texture );

			}, onProgress, onError );

		}

		return texture;

	},

	setPath: function ( value ) {

		this.path = value;

	}

};

// File:src/materials/Material.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Material = function () {

	Object.defineProperty( this, 'id', { value: THREE.MaterialIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Material';

	this.fog = true;
	this.lights = true;

	this.blending = THREE.NormalBlending;
	this.side = THREE.FrontSide;
	this.shading = THREE.SmoothShading; // THREE.FlatShading, THREE.SmoothShading
	this.vertexColors = THREE.NoColors; // THREE.NoColors, THREE.VertexColors, THREE.FaceColors

	this.opacity = 1;
	this.transparent = false;

	this.blendSrc = THREE.SrcAlphaFactor;
	this.blendDst = THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = THREE.AddEquation;
	this.blendSrcAlpha = null;
	this.blendDstAlpha = null;
	this.blendEquationAlpha = null;

	this.depthFunc = THREE.LessEqualDepth;
	this.depthTest = true;
	this.depthWrite = true;

	this.clippingPlanes = null;
	this.clipShadows = false;

	this.colorWrite = true;

	this.precision = null; // override the renderer's default precision for this material

	this.polygonOffset = false;
	this.polygonOffsetFactor = 0;
	this.polygonOffsetUnits = 0;

	this.alphaTest = 0;
	this.premultipliedAlpha = false;

	this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

	this.visible = true;

	this._needsUpdate = true;

};

THREE.Material.prototype = {

	constructor: THREE.Material,

	get needsUpdate() {

		return this._needsUpdate;

	},

	set needsUpdate( value ) {

		if ( value === true ) this.update();
		this._needsUpdate = value;

	},

	setValues: function ( values ) {

		if ( values === undefined ) return;

		for ( var key in values ) {

			var newValue = values[ key ];

			if ( newValue === undefined ) {

				console.warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			var currentValue = this[ key ];

			if ( currentValue === undefined ) {

				console.warn( "THREE." + this.type + ": '" + key + "' is not a property of this material." );
				continue;

			}

			if ( currentValue instanceof THREE.Color ) {

				currentValue.set( newValue );

			} else if ( currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ) {

				currentValue.copy( newValue );

			} else if ( key === 'overdraw' ) {

				// ensure overdraw is backwards-compatible with legacy boolean type
				this[ key ] = Number( newValue );

			} else {

				this[ key ] = newValue;

			}

		}

	},

	toJSON: function ( meta ) {

		var isRoot = meta === undefined;

		if ( isRoot ) {

			meta = {
				textures: {},
				images: {}
			};

		}

		var data = {
			metadata: {
				version: 4.4,
				type: 'Material',
				generator: 'Material.toJSON'
			}
		};

		// standard Material serialization
		data.uuid = this.uuid;
		data.type = this.type;

		if ( this.name !== '' ) data.name = this.name;

		if ( this.color instanceof THREE.Color ) data.color = this.color.getHex();

		if ( this.roughness !== 0.5 ) data.roughness = this.roughness;
		if ( this.metalness !== 0.5 ) data.metalness = this.metalness;

		if ( this.emissive instanceof THREE.Color ) data.emissive = this.emissive.getHex();
		if ( this.specular instanceof THREE.Color ) data.specular = this.specular.getHex();
		if ( this.shininess !== undefined ) data.shininess = this.shininess;

		if ( this.map instanceof THREE.Texture ) data.map = this.map.toJSON( meta ).uuid;
		if ( this.alphaMap instanceof THREE.Texture ) data.alphaMap = this.alphaMap.toJSON( meta ).uuid;
		if ( this.lightMap instanceof THREE.Texture ) data.lightMap = this.lightMap.toJSON( meta ).uuid;
		if ( this.bumpMap instanceof THREE.Texture ) {

			data.bumpMap = this.bumpMap.toJSON( meta ).uuid;
			data.bumpScale = this.bumpScale;

		}
		if ( this.normalMap instanceof THREE.Texture ) {

			data.normalMap = this.normalMap.toJSON( meta ).uuid;
			data.normalScale = this.normalScale.toArray();

		}
		if ( this.displacementMap instanceof THREE.Texture ) {

			data.displacementMap = this.displacementMap.toJSON( meta ).uuid;
			data.displacementScale = this.displacementScale;
			data.displacementBias = this.displacementBias;

		}
		if ( this.roughnessMap instanceof THREE.Texture ) data.roughnessMap = this.roughnessMap.toJSON( meta ).uuid;
		if ( this.metalnessMap instanceof THREE.Texture ) data.metalnessMap = this.metalnessMap.toJSON( meta ).uuid;

		if ( this.emissiveMap instanceof THREE.Texture ) data.emissiveMap = this.emissiveMap.toJSON( meta ).uuid;
		if ( this.specularMap instanceof THREE.Texture ) data.specularMap = this.specularMap.toJSON( meta ).uuid;

		if ( this.envMap instanceof THREE.Texture ) {

			data.envMap = this.envMap.toJSON( meta ).uuid;
			data.reflectivity = this.reflectivity; // Scale behind envMap

		}

		if ( this.size !== undefined ) data.size = this.size;
		if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

		if ( this.blending !== THREE.NormalBlending ) data.blending = this.blending;
		if ( this.shading !== THREE.SmoothShading ) data.shading = this.shading;
		if ( this.side !== THREE.FrontSide ) data.side = this.side;
		if ( this.vertexColors !== THREE.NoColors ) data.vertexColors = this.vertexColors;

		if ( this.opacity < 1 ) data.opacity = this.opacity;
		if ( this.transparent === true ) data.transparent = this.transparent;
		if ( this.alphaTest > 0 ) data.alphaTest = this.alphaTest;
		if ( this.premultipliedAlpha === true ) data.premultipliedAlpha = this.premultipliedAlpha;
		if ( this.wireframe === true ) data.wireframe = this.wireframe;
		if ( this.wireframeLinewidth > 1 ) data.wireframeLinewidth = this.wireframeLinewidth;

		// TODO: Copied from Object3D.toJSON

		function extractFromCache ( cache ) {

			var values = [];

			for ( var key in cache ) {

				var data = cache[ key ];
				delete data.metadata;
				values.push( data );

			}

			return values;

		}

		if ( isRoot ) {

			var textures = extractFromCache( meta.textures );
			var images = extractFromCache( meta.images );

			if ( textures.length > 0 ) data.textures = textures;
			if ( images.length > 0 ) data.images = images;

		}

		return data;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( source ) {

		this.name = source.name;

		this.fog = source.fog;
		this.lights = source.lights;

		this.blending = source.blending;
		this.side = source.side;
		this.vertexColors = source.vertexColors;

		this.opacity = source.opacity;
		this.transparent = source.transparent;

		this.blendSrc = source.blendSrc;
		this.blendDst = source.blendDst;
		this.blendEquation = source.blendEquation;
		this.blendSrcAlpha = source.blendSrcAlpha;
		this.blendDstAlpha = source.blendDstAlpha;
		this.blendEquationAlpha = source.blendEquationAlpha;

		this.depthFunc = source.depthFunc;
		this.depthTest = source.depthTest;
		this.depthWrite = source.depthWrite;

		this.colorWrite = source.colorWrite;

		this.precision = source.precision;

		this.polygonOffset = source.polygonOffset;
		this.polygonOffsetFactor = source.polygonOffsetFactor;
		this.polygonOffsetUnits = source.polygonOffsetUnits;

		this.alphaTest = source.alphaTest;

		this.premultipliedAlpha = source.premultipliedAlpha;

		this.overdraw = source.overdraw;

		this.visible = source.visible;
		this.clipShadows = source.clipShadows;

		var srcPlanes = source.clippingPlanes,
			dstPlanes = null;

		if ( srcPlanes !== null ) {

			var n = srcPlanes.length;
			dstPlanes = new Array( n );

			for ( var i = 0; i !== n; ++ i )
				dstPlanes[ i ] = srcPlanes[ i ].clone();

		}

		this.clippingPlanes = dstPlanes;

		return this;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

Object.assign( THREE.Material.prototype, THREE.EventDispatcher.prototype );

THREE.MaterialIdCount = 0;

// File:src/materials/LineBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round"
 * }
 */

THREE.LineBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineBasicMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;
	this.linecap = 'round';
	this.linejoin = 'round';

	this.lights = false;

	this.setValues( parameters );

};

THREE.LineBasicMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial;

THREE.LineBasicMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.linewidth = source.linewidth;
	this.linecap = source.linecap;
	this.linejoin = source.linejoin;

	return this;

};

// File:src/materials/LineDashedMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>
 * }
 */

THREE.LineDashedMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineDashedMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;

	this.scale = 1;
	this.dashSize = 3;
	this.gapSize = 1;

	this.lights = false;

	this.setValues( parameters );

};

THREE.LineDashedMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.LineDashedMaterial.prototype.constructor = THREE.LineDashedMaterial;

THREE.LineDashedMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.linewidth = source.linewidth;

	this.scale = source.scale;
	this.dashSize = source.dashSize;
	this.gapSize = source.gapSize;

	return this;

};

// File:src/materials/MeshBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>
 * }
 */

THREE.MeshBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshBasicMaterial';

	this.color = new THREE.Color( 0xffffff ); // emissive

	this.map = null;

	this.aoMap = null;
	this.aoMapIntensity = 1.0;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.skinning = false;
	this.morphTargets = false;

	this.lights = false;

	this.setValues( parameters );

};

THREE.MeshBasicMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial;

THREE.MeshBasicMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.map = source.map;

	this.aoMap = source.aoMap;
	this.aoMapIntensity = source.aoMapIntensity;

	this.specularMap = source.specularMap;

	this.alphaMap = source.alphaMap;

	this.envMap = source.envMap;
	this.combine = source.combine;
	this.reflectivity = source.reflectivity;
	this.refractionRatio = source.refractionRatio;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;
	this.wireframeLinecap = source.wireframeLinecap;
	this.wireframeLinejoin = source.wireframeLinejoin;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;

	return this;

};

// File:src/materials/MeshDepthMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / https://clara.io
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshDepthMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshDepthMaterial';

	this.depthPacking = THREE.BasicDepthPacking;

	this.skinning = false;
	this.morphTargets = false;

	this.map = null;

	this.alphaMap = null;

	this.displacementMap = null;
	this.displacementScale = 1;
	this.displacementBias = 0;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false;
	this.lights = false;

	this.setValues( parameters );

};

THREE.MeshDepthMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshDepthMaterial.prototype.constructor = THREE.MeshDepthMaterial;

THREE.MeshDepthMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.depthPacking = source.depthPacking;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;

	this.map = source.map;

	this.alphaMap = source.alphaMap;

	this.displacementMap = source.displacementMap;
	this.displacementScale = source.displacementScale;
	this.displacementBias = source.displacementBias;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;

	return this;

};

// File:src/materials/MeshLambertMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  emissive: <hex>,
 *  emissiveIntensity: <float>
 *  emissiveMap: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

THREE.MeshLambertMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshLambertMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse

	this.map = null;

	this.lightMap = null;
	this.lightMapIntensity = 1.0;

	this.aoMap = null;
	this.aoMapIntensity = 1.0;

	this.emissive = new THREE.Color( 0x000000 );
	this.emissiveIntensity = 1.0;
	this.emissiveMap = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshLambertMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshLambertMaterial.prototype.constructor = THREE.MeshLambertMaterial;

THREE.MeshLambertMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.map = source.map;

	this.lightMap = source.lightMap;
	this.lightMapIntensity = source.lightMapIntensity;

	this.aoMap = source.aoMap;
	this.aoMapIntensity = source.aoMapIntensity;

	this.emissive.copy( source.emissive );
	this.emissiveMap = source.emissiveMap;
	this.emissiveIntensity = source.emissiveIntensity;

	this.specularMap = source.specularMap;

	this.alphaMap = source.alphaMap;

	this.envMap = source.envMap;
	this.combine = source.combine;
	this.reflectivity = source.reflectivity;
	this.refractionRatio = source.refractionRatio;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;
	this.wireframeLinecap = source.wireframeLinecap;
	this.wireframeLinejoin = source.wireframeLinejoin;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;
	this.morphNormals = source.morphNormals;

	return this;

};

// File:src/materials/MeshNormalMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshNormalMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	this.type = 'MeshNormalMaterial';

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false;
	this.lights = false;
	this.morphTargets = false;

	this.setValues( parameters );

};

THREE.MeshNormalMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshNormalMaterial.prototype.constructor = THREE.MeshNormalMaterial;

THREE.MeshNormalMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;

	return this;

};

// File:src/materials/MeshPhongMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  specular: <hex>,
 *  shininess: <float>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  emissive: <hex>,
 *  emissiveIntensity: <float>
 *  emissiveMap: new THREE.Texture( <Image> ),
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

THREE.MeshPhongMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshPhongMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.specular = new THREE.Color( 0x111111 );
	this.shininess = 30;

	this.map = null;

	this.lightMap = null;
	this.lightMapIntensity = 1.0;

	this.aoMap = null;
	this.aoMapIntensity = 1.0;

	this.emissive = new THREE.Color( 0x000000 );
	this.emissiveIntensity = 1.0;
	this.emissiveMap = null;

	this.bumpMap = null;
	this.bumpScale = 1;

	this.normalMap = null;
	this.normalScale = new THREE.Vector2( 1, 1 );

	this.displacementMap = null;
	this.displacementScale = 1;
	this.displacementBias = 0;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshPhongMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial;

THREE.MeshPhongMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.color.copy( source.color );
	this.specular.copy( source.specular );
	this.shininess = source.shininess;

	this.map = source.map;

	this.lightMap = source.lightMap;
	this.lightMapIntensity = source.lightMapIntensity;

	this.aoMap = source.aoMap;
	this.aoMapIntensity = source.aoMapIntensity;

	this.emissive.copy( source.emissive );
	this.emissiveMap = source.emissiveMap;
	this.emissiveIntensity = source.emissiveIntensity;

	this.bumpMap = source.bumpMap;
	this.bumpScale = source.bumpScale;

	this.normalMap = source.normalMap;
	this.normalScale.copy( source.normalScale );

	this.displacementMap = source.displacementMap;
	this.displacementScale = source.displacementScale;
	this.displacementBias = source.displacementBias;

	this.specularMap = source.specularMap;

	this.alphaMap = source.alphaMap;

	this.envMap = source.envMap;
	this.combine = source.combine;
	this.reflectivity = source.reflectivity;
	this.refractionRatio = source.refractionRatio;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;
	this.wireframeLinecap = source.wireframeLinecap;
	this.wireframeLinejoin = source.wireframeLinejoin;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;
	this.morphNormals = source.morphNormals;

	return this;

};

// File:src/materials/MeshStandardMaterial.js

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  color: <hex>,
 *  roughness: <float>,
 *  metalness: <float>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  emissive: <hex>,
 *  emissiveIntensity: <float>
 *  emissiveMap: new THREE.Texture( <Image> ),
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  roughnessMap: new THREE.Texture( <Image> ),
 *
 *  metalnessMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.CubeTexture( [posx, negx, posy, negy, posz, negz] ),
 *  envMapIntensity: <float>
 *
 *  refractionRatio: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

THREE.MeshStandardMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.defines = { 'STANDARD': '' };

	this.type = 'MeshStandardMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.roughness = 0.5;
	this.metalness = 0.5;

	this.map = null;

	this.lightMap = null;
	this.lightMapIntensity = 1.0;

	this.aoMap = null;
	this.aoMapIntensity = 1.0;

	this.emissive = new THREE.Color( 0x000000 );
	this.emissiveIntensity = 1.0;
	this.emissiveMap = null;

	this.bumpMap = null;
	this.bumpScale = 1;

	this.normalMap = null;
	this.normalScale = new THREE.Vector2( 1, 1 );

	this.displacementMap = null;
	this.displacementScale = 1;
	this.displacementBias = 0;

	this.roughnessMap = null;

	this.metalnessMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.envMapIntensity = 1.0;

	this.refractionRatio = 0.98;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshStandardMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshStandardMaterial.prototype.constructor = THREE.MeshStandardMaterial;

THREE.MeshStandardMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.defines = { 'STANDARD': '' };

	this.color.copy( source.color );
	this.roughness = source.roughness;
	this.metalness = source.metalness;

	this.map = source.map;

	this.lightMap = source.lightMap;
	this.lightMapIntensity = source.lightMapIntensity;

	this.aoMap = source.aoMap;
	this.aoMapIntensity = source.aoMapIntensity;

	this.emissive.copy( source.emissive );
	this.emissiveMap = source.emissiveMap;
	this.emissiveIntensity = source.emissiveIntensity;

	this.bumpMap = source.bumpMap;
	this.bumpScale = source.bumpScale;

	this.normalMap = source.normalMap;
	this.normalScale.copy( source.normalScale );

	this.displacementMap = source.displacementMap;
	this.displacementScale = source.displacementScale;
	this.displacementBias = source.displacementBias;

	this.roughnessMap = source.roughnessMap;

	this.metalnessMap = source.metalnessMap;

	this.alphaMap = source.alphaMap;

	this.envMap = source.envMap;
	this.envMapIntensity = source.envMapIntensity;

	this.refractionRatio = source.refractionRatio;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;
	this.wireframeLinecap = source.wireframeLinecap;
	this.wireframeLinejoin = source.wireframeLinejoin;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;
	this.morphNormals = source.morphNormals;

	return this;

};

// File:src/materials/MeshPhysicalMaterial.js

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  reflectivity: <float>
 * }
 */

THREE.MeshPhysicalMaterial = function ( parameters ) {

	THREE.MeshStandardMaterial.call( this );

	this.defines = { 'PHYSICAL': '' };

	this.type = 'MeshPhysicalMaterial';

	this.reflectivity = 0.5; // maps to F0 = 0.04

	this.setValues( parameters );

};

THREE.MeshPhysicalMaterial.prototype = Object.create( THREE.MeshStandardMaterial.prototype );
THREE.MeshPhysicalMaterial.prototype.constructor = THREE.MeshPhysicalMaterial;

THREE.MeshPhysicalMaterial.prototype.copy = function ( source ) {

	THREE.MeshStandardMaterial.prototype.copy.call( this, source );

	this.defines = { 'PHYSICAL': '' };

	this.reflectivity = source.reflectivity;

	return this;

};

// File:src/materials/MultiMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MultiMaterial = function ( materials ) {

	this.uuid = THREE.Math.generateUUID();

	this.type = 'MultiMaterial';

	this.materials = materials instanceof Array ? materials : [];

	this.visible = true;

};

THREE.MultiMaterial.prototype = {

	constructor: THREE.MultiMaterial,

	toJSON: function ( meta ) {

		var output = {
			metadata: {
				version: 4.2,
				type: 'material',
				generator: 'MaterialExporter'
			},
			uuid: this.uuid,
			type: this.type,
			materials: []
		};

		var materials = this.materials;

		for ( var i = 0, l = materials.length; i < l; i ++ ) {

			var material = materials[ i ].toJSON( meta );
			delete material.metadata;

			output.materials.push( material );

		}

		output.visible = this.visible;

		return output;

	},

	clone: function () {

		var material = new this.constructor();

		for ( var i = 0; i < this.materials.length; i ++ ) {

			material.materials.push( this.materials[ i ].clone() );

		}

		material.visible = this.visible;

		return material;

	}

};

// File:src/materials/PointsMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *  sizeAttenuation: <bool>
 * }
 */

THREE.PointsMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'PointsMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.map = null;

	this.size = 1;
	this.sizeAttenuation = true;

	this.lights = false;

	this.setValues( parameters );

};

THREE.PointsMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.PointsMaterial.prototype.constructor = THREE.PointsMaterial;

THREE.PointsMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.map = source.map;

	this.size = source.size;
	this.sizeAttenuation = source.sizeAttenuation;

	return this;

};

// File:src/materials/ShaderMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { type: "1f", value: 1.0 }, "parameter2": { type: "1i" value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

THREE.ShaderMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'ShaderMaterial';

	this.defines = {};
	this.uniforms = {};

	this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
	this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';

	this.linewidth = 1;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false; // set to use scene fog
	this.lights = false; // set to use scene lights
	this.clipping = false; // set to use user-defined clipping planes

	this.skinning = false; // set to use skinning attribute streams
	this.morphTargets = false; // set to use morph targets
	this.morphNormals = false; // set to use morph normals

	this.extensions = {
		derivatives: false, // set to use derivatives
		fragDepth: false, // set to use fragment depth values
		drawBuffers: false, // set to use draw buffers
		shaderTextureLOD: false // set to use shader texture LOD
	};

	// When rendered geometry doesn't include these attributes but the material does,
	// use these default values in WebGL. This avoids errors when buffer data is missing.
	this.defaultAttributeValues = {
		'color': [ 1, 1, 1 ],
		'uv': [ 0, 0 ],
		'uv2': [ 0, 0 ]
	};

	this.index0AttributeName = undefined;

	if ( parameters !== undefined ) {

		if ( parameters.attributes !== undefined ) {

			console.error( 'THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.' );

		}

		this.setValues( parameters );

	}

};

THREE.ShaderMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.ShaderMaterial.prototype.constructor = THREE.ShaderMaterial;

THREE.ShaderMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.fragmentShader = source.fragmentShader;
	this.vertexShader = source.vertexShader;

	this.uniforms = THREE.UniformsUtils.clone( source.uniforms );

	this.defines = source.defines;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;

	this.lights = source.lights;
	this.clipping = source.clipping;

	this.skinning = source.skinning;

	this.morphTargets = source.morphTargets;
	this.morphNormals = source.morphNormals;

	this.extensions = source.extensions;

	return this;

};

THREE.ShaderMaterial.prototype.toJSON = function ( meta ) {

	var data = THREE.Material.prototype.toJSON.call( this, meta );

	data.uniforms = this.uniforms;
	data.vertexShader = this.vertexShader;
	data.fragmentShader = this.fragmentShader;

	return data;

};

// File:src/materials/RawShaderMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.RawShaderMaterial = function ( parameters ) {

	THREE.ShaderMaterial.call( this, parameters );

	this.type = 'RawShaderMaterial';

};

THREE.RawShaderMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
THREE.RawShaderMaterial.prototype.constructor = THREE.RawShaderMaterial;

// File:src/materials/SpriteMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *	uvOffset: new THREE.Vector2(),
 *	uvScale: new THREE.Vector2()
 * }
 */

THREE.SpriteMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'SpriteMaterial';

	this.color = new THREE.Color( 0xffffff );
	this.map = null;

	this.rotation = 0;

	this.fog = false;
	this.lights = false;

	this.setValues( parameters );

};

THREE.SpriteMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.SpriteMaterial.prototype.constructor = THREE.SpriteMaterial;

THREE.SpriteMaterial.prototype.copy = function ( source ) {

	THREE.Material.prototype.copy.call( this, source );

	this.color.copy( source.color );
	this.map = source.map;

	this.rotation = source.rotation;

	return this;

};

// File:src/materials/ShadowMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ShadowMaterial = function () {

	THREE.ShaderMaterial.call( this, {
		uniforms: THREE.UniformsUtils.merge( [
			THREE.UniformsLib[ "lights" ],
			{
				opacity: { value: 1.0 }
			}
		] ),
		vertexShader: THREE.ShaderChunk[ 'shadow_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'shadow_frag' ]
	} );

	this.lights = true;
	this.transparent = true;

	Object.defineProperties( this, {
		opacity: {
			enumerable: true,
			get: function () {
				return this.uniforms.opacity.value;
			},
			set: function ( value ) {
				this.uniforms.opacity.value = value;
			}
		}
	} );

};

THREE.ShadowMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
THREE.ShadowMaterial.prototype.constructor = THREE.ShadowMaterial;

// File:src/textures/Texture.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.Texture = function ( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding ) {

	Object.defineProperty( this, 'id', { value: THREE.TextureIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.sourceFile = '';

	this.image = image !== undefined ? image : THREE.Texture.DEFAULT_IMAGE;
	this.mipmaps = [];

	this.mapping = mapping !== undefined ? mapping : THREE.Texture.DEFAULT_MAPPING;

	this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
	this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;

	this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

	this.format = format !== undefined ? format : THREE.RGBAFormat;
	this.type = type !== undefined ? type : THREE.UnsignedByteType;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.generateMipmaps = true;
	this.premultiplyAlpha = false;
	this.flipY = true;
	this.unpackAlignment = 4;	// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)


	// Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
	//
	// Also changing the encoding after already used by a Material will not automatically make the Material
	// update.  You need to explicitly call Material.needsUpdate to trigger it to recompile.
	this.encoding = encoding !== undefined ? encoding :  THREE.LinearEncoding;

	this.version = 0;
	this.onUpdate = null;

};

THREE.Texture.DEFAULT_IMAGE = undefined;
THREE.Texture.DEFAULT_MAPPING = THREE.UVMapping;

THREE.Texture.prototype = {

	constructor: THREE.Texture,

	set needsUpdate( value ) {

		if ( value === true ) this.version ++;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( source ) {

		this.image = source.image;
		this.mipmaps = source.mipmaps.slice( 0 );

		this.mapping = source.mapping;

		this.wrapS = source.wrapS;
		this.wrapT = source.wrapT;

		this.magFilter = source.magFilter;
		this.minFilter = source.minFilter;

		this.anisotropy = source.anisotropy;

		this.format = source.format;
		this.type = source.type;

		this.offset.copy( source.offset );
		this.repeat.copy( source.repeat );

		this.generateMipmaps = source.generateMipmaps;
		this.premultiplyAlpha = source.premultiplyAlpha;
		this.flipY = source.flipY;
		this.unpackAlignment = source.unpackAlignment;
		this.encoding = source.encoding;

		return this;

	},

	toJSON: function ( meta ) {

		if ( meta.textures[ this.uuid ] !== undefined ) {

			return meta.textures[ this.uuid ];

		}

		function getDataURL( image ) {

			var canvas;

			if ( image.toDataURL !== undefined ) {

				canvas = image;

			} else {

				canvas = document.createElement( 'canvas' );
				canvas.width = image.width;
				canvas.height = image.height;

				canvas.getContext( '2d' ).drawImage( image, 0, 0, image.width, image.height );

			}

			if ( canvas.width > 2048 || canvas.height > 2048 ) {

				return canvas.toDataURL( 'image/jpeg', 0.6 );

			} else {

				return canvas.toDataURL( 'image/png' );

			}

		}

		var output = {
			metadata: {
				version: 4.4,
				type: 'Texture',
				generator: 'Texture.toJSON'
			},

			uuid: this.uuid,
			name: this.name,

			mapping: this.mapping,

			repeat: [ this.repeat.x, this.repeat.y ],
			offset: [ this.offset.x, this.offset.y ],
			wrap: [ this.wrapS, this.wrapT ],

			minFilter: this.minFilter,
			magFilter: this.magFilter,
			anisotropy: this.anisotropy
		};

		if ( this.image !== undefined ) {

			// TODO: Move to THREE.Image

			var image = this.image;

			if ( image.uuid === undefined ) {

				image.uuid = THREE.Math.generateUUID(); // UGH

			}

			if ( meta.images[ image.uuid ] === undefined ) {

				meta.images[ image.uuid ] = {
					uuid: image.uuid,
					url: getDataURL( image )
				};

			}

			output.image = image.uuid;

		}

		meta.textures[ this.uuid ] = output;

		return output;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	},

	transformUv: function ( uv ) {

		if ( this.mapping !== THREE.UVMapping )  return;

		uv.multiply( this.repeat );
		uv.add( this.offset );

		if ( uv.x < 0 || uv.x > 1 ) {

			switch ( this.wrapS ) {

				case THREE.RepeatWrapping:

					uv.x = uv.x - Math.floor( uv.x );
					break;

				case THREE.ClampToEdgeWrapping:

					uv.x = uv.x < 0 ? 0 : 1;
					break;

				case THREE.MirroredRepeatWrapping:

					if ( Math.abs( Math.floor( uv.x ) % 2 ) === 1 ) {

						uv.x = Math.ceil( uv.x ) - uv.x;

					} else {

						uv.x = uv.x - Math.floor( uv.x );

					}
					break;

			}

		}

		if ( uv.y < 0 || uv.y > 1 ) {

			switch ( this.wrapT ) {

				case THREE.RepeatWrapping:

					uv.y = uv.y - Math.floor( uv.y );
					break;

				case THREE.ClampToEdgeWrapping:

					uv.y = uv.y < 0 ? 0 : 1;
					break;

				case THREE.MirroredRepeatWrapping:

					if ( Math.abs( Math.floor( uv.y ) % 2 ) === 1 ) {

						uv.y = Math.ceil( uv.y ) - uv.y;

					} else {

						uv.y = uv.y - Math.floor( uv.y );

					}
					break;

			}

		}

		if ( this.flipY ) {

			uv.y = 1 - uv.y;

		}

	}

};

Object.assign( THREE.Texture.prototype, THREE.EventDispatcher.prototype );

THREE.TextureIdCount = 0;

// File:src/textures/DepthTexture.js

/**
 * @author Matt DesLauriers / @mattdesl
 */

THREE.DepthTexture = function ( width, height, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy ) {

  THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, THREE.DepthFormat, type, anisotropy );

  this.image = { width: width, height: height };

  this.type = type !== undefined ? type : THREE.UnsignedShortType;

  this.magFilter = magFilter !== undefined ? magFilter : THREE.NearestFilter;
  this.minFilter = minFilter !== undefined ? minFilter : THREE.NearestFilter;

  this.flipY = false;
  this.generateMipmaps  = false;

};

THREE.DepthTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.DepthTexture.prototype.constructor = THREE.DepthTexture;

// File:src/textures/CanvasTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CanvasTexture = function ( canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.needsUpdate = true;

};

THREE.CanvasTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.CanvasTexture.prototype.constructor = THREE.CanvasTexture;

// File:src/textures/CubeTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CubeTexture = function ( images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding ) {

	images = images !== undefined ? images : [];
	mapping = mapping !== undefined ? mapping : THREE.CubeReflectionMapping;

	THREE.Texture.call( this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );

	this.flipY = false;

};

THREE.CubeTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.CubeTexture.prototype.constructor = THREE.CubeTexture;

Object.defineProperty( THREE.CubeTexture.prototype, 'images', {

	get: function () {

		return this.image;

	},

	set: function ( value ) {

		this.image = value;

	}

} );

// File:src/textures/CompressedTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CompressedTexture = function ( mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );

	this.image = { width: width, height: height };
	this.mipmaps = mipmaps;

	// no flipping for cube textures
	// (also flipping doesn't work for compressed textures )

	this.flipY = false;

	// can't generate mipmaps for compressed textures
	// mips must be embedded in DDS files

	this.generateMipmaps = false;

};

THREE.CompressedTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.CompressedTexture.prototype.constructor = THREE.CompressedTexture;

// File:src/textures/DataTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DataTexture = function ( data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );

	this.image = { data: data, width: width, height: height };

	this.magFilter = magFilter !== undefined ? magFilter : THREE.NearestFilter;
	this.minFilter = minFilter !== undefined ? minFilter : THREE.NearestFilter;

	this.flipY = false;
	this.generateMipmaps  = false;

};

THREE.DataTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.DataTexture.prototype.constructor = THREE.DataTexture;

// File:src/textures/VideoTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.VideoTexture = function ( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.generateMipmaps = false;

	var scope = this;

	function update() {

		requestAnimationFrame( update );

		if ( video.readyState >= video.HAVE_CURRENT_DATA ) {

			scope.needsUpdate = true;

		}

	}

	update();

};

THREE.VideoTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.VideoTexture.prototype.constructor = THREE.VideoTexture;

// File:src/objects/Group.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Group = function () {

	THREE.Object3D.call( this );

	this.type = 'Group';

};

THREE.Group.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Group

} );

// File:src/objects/Points.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Points = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'Points';

	this.geometry = geometry !== undefined ? geometry : new THREE.BufferGeometry();
	this.material = material !== undefined ? material : new THREE.PointsMaterial( { color: Math.random() * 0xffffff } );

};

THREE.Points.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Points,

	raycast: ( function () {

		var inverseMatrix = new THREE.Matrix4();
		var ray = new THREE.Ray();
		var sphere = new THREE.Sphere();

		return function raycast( raycaster, intersects ) {

			var object = this;
			var geometry = this.geometry;
			var matrixWorld = this.matrixWorld;
			var threshold = raycaster.params.Points.threshold;

			// Checking boundingSphere distance to ray

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( matrixWorld );

			if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

			//

			inverseMatrix.getInverse( matrixWorld );
			ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

			var localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
			var localThresholdSq = localThreshold * localThreshold;
			var position = new THREE.Vector3();

			function testPoint( point, index ) {

				var rayPointDistanceSq = ray.distanceSqToPoint( point );

				if ( rayPointDistanceSq < localThresholdSq ) {

					var intersectPoint = ray.closestPointToPoint( point );
					intersectPoint.applyMatrix4( matrixWorld );

					var distance = raycaster.ray.origin.distanceTo( intersectPoint );

					if ( distance < raycaster.near || distance > raycaster.far ) return;

					intersects.push( {

						distance: distance,
						distanceToRay: Math.sqrt( rayPointDistanceSq ),
						point: intersectPoint.clone(),
						index: index,
						face: null,
						object: object

					} );

				}

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				var index = geometry.index;
				var attributes = geometry.attributes;
				var positions = attributes.position.array;

				if ( index !== null ) {

					var indices = index.array;

					for ( var i = 0, il = indices.length; i < il; i ++ ) {

						var a = indices[ i ];

						position.fromArray( positions, a * 3 );

						testPoint( position, a );

					}

				} else {

					for ( var i = 0, l = positions.length / 3; i < l; i ++ ) {

						position.fromArray( positions, i * 3 );

						testPoint( position, i );

					}

				}

			} else {

				var vertices = geometry.vertices;

				for ( var i = 0, l = vertices.length; i < l; i ++ ) {

					testPoint( vertices[ i ], i );

				}

			}

		};

	}() ),

	clone: function () {

		return new this.constructor( this.geometry, this.material ).copy( this );

	}

} );

// File:src/objects/Line.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Line = function ( geometry, material, mode ) {

	if ( mode === 1 ) {

		console.warn( 'THREE.Line: parameter THREE.LinePieces no longer supported. Created THREE.LineSegments instead.' );
		return new THREE.LineSegments( geometry, material );

	}

	THREE.Object3D.call( this );

	this.type = 'Line';

	this.geometry = geometry !== undefined ? geometry : new THREE.BufferGeometry();
	this.material = material !== undefined ? material : new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } );

};

THREE.Line.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Line,

	raycast: ( function () {

		var inverseMatrix = new THREE.Matrix4();
		var ray = new THREE.Ray();
		var sphere = new THREE.Sphere();

		return function raycast( raycaster, intersects ) {

			var precision = raycaster.linePrecision;
			var precisionSq = precision * precision;

			var geometry = this.geometry;
			var matrixWorld = this.matrixWorld;

			// Checking boundingSphere distance to ray

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( matrixWorld );

			if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

			//

			inverseMatrix.getInverse( matrixWorld );
			ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

			var vStart = new THREE.Vector3();
			var vEnd = new THREE.Vector3();
			var interSegment = new THREE.Vector3();
			var interRay = new THREE.Vector3();
			var step = this instanceof THREE.LineSegments ? 2 : 1;

			if ( geometry instanceof THREE.BufferGeometry ) {

				var index = geometry.index;
				var attributes = geometry.attributes;
				var positions = attributes.position.array;

				if ( index !== null ) {

					var indices = index.array;

					for ( var i = 0, l = indices.length - 1; i < l; i += step ) {

						var a = indices[ i ];
						var b = indices[ i + 1 ];

						vStart.fromArray( positions, a * 3 );
						vEnd.fromArray( positions, b * 3 );

						var distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

						if ( distSq > precisionSq ) continue;

						interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

						var distance = raycaster.ray.origin.distanceTo( interRay );

						if ( distance < raycaster.near || distance > raycaster.far ) continue;

						intersects.push( {

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4( this.matrixWorld ),
							index: i,
							face: null,
							faceIndex: null,
							object: this

						} );

					}

				} else {

					for ( var i = 0, l = positions.length / 3 - 1; i < l; i += step ) {

						vStart.fromArray( positions, 3 * i );
						vEnd.fromArray( positions, 3 * i + 3 );

						var distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

						if ( distSq > precisionSq ) continue;

						interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

						var distance = raycaster.ray.origin.distanceTo( interRay );

						if ( distance < raycaster.near || distance > raycaster.far ) continue;

						intersects.push( {

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4( this.matrixWorld ),
							index: i,
							face: null,
							faceIndex: null,
							object: this

						} );

					}

				}

			} else if ( geometry instanceof THREE.Geometry ) {

				var vertices = geometry.vertices;
				var nbVertices = vertices.length;

				for ( var i = 0; i < nbVertices - 1; i += step ) {

					var distSq = ray.distanceSqToSegment( vertices[ i ], vertices[ i + 1 ], interRay, interSegment );

					if ( distSq > precisionSq ) continue;

					interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

					var distance = raycaster.ray.origin.distanceTo( interRay );

					if ( distance < raycaster.near || distance > raycaster.far ) continue;

					intersects.push( {

						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4( this.matrixWorld ),
						index: i,
						face: null,
						faceIndex: null,
						object: this

					} );

				}

			}

		};

	}() ),

	clone: function () {

		return new this.constructor( this.geometry, this.material ).copy( this );

	}

} );

// File:src/objects/LineSegments.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LineSegments = function ( geometry, material ) {

	THREE.Line.call( this, geometry, material );

	this.type = 'LineSegments';

};

THREE.LineSegments.prototype = Object.assign( Object.create( THREE.Line.prototype ), {

	constructor: THREE.LineSegments

} );

// File:src/objects/Mesh.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

THREE.Mesh = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'Mesh';

	this.geometry = geometry !== undefined ? geometry : new THREE.BufferGeometry();
	this.material = material !== undefined ? material : new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );

	this.drawMode = THREE.TrianglesDrawMode;

	this.updateMorphTargets();

};

THREE.Mesh.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Mesh,

	setDrawMode: function ( value ) {

		this.drawMode = value;

	},

	updateMorphTargets: function () {

		if ( this.geometry.morphTargets !== undefined && this.geometry.morphTargets.length > 0 ) {

			this.morphTargetBase = - 1;
			this.morphTargetInfluences = [];
			this.morphTargetDictionary = {};

			for ( var m = 0, ml = this.geometry.morphTargets.length; m < ml; m ++ ) {

				this.morphTargetInfluences.push( 0 );
				this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;

			}

		}

	},

	getMorphTargetIndexByName: function ( name ) {

		if ( this.morphTargetDictionary[ name ] !== undefined ) {

			return this.morphTargetDictionary[ name ];

		}

		console.warn( 'THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.' );

		return 0;

	},

	raycast: ( function () {

		var inverseMatrix = new THREE.Matrix4();
		var ray = new THREE.Ray();
		var sphere = new THREE.Sphere();

		var vA = new THREE.Vector3();
		var vB = new THREE.Vector3();
		var vC = new THREE.Vector3();

		var tempA = new THREE.Vector3();
		var tempB = new THREE.Vector3();
		var tempC = new THREE.Vector3();

		var uvA = new THREE.Vector2();
		var uvB = new THREE.Vector2();
		var uvC = new THREE.Vector2();

		var barycoord = new THREE.Vector3();

		var intersectionPoint = new THREE.Vector3();
		var intersectionPointWorld = new THREE.Vector3();

		function uvIntersection( point, p1, p2, p3, uv1, uv2, uv3 ) {

			THREE.Triangle.barycoordFromPoint( point, p1, p2, p3, barycoord );

			uv1.multiplyScalar( barycoord.x );
			uv2.multiplyScalar( barycoord.y );
			uv3.multiplyScalar( barycoord.z );

			uv1.add( uv2 ).add( uv3 );

			return uv1.clone();

		}

		function checkIntersection( object, raycaster, ray, pA, pB, pC, point ) {

			var intersect;
			var material = object.material;

			if ( material.side === THREE.BackSide ) {

				intersect = ray.intersectTriangle( pC, pB, pA, true, point );

			} else {

				intersect = ray.intersectTriangle( pA, pB, pC, material.side !== THREE.DoubleSide, point );

			}

			if ( intersect === null ) return null;

			intersectionPointWorld.copy( point );
			intersectionPointWorld.applyMatrix4( object.matrixWorld );

			var distance = raycaster.ray.origin.distanceTo( intersectionPointWorld );

			if ( distance < raycaster.near || distance > raycaster.far ) return null;

			return {
				distance: distance,
				point: intersectionPointWorld.clone(),
				object: object
			};

		}

		function checkBufferGeometryIntersection( object, raycaster, ray, positions, uvs, a, b, c ) {

			vA.fromArray( positions, a * 3 );
			vB.fromArray( positions, b * 3 );
			vC.fromArray( positions, c * 3 );

			var intersection = checkIntersection( object, raycaster, ray, vA, vB, vC, intersectionPoint );

			if ( intersection ) {

				if ( uvs ) {

					uvA.fromArray( uvs, a * 2 );
					uvB.fromArray( uvs, b * 2 );
					uvC.fromArray( uvs, c * 2 );

					intersection.uv = uvIntersection( intersectionPoint,  vA, vB, vC,  uvA, uvB, uvC );

				}

				intersection.face = new THREE.Face3( a, b, c, THREE.Triangle.normal( vA, vB, vC ) );
				intersection.faceIndex = a;

			}

			return intersection;

		}

		return function raycast( raycaster, intersects ) {

			var geometry = this.geometry;
			var material = this.material;
			var matrixWorld = this.matrixWorld;

			if ( material === undefined ) return;

			// Checking boundingSphere distance to ray

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( matrixWorld );

			if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

			//

			inverseMatrix.getInverse( matrixWorld );
			ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

			// Check boundingBox before continuing

			if ( geometry.boundingBox !== null ) {

				if ( ray.intersectsBox( geometry.boundingBox ) === false ) return;

			}

			var uvs, intersection;

			if ( geometry instanceof THREE.BufferGeometry ) {

				var a, b, c;
				var index = geometry.index;
				var attributes = geometry.attributes;
				var positions = attributes.position.array;

				if ( attributes.uv !== undefined ) {

					uvs = attributes.uv.array;

				}

				if ( index !== null ) {

					var indices = index.array;

					for ( var i = 0, l = indices.length; i < l; i += 3 ) {

						a = indices[ i ];
						b = indices[ i + 1 ];
						c = indices[ i + 2 ];

						intersection = checkBufferGeometryIntersection( this, raycaster, ray, positions, uvs, a, b, c );

						if ( intersection ) {

							intersection.faceIndex = Math.floor( i / 3 ); // triangle number in indices buffer semantics
							intersects.push( intersection );

						}

					}

				} else {


					for ( var i = 0, l = positions.length; i < l; i += 9 ) {

						a = i / 3;
						b = a + 1;
						c = a + 2;

						intersection = checkBufferGeometryIntersection( this, raycaster, ray, positions, uvs, a, b, c );

						if ( intersection ) {

							intersection.index = a; // triangle number in positions buffer semantics
							intersects.push( intersection );

						}

					}

				}

			} else if ( geometry instanceof THREE.Geometry ) {

				var fvA, fvB, fvC;
				var isFaceMaterial = material instanceof THREE.MultiMaterial;
				var materials = isFaceMaterial === true ? material.materials : null;

				var vertices = geometry.vertices;
				var faces = geometry.faces;
				var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
				if ( faceVertexUvs.length > 0 ) uvs = faceVertexUvs;

				for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

					var face = faces[ f ];
					var faceMaterial = isFaceMaterial === true ? materials[ face.materialIndex ] : material;

					if ( faceMaterial === undefined ) continue;

					fvA = vertices[ face.a ];
					fvB = vertices[ face.b ];
					fvC = vertices[ face.c ];

					if ( faceMaterial.morphTargets === true ) {

						var morphTargets = geometry.morphTargets;
						var morphInfluences = this.morphTargetInfluences;

						vA.set( 0, 0, 0 );
						vB.set( 0, 0, 0 );
						vC.set( 0, 0, 0 );

						for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

							var influence = morphInfluences[ t ];

							if ( influence === 0 ) continue;

							var targets = morphTargets[ t ].vertices;

							vA.addScaledVector( tempA.subVectors( targets[ face.a ], fvA ), influence );
							vB.addScaledVector( tempB.subVectors( targets[ face.b ], fvB ), influence );
							vC.addScaledVector( tempC.subVectors( targets[ face.c ], fvC ), influence );

						}

						vA.add( fvA );
						vB.add( fvB );
						vC.add( fvC );

						fvA = vA;
						fvB = vB;
						fvC = vC;

					}

					intersection = checkIntersection( this, raycaster, ray, fvA, fvB, fvC, intersectionPoint );

					if ( intersection ) {

						if ( uvs ) {

							var uvs_f = uvs[ f ];
							uvA.copy( uvs_f[ 0 ] );
							uvB.copy( uvs_f[ 1 ] );
							uvC.copy( uvs_f[ 2 ] );

							intersection.uv = uvIntersection( intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC );

						}

						intersection.face = face;
						intersection.faceIndex = f;
						intersects.push( intersection );

					}

				}

			}

		};

	}() ),

	clone: function () {

		return new this.constructor( this.geometry, this.material ).copy( this );

	}

} );

// File:src/objects/Bone.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.Bone = function ( skin ) {

	THREE.Object3D.call( this );

	this.type = 'Bone';

	this.skin = skin;

};

THREE.Bone.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Bone,

	copy: function ( source ) {

		THREE.Object3D.prototype.copy.call( this, source );

		this.skin = source.skin;

		return this;

	}

} );

// File:src/objects/Skeleton.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author michael guerrero / http://realitymeltdown.com
 * @author ikerr / http://verold.com
 */

THREE.Skeleton = function ( bones, boneInverses, useVertexTexture ) {

	this.useVertexTexture = useVertexTexture !== undefined ? useVertexTexture : true;

	this.identityMatrix = new THREE.Matrix4();

	// copy the bone array

	bones = bones || [];

	this.bones = bones.slice( 0 );

	// create a bone texture or an array of floats

	if ( this.useVertexTexture ) {

		// layout (1 matrix = 4 pixels)
		//      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
		//  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
		//       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
		//       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
		//       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)


		var size = Math.sqrt( this.bones.length * 4 ); // 4 pixels needed for 1 matrix
		size = THREE.Math.nextPowerOfTwo( Math.ceil( size ) );
		size = Math.max( size, 4 );

		this.boneTextureWidth = size;
		this.boneTextureHeight = size;

		this.boneMatrices = new Float32Array( this.boneTextureWidth * this.boneTextureHeight * 4 ); // 4 floats per RGBA pixel
		this.boneTexture = new THREE.DataTexture( this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType );

	} else {

		this.boneMatrices = new Float32Array( 16 * this.bones.length );

	}

	// use the supplied bone inverses or calculate the inverses

	if ( boneInverses === undefined ) {

		this.calculateInverses();

	} else {

		if ( this.bones.length === boneInverses.length ) {

			this.boneInverses = boneInverses.slice( 0 );

		} else {

			console.warn( 'THREE.Skeleton bonInverses is the wrong length.' );

			this.boneInverses = [];

			for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

				this.boneInverses.push( new THREE.Matrix4() );

			}

		}

	}

};

Object.assign( THREE.Skeleton.prototype, {

	calculateInverses: function () {

		this.boneInverses = [];

		for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

			var inverse = new THREE.Matrix4();

			if ( this.bones[ b ] ) {

				inverse.getInverse( this.bones[ b ].matrixWorld );

			}

			this.boneInverses.push( inverse );

		}

	},

	pose: function () {

		var bone;

		// recover the bind-time world matrices

		for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

			bone = this.bones[ b ];

			if ( bone ) {

				bone.matrixWorld.getInverse( this.boneInverses[ b ] );

			}

		}

		// compute the local matrices, positions, rotations and scales

		for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

			bone = this.bones[ b ];

			if ( bone ) {

				if ( bone.parent ) {

					bone.matrix.getInverse( bone.parent.matrixWorld );
					bone.matrix.multiply( bone.matrixWorld );

				} else {

					bone.matrix.copy( bone.matrixWorld );

				}

				bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

			}

		}

	},

	update: ( function () {

		var offsetMatrix = new THREE.Matrix4();

		return function update() {

			// flatten bone matrices to array

			for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

				// compute the offset between the current and the original transform

				var matrix = this.bones[ b ] ? this.bones[ b ].matrixWorld : this.identityMatrix;

				offsetMatrix.multiplyMatrices( matrix, this.boneInverses[ b ] );
				offsetMatrix.toArray( this.boneMatrices, b * 16 );

			}

			if ( this.useVertexTexture ) {

				this.boneTexture.needsUpdate = true;

			}

		};

	} )(),

	clone: function () {

		return new THREE.Skeleton( this.bones, this.boneInverses, this.useVertexTexture );

	}

} );

// File:src/objects/SkinnedMesh.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.SkinnedMesh = function ( geometry, material, useVertexTexture ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'SkinnedMesh';

	this.bindMode = "attached";
	this.bindMatrix = new THREE.Matrix4();
	this.bindMatrixInverse = new THREE.Matrix4();

	// init bones

	// TODO: remove bone creation as there is no reason (other than
	// convenience) for THREE.SkinnedMesh to do this.

	var bones = [];

	if ( this.geometry && this.geometry.bones !== undefined ) {

		var bone, gbone;

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++ b ) {

			gbone = this.geometry.bones[ b ];

			bone = new THREE.Bone( this );
			bones.push( bone );

			bone.name = gbone.name;
			bone.position.fromArray( gbone.pos );
			bone.quaternion.fromArray( gbone.rotq );
			if ( gbone.scl !== undefined ) bone.scale.fromArray( gbone.scl );

		}

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++ b ) {

			gbone = this.geometry.bones[ b ];

			if ( gbone.parent !== - 1 && gbone.parent !== null &&
					bones[ gbone.parent ] !== undefined ) {

				bones[ gbone.parent ].add( bones[ b ] );

			} else {

				this.add( bones[ b ] );

			}

		}

	}

	this.normalizeSkinWeights();

	this.updateMatrixWorld( true );
	this.bind( new THREE.Skeleton( bones, undefined, useVertexTexture ), this.matrixWorld );

};


THREE.SkinnedMesh.prototype = Object.assign( Object.create( THREE.Mesh.prototype ), {

	constructor: THREE.SkinnedMesh,

	bind: function( skeleton, bindMatrix ) {

		this.skeleton = skeleton;

		if ( bindMatrix === undefined ) {

			this.updateMatrixWorld( true );

			this.skeleton.calculateInverses();

			bindMatrix = this.matrixWorld;

		}

		this.bindMatrix.copy( bindMatrix );
		this.bindMatrixInverse.getInverse( bindMatrix );

	},

	pose: function () {

		this.skeleton.pose();

	},

	normalizeSkinWeights: function () {

		if ( this.geometry instanceof THREE.Geometry ) {

			for ( var i = 0; i < this.geometry.skinWeights.length; i ++ ) {

				var sw = this.geometry.skinWeights[ i ];

				var scale = 1.0 / sw.lengthManhattan();

				if ( scale !== Infinity ) {

					sw.multiplyScalar( scale );

				} else {

					sw.set( 1, 0, 0, 0 ); // do something reasonable

				}

			}

		} else if ( this.geometry instanceof THREE.BufferGeometry ) {

			var vec = new THREE.Vector4();

			var skinWeight = this.geometry.attributes.skinWeight;

			for ( var i = 0; i < skinWeight.count; i ++ ) {

				vec.x = skinWeight.getX( i );
				vec.y = skinWeight.getY( i );
				vec.z = skinWeight.getZ( i );
				vec.w = skinWeight.getW( i );

				var scale = 1.0 / vec.lengthManhattan();

				if ( scale !== Infinity ) {

					vec.multiplyScalar( scale );

				} else {

					vec.set( 1, 0, 0, 0 ); // do something reasonable

				}

				skinWeight.setXYZW( i, vec.x, vec.y, vec.z, vec.w );

			}

		}

	},

	updateMatrixWorld: function( force ) {

		THREE.Mesh.prototype.updateMatrixWorld.call( this, true );

		if ( this.bindMode === "attached" ) {

			this.bindMatrixInverse.getInverse( this.matrixWorld );

		} else if ( this.bindMode === "detached" ) {

			this.bindMatrixInverse.getInverse( this.bindMatrix );

		} else {

			console.warn( 'THREE.SkinnedMesh unrecognized bindMode: ' + this.bindMode );

		}

	},

	clone: function() {

		return new this.constructor( this.geometry, this.material, this.useVertexTexture ).copy( this );

	}

} );

// File:src/objects/LOD.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LOD = function () {

	THREE.Object3D.call( this );

	this.type = 'LOD';

	Object.defineProperties( this, {
		levels: {
			enumerable: true,
			value: []
		}
	} );

};


THREE.LOD.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.LOD,

	copy: function ( source ) {

		THREE.Object3D.prototype.copy.call( this, source, false );

		var levels = source.levels;

		for ( var i = 0, l = levels.length; i < l; i ++ ) {

			var level = levels[ i ];

			this.addLevel( level.object.clone(), level.distance );

		}

		return this;

	},

	addLevel: function ( object, distance ) {

		if ( distance === undefined ) distance = 0;

		distance = Math.abs( distance );

		var levels = this.levels;

		for ( var l = 0; l < levels.length; l ++ ) {

			if ( distance < levels[ l ].distance ) {

				break;

			}

		}

		levels.splice( l, 0, { distance: distance, object: object } );

		this.add( object );

	},

	getObjectForDistance: function ( distance ) {

		var levels = this.levels;

		for ( var i = 1, l = levels.length; i < l; i ++ ) {

			if ( distance < levels[ i ].distance ) {

				break;

			}

		}

		return levels[ i - 1 ].object;

	},

	raycast: ( function () {

		var matrixPosition = new THREE.Vector3();

		return function raycast( raycaster, intersects ) {

			matrixPosition.setFromMatrixPosition( this.matrixWorld );

			var distance = raycaster.ray.origin.distanceTo( matrixPosition );

			this.getObjectForDistance( distance ).raycast( raycaster, intersects );

		};

	}() ),

	update: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function update( camera ) {

			var levels = this.levels;

			if ( levels.length > 1 ) {

				v1.setFromMatrixPosition( camera.matrixWorld );
				v2.setFromMatrixPosition( this.matrixWorld );

				var distance = v1.distanceTo( v2 );

				levels[ 0 ].object.visible = true;

				for ( var i = 1, l = levels.length; i < l; i ++ ) {

					if ( distance >= levels[ i ].distance ) {

						levels[ i - 1 ].object.visible = false;
						levels[ i ].object.visible = true;

					} else {

						break;

					}

				}

				for ( ; i < l; i ++ ) {

					levels[ i ].object.visible = false;

				}

			}

		};

	}(),

	toJSON: function ( meta ) {

		var data = THREE.Object3D.prototype.toJSON.call( this, meta );

		data.object.levels = [];

		var levels = this.levels;

		for ( var i = 0, l = levels.length; i < l; i ++ ) {

			var level = levels[ i ];

			data.object.levels.push( {
				object: level.object.uuid,
				distance: level.distance
			} );

		}

		return data;

	}

} );

// File:src/objects/Sprite.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Sprite = function ( material ) {

	THREE.Object3D.call( this );

	this.type = 'Sprite';

	this.material = ( material !== undefined ) ? material : new THREE.SpriteMaterial();

};

THREE.Sprite.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.Sprite,

	raycast: ( function () {

		var matrixPosition = new THREE.Vector3();

		return function raycast( raycaster, intersects ) {

			matrixPosition.setFromMatrixPosition( this.matrixWorld );

			var distanceSq = raycaster.ray.distanceSqToPoint( matrixPosition );
			var guessSizeSq = this.scale.x * this.scale.y / 4;

			if ( distanceSq > guessSizeSq ) {

				return;

			}

			intersects.push( {

				distance: Math.sqrt( distanceSq ),
				point: this.position,
				face: null,
				object: this

			} );

		};

	}() ),

	clone: function () {

		return new this.constructor( this.material ).copy( this );

	}

} );

// File:src/objects/LensFlare.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlare = function ( texture, size, distance, blending, color ) {

	THREE.Object3D.call( this );

	this.lensFlares = [];

	this.positionScreen = new THREE.Vector3();
	this.customUpdateCallback = undefined;

	if ( texture !== undefined ) {

		this.add( texture, size, distance, blending, color );

	}

};

THREE.LensFlare.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: THREE.LensFlare,

	copy: function ( source ) {

		THREE.Object3D.prototype.copy.call( this, source );

		this.positionScreen.copy( source.positionScreen );
		this.customUpdateCallback = source.customUpdateCallback;

		for ( var i = 0, l = source.lensFlares.length; i < l; i ++ ) {

			this.lensFlares.push( source.lensFlares[ i ] );

		}

		return this;

	},

	add: function ( texture, size, distance, blending, color, opacity ) {

		if ( size === undefined ) size = - 1;
		if ( distance === undefined ) distance = 0;
		if ( opacity === undefined ) opacity = 1;
		if ( color === undefined ) color = new THREE.Color( 0xffffff );
		if ( blending === undefined ) blending = THREE.NormalBlending;

		distance = Math.min( distance, Math.max( 0, distance ) );

		this.lensFlares.push( {
			texture: texture,	// THREE.Texture
			size: size, 		// size in pixels (-1 = use texture.width)
			distance: distance, 	// distance (0-1) from light source (0=at light source)
			x: 0, y: 0, z: 0,	// screen position (-1 => 1) z = 0 is in front z = 1 is back
			scale: 1, 		// scale
			rotation: 0, 		// rotation
			opacity: opacity,	// opacity
			color: color,		// color
			blending: blending	// blending
		} );

	},

	/*
	 * Update lens flares update positions on all flares based on the screen position
	 * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
	 */

	updateLensFlares: function () {

		var f, fl = this.lensFlares.length;
		var flare;
		var vecX = - this.positionScreen.x * 2;
		var vecY = - this.positionScreen.y * 2;

		for ( f = 0; f < fl; f ++ ) {

			flare = this.lensFlares[ f ];

			flare.x = this.positionScreen.x + vecX * flare.distance;
			flare.y = this.positionScreen.y + vecY * flare.distance;

			flare.wantedRotation = flare.x * Math.PI * 0.25;
			flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;

		}

	}

} );

// File:src/scenes/Scene.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.type = 'Scene';

	this.fog = null;
	this.overrideMaterial = null;

	this.autoUpdate = true; // checked by the renderer

};

THREE.Scene.prototype = Object.create( THREE.Object3D.prototype );
THREE.Scene.prototype.constructor = THREE.Scene;

THREE.Scene.prototype.copy = function ( source, recursive ) {

	THREE.Object3D.prototype.copy.call( this, source, recursive );

	if ( source.fog !== null ) this.fog = source.fog.clone();
	if ( source.overrideMaterial !== null ) this.overrideMaterial = source.overrideMaterial.clone();

	this.autoUpdate = source.autoUpdate;
	this.matrixAutoUpdate = source.matrixAutoUpdate;

	return this;

};

// File:src/scenes/Fog.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Fog = function ( color, near, far ) {

	this.name = '';

	this.color = new THREE.Color( color );

	this.near = ( near !== undefined ) ? near : 1;
	this.far = ( far !== undefined ) ? far : 1000;

};

THREE.Fog.prototype.clone = function () {

	return new THREE.Fog( this.color.getHex(), this.near, this.far );

};

// File:src/scenes/FogExp2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.FogExp2 = function ( color, density ) {

	this.name = '';

	this.color = new THREE.Color( color );
	this.density = ( density !== undefined ) ? density : 0.00025;

};

THREE.FogExp2.prototype.clone = function () {

	return new THREE.FogExp2( this.color.getHex(), this.density );

};

// File:src/renderers/shaders/ShaderChunk.js

THREE.ShaderChunk = {};

// File:src/renderers/shaders/ShaderChunk/alphamap_fragment.glsl

THREE.ShaderChunk[ 'alphamap_fragment' ] = "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/alphamap_pars_fragment.glsl

THREE.ShaderChunk[ 'alphamap_pars_fragment' ] = "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/alphatest_fragment.glsl

THREE.ShaderChunk[ 'alphatest_fragment' ] = "#ifdef ALPHATEST\n	if ( diffuseColor.a < ALPHATEST ) discard;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/aomap_fragment.glsl

THREE.ShaderChunk[ 'aomap_fragment' ] = "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/aomap_pars_fragment.glsl

THREE.ShaderChunk[ 'aomap_pars_fragment' ] = "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif";

// File:src/renderers/shaders/ShaderChunk/begin_vertex.glsl

THREE.ShaderChunk[ 'begin_vertex' ] = "\nvec3 transformed = vec3( position );\n";

// File:src/renderers/shaders/ShaderChunk/beginnormal_vertex.glsl

THREE.ShaderChunk[ 'beginnormal_vertex' ] = "\nvec3 objectNormal = vec3( normal );\n";

// File:src/renderers/shaders/ShaderChunk/bsdfs.glsl

THREE.ShaderChunk[ 'bsdfs' ] = "bool testLightInRange( const in float lightDistance, const in float cutoffDistance ) {\n	return any( bvec2( cutoffDistance == 0.0, lightDistance < cutoffDistance ) );\n}\nfloat punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n		if( decayExponent > 0.0 ) {\n#if defined ( PHYSICALLY_CORRECT_LIGHTS )\n			float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n			float maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n			return distanceFalloff * maxDistanceCutoffFactor;\n#else\n			return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n#endif\n		}\n		return 1.0;\n}\nvec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {\n	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n	return ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	return 1.0 / ( gl * gv );\n}\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\nvec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n	float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );\n	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n	float dotNH = saturate( dot( geometry.normal, halfDir ) );\n	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n	vec3 F = F_Schlick( specularColor, dotLH );\n	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n	float D = D_GGX( alpha, dotNH );\n	return F * ( G * D );\n}\nvec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n	vec4 r = roughness * c0 + c1;\n	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n	return specularColor * AB.x + AB.y;\n}\nfloat G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n	float dotNH = saturate( dot( geometry.normal, halfDir ) );\n	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n	vec3 F = F_Schlick( specularColor, dotLH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n}\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n	return sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}\n";

// File:src/renderers/shaders/ShaderChunk/bumpmap_pars_fragment.glsl

THREE.ShaderChunk[ 'bumpmap_pars_fragment' ] = "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 );\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/clipping_planes_fragment.glsl

THREE.ShaderChunk[ 'clipping_planes_fragment' ] = "#if NUM_CLIPPING_PLANES > 0\n	for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {\n		vec4 plane = clippingPlanes[ i ];\n		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n	}\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/clipping_planes_pars_fragment.glsl

THREE.ShaderChunk[ 'clipping_planes_pars_fragment' ] = "#if NUM_CLIPPING_PLANES > 0\n	#if ! defined( PHYSICAL ) && ! defined( PHONG )\n		varying vec3 vViewPosition;\n	#endif\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/clipping_planes_pars_vertex.glsl

THREE.ShaderChunk[ 'clipping_planes_pars_vertex' ] = "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n	varying vec3 vViewPosition;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/clipping_planes_vertex.glsl

THREE.ShaderChunk[ 'clipping_planes_vertex' ] = "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n	vViewPosition = - mvPosition.xyz;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/color_fragment.glsl

THREE.ShaderChunk[ 'color_fragment' ] = "#ifdef USE_COLOR\n	diffuseColor.rgb *= vColor;\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_pars_fragment.glsl

THREE.ShaderChunk[ 'color_pars_fragment' ] = "#ifdef USE_COLOR\n	varying vec3 vColor;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/color_pars_vertex.glsl

THREE.ShaderChunk[ 'color_pars_vertex' ] = "#ifdef USE_COLOR\n	varying vec3 vColor;\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_vertex.glsl

THREE.ShaderChunk[ 'color_vertex' ] = "#ifdef USE_COLOR\n	vColor.xyz = color.xyz;\n#endif";

// File:src/renderers/shaders/ShaderChunk/common.glsl

THREE.ShaderChunk[ 'common' ] = "#define PI 3.14159265359\n#define PI2 6.28318530718\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract(sin(sn) * c);\n}\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\nstruct GeometricContext {\n	vec3 position;\n	vec3 normal;\n	vec3 viewDir;\n};\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	float distance = dot( planeNormal, point - pointOnPlane );\n	return - distance * planeNormal + point;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n}\n";

// File:src/renderers/shaders/ShaderChunk/cube_uv_reflection_fragment.glsl

THREE.ShaderChunk[ 'cube_uv_reflection_fragment' ] = "#ifdef ENVMAP_TYPE_CUBE_UV\n#define cubeUV_textureSize (1024.0)\nint getFaceFromDirection(vec3 direction) {\n	vec3 absDirection = abs(direction);\n	int face = -1;\n	if( absDirection.x > absDirection.z ) {\n		if(absDirection.x > absDirection.y )\n			face = direction.x > 0.0 ? 0 : 3;\n		else\n			face = direction.y > 0.0 ? 1 : 4;\n	}\n	else {\n		if(absDirection.z > absDirection.y )\n			face = direction.z > 0.0 ? 2 : 5;\n		else\n			face = direction.y > 0.0 ? 1 : 4;\n	}\n	return face;\n}\n#define cubeUV_maxLods1  (log2(cubeUV_textureSize*0.25) - 1.0)\n#define cubeUV_rangeClamp (exp2((6.0 - 1.0) * 2.0))\nvec2 MipLevelInfo( vec3 vec, float roughnessLevel, float roughness ) {\n	float scale = exp2(cubeUV_maxLods1 - roughnessLevel);\n	float dxRoughness = dFdx(roughness);\n	float dyRoughness = dFdy(roughness);\n	vec3 dx = dFdx( vec * scale * dxRoughness );\n	vec3 dy = dFdy( vec * scale * dyRoughness );\n	float d = max( dot( dx, dx ), dot( dy, dy ) );\n	d = clamp(d, 1.0, cubeUV_rangeClamp);\n	float mipLevel = 0.5 * log2(d);\n	return vec2(floor(mipLevel), fract(mipLevel));\n}\n#define cubeUV_maxLods2 (log2(cubeUV_textureSize*0.25) - 2.0)\n#define cubeUV_rcpTextureSize (1.0 / cubeUV_textureSize)\nvec2 getCubeUV(vec3 direction, float roughnessLevel, float mipLevel) {\n	mipLevel = roughnessLevel > cubeUV_maxLods2 - 3.0 ? 0.0 : mipLevel;\n	float a = 16.0 * cubeUV_rcpTextureSize;\n	vec2 exp2_packed = exp2( vec2( roughnessLevel, mipLevel ) );\n	vec2 rcp_exp2_packed = vec2( 1.0 ) / exp2_packed;\n	float powScale = exp2_packed.x * exp2_packed.y;\n	float scale = rcp_exp2_packed.x * rcp_exp2_packed.y * 0.25;\n	float mipOffset = 0.75*(1.0 - rcp_exp2_packed.y) * rcp_exp2_packed.x;\n	bool bRes = mipLevel == 0.0;\n	scale =  bRes && (scale < a) ? a : scale;\n	vec3 r;\n	vec2 offset;\n	int face = getFaceFromDirection(direction);\n	float rcpPowScale = 1.0 / powScale;\n	if( face == 0) {\n		r = vec3(direction.x, -direction.z, direction.y);\n		offset = vec2(0.0+mipOffset,0.75 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n	}\n	else if( face == 1) {\n		r = vec3(direction.y, direction.x, direction.z);\n		offset = vec2(scale+mipOffset, 0.75 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n	}\n	else if( face == 2) {\n		r = vec3(direction.z, direction.x, direction.y);\n		offset = vec2(2.0*scale+mipOffset, 0.75 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n	}\n	else if( face == 3) {\n		r = vec3(direction.x, direction.z, direction.y);\n		offset = vec2(0.0+mipOffset,0.5 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n	}\n	else if( face == 4) {\n		r = vec3(direction.y, direction.x, -direction.z);\n		offset = vec2(scale+mipOffset, 0.5 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n	}\n	else {\n		r = vec3(direction.z, -direction.x, direction.y);\n		offset = vec2(2.0*scale+mipOffset, 0.5 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n	}\n	r = normalize(r);\n	float texelOffset = 0.5 * cubeUV_rcpTextureSize;\n	vec2 s = ( r.yz / abs( r.x ) + vec2( 1.0 ) ) * 0.5;\n	vec2 base = offset + vec2( texelOffset );\n	return base + s * ( scale - 2.0 * texelOffset );\n}\n#define cubeUV_maxLods3 (log2(cubeUV_textureSize*0.25) - 3.0)\nvec4 textureCubeUV(vec3 reflectedDirection, float roughness ) {\n	float roughnessVal = roughness* cubeUV_maxLods3;\n	float r1 = floor(roughnessVal);\n	float r2 = r1 + 1.0;\n	float t = fract(roughnessVal);\n	vec2 mipInfo = MipLevelInfo(reflectedDirection, r1, roughness);\n	float s = mipInfo.y;\n	float level0 = mipInfo.x;\n	float level1 = level0 + 1.0;\n	level1 = level1 > 5.0 ? 5.0 : level1;\n	level0 += min( floor( s + 0.5 ), 5.0 );\n	vec2 uv_10 = getCubeUV(reflectedDirection, r1, level0);\n	vec4 color10 = envMapTexelToLinear(texture2D(envMap, uv_10));\n	vec2 uv_20 = getCubeUV(reflectedDirection, r2, level0);\n	vec4 color20 = envMapTexelToLinear(texture2D(envMap, uv_20));\n	vec4 result = mix(color10, color20, t);\n	return vec4(result.rgb, 1.0);\n}\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/defaultnormal_vertex.glsl

THREE.ShaderChunk[ 'defaultnormal_vertex' ] = "#ifdef FLIP_SIDED\n	objectNormal = -objectNormal;\n#endif\nvec3 transformedNormal = normalMatrix * objectNormal;\n";

// File:src/renderers/shaders/ShaderChunk/displacementmap_vertex.glsl

THREE.ShaderChunk[ 'displacementmap_vertex' ] = "#ifdef USE_DISPLACEMENTMAP\n	transformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/displacementmap_pars_vertex.glsl

THREE.ShaderChunk[ 'displacementmap_pars_vertex' ] = "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/emissivemap_fragment.glsl

THREE.ShaderChunk[ 'emissivemap_fragment' ] = "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vUv );\n	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/emissivemap_pars_fragment.glsl

THREE.ShaderChunk[ 'emissivemap_pars_fragment' ] = "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/encodings_pars_fragment.glsl

THREE.ShaderChunk[ 'encodings_pars_fragment' ] = "\nvec4 LinearToLinear( in vec4 value ) {\n  return value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n  float maxComponent = max( max( value.r, value.g ), value.b );\n  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n  return vec4( value.xyz * value.w * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n  float maxRGB = max( value.x, max( value.g, value.b ) );\n  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\n  M            = ceil( M * 255.0 ) / 255.0;\n  return vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n    float maxRGB = max( value.x, max( value.g, value.b ) );\n    float D      = max( maxRange / maxRGB, 1.0 );\n    D            = min( floor( D ) / 255.0, 1.0 );\n    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value )  {\n  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n  vec4 vResult;\n  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n  vResult.w = fract(Le);\n  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n  return vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n  float Le = value.z * 255.0 + value.w;\n  vec3 Xp_Y_XYZp;\n  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n  return vec4( max(vRGB, 0.0), 1.0 );\n}\n";

// File:src/renderers/shaders/ShaderChunk/encodings_fragment.glsl

THREE.ShaderChunk[ 'encodings_fragment' ] = "  gl_FragColor = linearToOutputTexel( gl_FragColor );\n";

// File:src/renderers/shaders/ShaderChunk/envmap_fragment.glsl

THREE.ShaderChunk[ 'envmap_fragment' ] = "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToVertex, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef DOUBLE_SIDED\n		float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n	#else\n		float flipNormal = 1.0;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n	#elif defined( ENVMAP_TYPE_EQUIREC )\n		vec2 sampleUV;\n		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n		vec4 envColor = texture2D( envMap, sampleUV );\n	#elif defined( ENVMAP_TYPE_SPHERE )\n		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n	#endif\n	envColor = envMapTexelToLinear( envColor );\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n	#elif defined( ENVMAP_BLENDING_MIX )\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n	#elif defined( ENVMAP_BLENDING_ADD )\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_fragment.glsl

THREE.ShaderChunk[ 'envmap_pars_fragment' ] = "#if defined( USE_ENVMAP ) || defined( PHYSICAL )\n	uniform float reflectivity;\n	uniform float envMapIntenstiy;\n#endif\n#ifdef USE_ENVMAP\n	#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )\n		varying vec3 vWorldPosition;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	uniform float flipEnvMap;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_vertex.glsl

THREE.ShaderChunk[ 'envmap_pars_vertex' ] = "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_vertex.glsl

THREE.ShaderChunk[ 'envmap_vertex' ] = "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/fog_fragment.glsl

THREE.ShaderChunk[ 'fog_fragment' ] = "#ifdef USE_FOG\n	#ifdef USE_LOGDEPTHBUF_EXT\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n	#else\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n	#endif\n	#ifdef FOG_EXP2\n		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/fog_pars_fragment.glsl

THREE.ShaderChunk[ 'fog_pars_fragment' ] = "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_fragment.glsl

THREE.ShaderChunk[ 'lightmap_fragment' ] = "#ifdef USE_LIGHTMAP\n	reflectedLight.indirectDiffuse += PI * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lightmap_pars_fragment.glsl

THREE.ShaderChunk[ 'lightmap_pars_fragment' ] = "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_lambert_vertex.glsl

THREE.ShaderChunk[ 'lights_lambert_vertex' ] = "vec3 diffuse = vec3( 1.0 );\nGeometricContext geometry;\ngeometry.position = mvPosition.xyz;\ngeometry.normal = normalize( transformedNormal );\ngeometry.viewDir = normalize( -mvPosition.xyz );\nGeometricContext backGeometry;\nbackGeometry.position = geometry.position;\nbackGeometry.normal = -geometry.normal;\nbackGeometry.viewDir = geometry.viewDir;\nvLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\n	vLightBack = vec3( 0.0 );\n#endif\nIncidentLight directLight;\nfloat dotNL;\nvec3 directLightColor_Diffuse;\n#if NUM_POINT_LIGHTS > 0\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		getPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );\n		dotNL = dot( geometry.normal, directLight.direction );\n		directLightColor_Diffuse = PI * directLight.color;\n		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n		#ifdef DOUBLE_SIDED\n			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n		#endif\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		getSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );\n		dotNL = dot( geometry.normal, directLight.direction );\n		directLightColor_Diffuse = PI * directLight.color;\n		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n		#ifdef DOUBLE_SIDED\n			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n		#endif\n	}\n#endif\n#if NUM_DIR_LIGHTS > 0\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );\n		dotNL = dot( geometry.normal, directLight.direction );\n		directLightColor_Diffuse = PI * directLight.color;\n		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n		#ifdef DOUBLE_SIDED\n			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n		#endif\n	}\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n		vLightFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n		#ifdef DOUBLE_SIDED\n			vLightBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );\n		#endif\n	}\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_pars.glsl

THREE.ShaderChunk[ 'lights_pars' ] = "uniform vec3 ambientLightColor;\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	#ifndef PHYSICALLY_CORRECT_LIGHTS\n		irradiance *= PI;\n	#endif\n	return irradiance;\n}\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n		directLight.color = directionalLight.color;\n		directLight.direction = directionalLight.direction;\n		directLight.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n		vec3 lVector = pointLight.position - geometry.position;\n		directLight.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		if ( testLightInRange( lightDistance, pointLight.distance ) ) {\n			directLight.color = pointLight.color;\n			directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );\n			directLight.visible = true;\n		} else {\n			directLight.color = vec3( 0.0 );\n			directLight.visible = false;\n		}\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {\n		vec3 lVector = spotLight.position - geometry.position;\n		directLight.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		float angleCos = dot( directLight.direction, spotLight.direction );\n		if ( all( bvec2( angleCos > spotLight.coneCos, testLightInRange( lightDistance, spotLight.distance ) ) ) ) {\n			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n			directLight.color = spotLight.color;\n			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );\n			directLight.visible = true;\n		} else {\n			directLight.color = vec3( 0.0 );\n			directLight.visible = false;\n		}\n	}\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {\n		float dotNL = dot( geometry.normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		#ifndef PHYSICALLY_CORRECT_LIGHTS\n			irradiance *= PI;\n		#endif\n		return irradiance;\n	}\n#endif\n#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n	vec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {\n		#ifdef DOUBLE_SIDED\n			float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n		#else\n			float flipNormal = 1.0;\n		#endif\n		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n		#ifdef ENVMAP_TYPE_CUBE\n			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );\n			#else\n				vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#elif defined( ENVMAP_TYPE_CUBE_UV )\n			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n			vec4 envMapColor = textureCubeUV( queryVec, 1.0 );\n		#else\n			vec4 envMapColor = vec4( 0.0 );\n		#endif\n		return PI * envMapColor.rgb * envMapIntensity;\n	}\n	float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\n		float maxMIPLevelScalar = float( maxMIPLevel );\n		float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n	}\n	vec3 getLightProbeIndirectRadiance( const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );\n		#else\n			vec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );\n		#endif\n		#ifdef DOUBLE_SIDED\n			float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n		#else\n			float flipNormal = 1.0;\n		#endif\n		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n		float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\n		#ifdef ENVMAP_TYPE_CUBE\n			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );\n			#else\n				vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#elif defined( ENVMAP_TYPE_CUBE_UV )\n			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n			vec4 envMapColor = textureCubeUV(queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent));\n		#elif defined( ENVMAP_TYPE_EQUIREC )\n			vec2 sampleUV;\n			sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n			sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );\n			#else\n				vec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#elif defined( ENVMAP_TYPE_SPHERE )\n			vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n			#else\n				vec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#endif\n		return envMapColor.rgb * envMapIntensity;\n	}\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_fragment' ] = "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_pars_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_pars_fragment' ] = "varying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\nstruct BlinnPhongMaterial {\n	vec3	diffuseColor;\n	vec3	specularColor;\n	float	specularShininess;\n	float	specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifndef PHYSICALLY_CORRECT_LIGHTS\n		irradiance *= PI;\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong\n#define Material_LightProbeLOD( material )	(0)\n";

// File:src/renderers/shaders/ShaderChunk/lights_physical_fragment.glsl

THREE.ShaderChunk[ 'lights_physical_fragment' ] = "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.specularRoughness = clamp( roughnessFactor, 0.04, 1.0 );\n#ifdef STANDARD\n	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = mix( vec3( 0.16 * pow2( reflectivity ) ), diffuseColor.rgb, metalnessFactor );\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_physical_pars_fragment.glsl

THREE.ShaderChunk[ 'lights_physical_pars_fragment' ] = "struct PhysicalMaterial {\n	vec3	diffuseColor;\n	float	specularRoughness;\n	vec3	specularColor;\n	#ifndef STANDARD\n	#endif\n};\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifndef PHYSICALLY_CORRECT_LIGHTS\n		irradiance *= PI;\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_Specular_GGX( directLight, geometry, material.specularColor, material.specularRoughness );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectSpecular += radiance * BRDF_Specular_GGX_Environment( geometry, material.specularColor, material.specularRoughness );\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\n#define Material_BlinnShininessExponent( material )   GGXRoughnessToBlinnExponent( material.specularRoughness )\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}\n";

// File:src/renderers/shaders/ShaderChunk/lights_template.glsl

THREE.ShaderChunk[ 'lights_template' ] = "\nGeometricContext geometry;\ngeometry.position = - vViewPosition;\ngeometry.normal = normal;\ngeometry.viewDir = normalize( vViewPosition );\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointDirectLightIrradiance( pointLight, geometry, directLight );\n		#ifdef USE_SHADOWMAP\n		directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometry, material, reflectedLight );\n	}\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotDirectLightIrradiance( spotLight, geometry, directLight );\n		#ifdef USE_SHADOWMAP\n		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometry, material, reflectedLight );\n	}\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n		#ifdef USE_SHADOWMAP\n		directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometry, material, reflectedLight );\n	}\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#ifdef USE_LIGHTMAP\n		vec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n		#ifndef PHYSICALLY_CORRECT_LIGHTS\n			lightMapIrradiance *= PI;\n		#endif\n		irradiance += lightMapIrradiance;\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n		}\n	#endif\n	#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )\n	 	irradiance += getLightProbeIndirectIrradiance( geometry, 8 );\n	#endif\n	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	vec3 radiance = getLightProbeIndirectRadiance( geometry, Material_BlinnShininessExponent( material ), 8 );\n	RE_IndirectSpecular( radiance, geometry, material, reflectedLight );\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_fragment' ] = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_fragment' ] = "#ifdef USE_LOGDEPTHBUF\n	uniform float logDepthBufFC;\n	#ifdef USE_LOGDEPTHBUF_EXT\n		varying float vFragDepth;\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_vertex' ] = "#ifdef USE_LOGDEPTHBUF\n	#ifdef USE_LOGDEPTHBUF_EXT\n		varying float vFragDepth;\n	#endif\n	uniform float logDepthBufFC;\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_vertex' ] = "#ifdef USE_LOGDEPTHBUF\n	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n	#ifdef USE_LOGDEPTHBUF_EXT\n		vFragDepth = 1.0 + gl_Position.w;\n	#else\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/map_fragment.glsl

THREE.ShaderChunk[ 'map_fragment' ] = "#ifdef USE_MAP\n	vec4 texelColor = texture2D( map, vUv );\n	texelColor = mapTexelToLinear( texelColor );\n	diffuseColor *= texelColor;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/map_pars_fragment.glsl

THREE.ShaderChunk[ 'map_pars_fragment' ] = "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/map_particle_fragment.glsl

THREE.ShaderChunk[ 'map_particle_fragment' ] = "#ifdef USE_MAP\n	vec4 mapTexel = texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy );\n	diffuseColor *= mapTexelToLinear( mapTexel );\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/map_particle_pars_fragment.glsl

THREE.ShaderChunk[ 'map_particle_pars_fragment' ] = "#ifdef USE_MAP\n	uniform vec4 offsetRepeat;\n	uniform sampler2D map;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/metalnessmap_fragment.glsl

THREE.ShaderChunk[ 'metalnessmap_fragment' ] = "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vUv );\n	metalnessFactor *= texelMetalness.r;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/metalnessmap_pars_fragment.glsl

THREE.ShaderChunk[ 'metalnessmap_pars_fragment' ] = "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphnormal_vertex.glsl

THREE.ShaderChunk[ 'morphnormal_vertex' ] = "#ifdef USE_MORPHNORMALS\n	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/morphtarget_pars_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_pars_vertex' ] = "#ifdef USE_MORPHTARGETS\n	#ifndef USE_MORPHNORMALS\n	uniform float morphTargetInfluences[ 8 ];\n	#else\n	uniform float morphTargetInfluences[ 4 ];\n	#endif\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphtarget_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_vertex' ] = "#ifdef USE_MORPHTARGETS\n	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n	#ifndef USE_MORPHNORMALS\n	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/normal_fragment.glsl

THREE.ShaderChunk[ 'normal_fragment' ] = "#ifdef FLAT_SHADED\n	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\n	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n	#endif\n#endif\n#ifdef USE_NORMALMAP\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/normalmap_pars_fragment.glsl

THREE.ShaderChunk[ 'normalmap_pars_fragment' ] = "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n	}\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/packing.glsl

THREE.ShaderChunk[ 'packing' ] = "vec3 packNormalToRGB( const in vec3 normal ) {\n  return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n  return 1.0 - 2.0 * rgb.xyz;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n	vec4 r = vec4( fract( v * PackFactors ), v );\n	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n	return dot( v, UnpackFactors );\n}\nfloat viewZToOrthoDepth( const in float viewZ, const in float near, const in float far ) {\n  return ( viewZ + near ) / ( near - far );\n}\nfloat OrthoDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n  return linearClipZ * ( near - far ) - near;\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n  return ( near * far ) / ( ( far - near ) * invClipZ - far );\n}\n";

// File:src/renderers/shaders/ShaderChunk/premultiplied_alpha_fragment.glsl

THREE.ShaderChunk[ 'premultiplied_alpha_fragment' ] = "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/project_vertex.glsl

THREE.ShaderChunk[ 'project_vertex' ] = "#ifdef USE_SKINNING\n	vec4 mvPosition = modelViewMatrix * skinned;\n#else\n	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n#endif\ngl_Position = projectionMatrix * mvPosition;\n";

// File:src/renderers/shaders/ShaderChunk/roughnessmap_fragment.glsl

THREE.ShaderChunk[ 'roughnessmap_fragment' ] = "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vUv );\n	roughnessFactor *= texelRoughness.r;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/roughnessmap_pars_fragment.glsl

THREE.ShaderChunk[ 'roughnessmap_pars_fragment' ] = "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl

THREE.ShaderChunk[ 'shadowmap_pars_fragment' ] = "#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n	#endif\n	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n	}\n	float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n		const vec2 offset = vec2( 0.0, 1.0 );\n		vec2 texelSize = vec2( 1.0 ) / size;\n		vec2 centroidUV = floor( uv * size + 0.5 ) / size;\n		float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n		float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n		float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n		float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n		vec2 f = fract( uv * size + 0.5 );\n		float a = mix( lb, lt, f.y );\n		float b = mix( rb, rt, f.y );\n		float c = mix( a, b, f.x );\n		return c;\n	}\n	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n		shadowCoord.xyz /= shadowCoord.w;\n		shadowCoord.z += shadowBias;\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n		bool frustumTest = all( frustumTestVec );\n		if ( frustumTest ) {\n		#if defined( SHADOWMAP_TYPE_PCF )\n			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n			float dx0 = - texelSize.x * shadowRadius;\n			float dy0 = - texelSize.y * shadowRadius;\n			float dx1 = + texelSize.x * shadowRadius;\n			float dy1 = + texelSize.y * shadowRadius;\n			return (\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n			) * ( 1.0 / 9.0 );\n		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n			float dx0 = - texelSize.x * shadowRadius;\n			float dy0 = - texelSize.y * shadowRadius;\n			float dx1 = + texelSize.x * shadowRadius;\n			float dy1 = + texelSize.y * shadowRadius;\n			return (\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n			) * ( 1.0 / 9.0 );\n		#else\n			return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n		#endif\n		}\n		return 1.0;\n	}\n	vec2 cubeToUV( vec3 v, float texelSizeY ) {\n		vec3 absV = abs( v );\n		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n		absV *= scaleToCube;\n		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n		vec2 planar = v.xy;\n		float almostATexel = 1.5 * texelSizeY;\n		float almostOne = 1.0 - almostATexel;\n		if ( absV.z >= almostOne ) {\n			if ( v.z > 0.0 )\n				planar.x = 4.0 - v.x;\n		} else if ( absV.x >= almostOne ) {\n			float signX = sign( v.x );\n			planar.x = v.z * signX + 2.0 * signX;\n		} else if ( absV.y >= almostOne ) {\n			float signY = sign( v.y );\n			planar.x = v.x + 2.0 * signY + 2.0;\n			planar.y = v.z * signY - 2.0;\n		}\n		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n	}\n	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 bd3D = normalize( lightToPosition );\n		float dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;\n		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n			return (\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n			) * ( 1.0 / 9.0 );\n		#else\n			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n		#endif\n	}\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_pars_vertex' ] = "#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/shadowmap_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_vertex' ] = "#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n	}\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n	}\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * worldPosition;\n	}\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/shadowmask_pars_fragment.glsl

THREE.ShaderChunk[ 'shadowmask_pars_fragment' ] = "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n	DirectionalLight directionalLight;\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		shadow *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n	SpotLight spotLight;\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		shadow *= bool( spotLight.shadow ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n	}\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n	PointLight pointLight;\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		shadow *= bool( pointLight.shadow ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\n	}\n	#endif\n	#endif\n	return shadow;\n}\n";

// File:src/renderers/shaders/ShaderChunk/skinbase_vertex.glsl

THREE.ShaderChunk[ 'skinbase_vertex' ] = "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl

THREE.ShaderChunk[ 'skinning_pars_vertex' ] = "#ifdef USE_SKINNING\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n	#ifdef BONE_TEXTURE\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n		mat4 getBoneMatrix( const in float i ) {\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n			y = dy * ( y + 0.5 );\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n			mat4 bone = mat4( v1, v2, v3, v4 );\n			return bone;\n		}\n	#else\n		uniform mat4 boneMatrices[ MAX_BONES ];\n		mat4 getBoneMatrix( const in float i ) {\n			mat4 bone = boneMatrices[ int(i) ];\n			return bone;\n		}\n	#endif\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/skinning_vertex.glsl

THREE.ShaderChunk[ 'skinning_vertex' ] = "#ifdef USE_SKINNING\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/skinnormal_vertex.glsl

THREE.ShaderChunk[ 'skinnormal_vertex' ] = "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/specularmap_fragment.glsl

THREE.ShaderChunk[ 'specularmap_fragment' ] = "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif";

// File:src/renderers/shaders/ShaderChunk/specularmap_pars_fragment.glsl

THREE.ShaderChunk[ 'specularmap_pars_fragment' ] = "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif";

// File:src/renderers/shaders/ShaderChunk/tonemapping_fragment.glsl

THREE.ShaderChunk[ 'tonemapping_fragment' ] = "#if defined( TONE_MAPPING )\n  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/tonemapping_pars_fragment.glsl

THREE.ShaderChunk[ 'tonemapping_pars_fragment' ] = "#define saturate(a) clamp( a, 0.0, 1.0 )\nuniform float toneMappingExposure;\nuniform float toneMappingWhitePoint;\nvec3 LinearToneMapping( vec3 color ) {\n  return toneMappingExposure * color;\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  return saturate( color / ( vec3( 1.0 ) + color ) );\n}\n#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )\nvec3 Uncharted2ToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );\n}\nvec3 OptimizedCineonToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  color = max( vec3( 0.0 ), color - 0.004 );\n  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\n";

// File:src/renderers/shaders/ShaderChunk/uv2_pars_fragment.glsl

THREE.ShaderChunk[ 'uv2_pars_fragment' ] = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n	varying vec2 vUv2;\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv2_pars_vertex.glsl

THREE.ShaderChunk[ 'uv2_pars_vertex' ] = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n	attribute vec2 uv2;\n	varying vec2 vUv2;\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv2_vertex.glsl

THREE.ShaderChunk[ 'uv2_vertex' ] = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n	vUv2 = uv2;\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv_pars_fragment.glsl

THREE.ShaderChunk[ 'uv_pars_fragment' ] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n	varying vec2 vUv;\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv_pars_vertex.glsl

THREE.ShaderChunk[ 'uv_pars_vertex' ] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/uv_vertex.glsl

THREE.ShaderChunk[ 'uv_vertex' ] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif";

// File:src/renderers/shaders/ShaderChunk/worldpos_vertex.glsl

THREE.ShaderChunk[ 'worldpos_vertex' ] = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( PHYSICAL ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n	#ifdef USE_SKINNING\n		vec4 worldPosition = modelMatrix * skinned;\n	#else\n		vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n	#endif\n#endif\n";

// File:src/renderers/shaders/UniformsUtils.js

/**
 * Uniform Utilities
 */

THREE.UniformsUtils = {

	merge: function ( uniforms ) {

		var merged = {};

		for ( var u = 0; u < uniforms.length; u ++ ) {

			var tmp = this.clone( uniforms[ u ] );

			for ( var p in tmp ) {

				merged[ p ] = tmp[ p ];

			}

		}

		return merged;

	},

	clone: function ( uniforms_src ) {

		var uniforms_dst = {};

		for ( var u in uniforms_src ) {

			uniforms_dst[ u ] = {};

			for ( var p in uniforms_src[ u ] ) {

				var parameter_src = uniforms_src[ u ][ p ];

				if ( parameter_src instanceof THREE.Color ||
					 parameter_src instanceof THREE.Vector2 ||
					 parameter_src instanceof THREE.Vector3 ||
					 parameter_src instanceof THREE.Vector4 ||
					 parameter_src instanceof THREE.Matrix3 ||
					 parameter_src instanceof THREE.Matrix4 ||
					 parameter_src instanceof THREE.Texture ) {

					uniforms_dst[ u ][ p ] = parameter_src.clone();

				} else if ( Array.isArray( parameter_src ) ) {

					uniforms_dst[ u ][ p ] = parameter_src.slice();

				} else {

					uniforms_dst[ u ][ p ] = parameter_src;

				}

			}

		}

		return uniforms_dst;

	}

};

// File:src/renderers/shaders/UniformsLib.js

/**
 * Uniforms library for shared webgl shaders
 */

THREE.UniformsLib = {

	common: {

		"diffuse": { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity": { type: "1f", value: 1.0 },

		"map": { type: "t", value: null },
		"offsetRepeat": { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) },

		"specularMap": { type: "t", value: null },
		"alphaMap": { type: "t", value: null },

		"envMap": { type: "t", value: null },
		"flipEnvMap": { type: "1f", value: - 1 },
		"reflectivity": { type: "1f", value: 1.0 },
		"refractionRatio": { type: "1f", value: 0.98 }

	},

	aomap: {

		"aoMap": { type: "t", value: null },
		"aoMapIntensity": { type: "1f", value: 1 }

	},

	lightmap: {

		"lightMap": { type: "t", value: null },
		"lightMapIntensity": { type: "1f", value: 1 }

	},

	emissivemap: {

		"emissiveMap": { type: "t", value: null }

	},

	bumpmap: {

		"bumpMap": { type: "t", value: null },
		"bumpScale": { type: "1f", value: 1 }

	},

	normalmap: {

		"normalMap": { type: "t", value: null },
		"normalScale": { type: "v2", value: new THREE.Vector2( 1, 1 ) }

	},

	displacementmap: {

		"displacementMap": { type: "t", value: null },
		"displacementScale": { type: "1f", value: 1 },
		"displacementBias": { type: "1f", value: 0 }

	},

	roughnessmap: {

		"roughnessMap": { type: "t", value: null }

	},

	metalnessmap: {

		"metalnessMap": { type: "t", value: null }

	},

	fog: {

		"fogDensity": { type: "1f", value: 0.00025 },
		"fogNear": { type: "1f", value: 1 },
		"fogFar": { type: "1f", value: 2000 },
		"fogColor": { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	lights: {

		"ambientLightColor": { type: "3fv", value: [] },

		"directionalLights": { type: "sa", value: [], properties: {
			"direction": { type: "v3" },
			"color": { type: "c" },

			"shadow": { type: "1i" },
			"shadowBias": { type: "1f" },
			"shadowRadius": { type: "1f" },
			"shadowMapSize": { type: "v2" }
		} },

		"directionalShadowMap": { type: "tv", value: [] },
		"directionalShadowMatrix": { type: "m4v", value: [] },

		"spotLights": { type: "sa", value: [], properties: {
			"color": { type: "c" },
			"position": { type: "v3" },
			"direction": { type: "v3" },
			"distance": { type: "1f" },
			"coneCos": { type: "1f" },
			"penumbraCos": { type: "1f" },
			"decay": { type: "1f" },

			"shadow": { type: "1i" },
			"shadowBias": { type: "1f" },
			"shadowRadius": { type: "1f" },
			"shadowMapSize": { type: "v2" }
		} },

		"spotShadowMap": { type: "tv", value: [] },
		"spotShadowMatrix": { type: "m4v", value: [] },

		"pointLights": { type: "sa", value: [], properties: {
			"color": { type: "c" },
			"position": { type: "v3" },
			"decay": { type: "1f" },
			"distance": { type: "1f" },

			"shadow": { type: "1i" },
			"shadowBias": { type: "1f" },
			"shadowRadius": { type: "1f" },
			"shadowMapSize": { type: "v2" }
		} },

		"pointShadowMap": { type: "tv", value: [] },
		"pointShadowMatrix": { type: "m4v", value: [] },

		"hemisphereLights": { type: "sa", value: [], properties: {
			"direction": { type: "v3" },
			"skyColor": { type: "c" },
			"groundColor": { type: "c" }
		} }

	},

	points: {

		"diffuse": { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity": { type: "1f", value: 1.0 },
		"size": { type: "1f", value: 1.0 },
		"scale": { type: "1f", value: 1.0 },
		"map": { type: "t", value: null },
		"offsetRepeat": { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) }

	}

};

// File:src/renderers/shaders/ShaderLib/cube_frag.glsl

THREE.ShaderChunk[ 'cube_frag' ] = "uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n	#include <logdepthbuf_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/cube_vert.glsl

THREE.ShaderChunk[ 'cube_vert' ] = "varying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vWorldPosition = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/depth_frag.glsl

THREE.ShaderChunk[ 'depth_frag' ] = "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( 1.0 );\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <logdepthbuf_fragment>\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( gl_FragCoord.z ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( gl_FragCoord.z );\n	#endif\n}\n";

// File:src/renderers/shaders/ShaderLib/depth_vert.glsl

THREE.ShaderChunk[ 'depth_vert' ] = "#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <skinbase_vertex>\n	#include <begin_vertex>\n	#include <displacementmap_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/distanceRGBA_frag.glsl

THREE.ShaderChunk[ 'distanceRGBA_frag' ] = "uniform vec3 lightPos;\nvarying vec4 vWorldPosition;\n#include <common>\n#include <packing>\n#include <clipping_planes_pars_fragment>\nvoid main () {\n	#include <clipping_planes_fragment>\n	gl_FragColor = packDepthToRGBA( length( vWorldPosition.xyz - lightPos.xyz ) / 1000.0 );\n}\n";

// File:src/renderers/shaders/ShaderLib/distanceRGBA_vert.glsl

THREE.ShaderChunk[ 'distanceRGBA_vert' ] = "varying vec4 vWorldPosition;\n#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <skinbase_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition;\n}\n";

// File:src/renderers/shaders/ShaderLib/equirect_frag.glsl

THREE.ShaderChunk[ 'equirect_frag' ] = "uniform sampler2D tEquirect;\nuniform float tFlip;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec3 direction = normalize( vWorldPosition );\n	vec2 sampleUV;\n	sampleUV.y = saturate( tFlip * direction.y * -0.5 + 0.5 );\n	sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <logdepthbuf_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/equirect_vert.glsl

THREE.ShaderChunk[ 'equirect_vert' ] = "varying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vWorldPosition = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/linedashed_frag.glsl

THREE.ShaderChunk[ 'linedashed_frag' ] = "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/linedashed_vert.glsl

THREE.ShaderChunk[ 'linedashed_vert' ] = "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <color_vertex>\n	vLineDistance = scale * lineDistance;\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshbasic_frag.glsl

THREE.ShaderChunk[ 'meshbasic_frag' ] = "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	ReflectedLight reflectedLight;\n	reflectedLight.directDiffuse = vec3( 0.0 );\n	reflectedLight.directSpecular = vec3( 0.0 );\n	reflectedLight.indirectDiffuse = diffuseColor.rgb;\n	reflectedLight.indirectSpecular = vec3( 0.0 );\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n	#include <envmap_fragment>\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshbasic_vert.glsl

THREE.ShaderChunk[ 'meshbasic_vert' ] = "#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <skinbase_vertex>\n	#ifdef USE_ENVMAP\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	#include <envmap_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshlambert_frag.glsl

THREE.ShaderChunk[ 'meshlambert_frag' ] = "uniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n	varying vec3 vLightBack;\n#endif\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <fog_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <emissivemap_fragment>\n	reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );\n	#include <lightmap_fragment>\n	reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );\n	#ifdef DOUBLE_SIDED\n		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;\n	#else\n		reflectedLight.directDiffuse = vLightFront;\n	#endif\n	reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshlambert_vert.glsl

THREE.ShaderChunk[ 'meshlambert_vert' ] = "#define LAMBERT\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n	varying vec3 vLightBack;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <bsdfs>\n#include <lights_pars>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <lights_lambert_vertex>\n	#include <shadowmap_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshphong_frag.glsl

THREE.ShaderChunk[ 'meshphong_frag' ] = "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_template>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshphong_vert.glsl

THREE.ShaderChunk[ 'meshphong_vert' ] = "#define PHONG\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n#endif\n	#include <begin_vertex>\n	#include <displacementmap_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshphysical_frag.glsl

THREE.ShaderChunk[ 'meshphysical_frag' ] = "#define PHYSICAL\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\nuniform float envMapIntensity;\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <cube_uv_reflection_fragment>\n#include <lights_pars>\n#include <lights_physical_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_template>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/meshphysical_vert.glsl

THREE.ShaderChunk[ 'meshphysical_vert' ] = "#define PHYSICAL\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n#endif\n	#include <begin_vertex>\n	#include <displacementmap_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/normal_frag.glsl

THREE.ShaderChunk[ 'normal_frag' ] = "uniform float opacity;\nvarying vec3 vNormal;\n#include <common>\n#include <packing>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	gl_FragColor = vec4( packNormalToRGB( vNormal ), opacity );\n	#include <logdepthbuf_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/normal_vert.glsl

THREE.ShaderChunk[ 'normal_vert' ] = "varying vec3 vNormal;\n#include <common>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vNormal = normalize( normalMatrix * normal );\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/points_frag.glsl

THREE.ShaderChunk[ 'points_frag' ] = "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <fog_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	outgoingLight = diffuseColor.rgb;\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

// File:src/renderers/shaders/ShaderLib/points_vert.glsl

THREE.ShaderChunk[ 'points_vert' ] = "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <color_vertex>\n	#include <begin_vertex>\n	#include <project_vertex>\n	#ifdef USE_SIZEATTENUATION\n		gl_PointSize = size * ( scale / - mvPosition.z );\n	#else\n		gl_PointSize = size;\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib/shadow_frag.glsl

THREE.ShaderChunk[ 'shadow_frag' ] = "uniform float opacity;\n#include <common>\n#include <packing>\n#include <bsdfs>\n#include <lights_pars>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n	gl_FragColor = vec4( 0.0, 0.0, 0.0, opacity * ( 1.0  - getShadowMask() ) );\n}\n";

// File:src/renderers/shaders/ShaderLib/shadow_vert.glsl

THREE.ShaderChunk[ 'shadow_vert' ] = "#include <shadowmap_pars_vertex>\nvoid main() {\n	#include <begin_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n}\n";

// File:src/renderers/shaders/ShaderLib.js

/**
 * Webgl Shader Library for three.js
 *
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */


THREE.ShaderLib = {

	'basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ 'common' ],
			THREE.UniformsLib[ 'aomap' ],
			THREE.UniformsLib[ 'fog' ]

		] ),

		vertexShader: THREE.ShaderChunk[ 'meshbasic_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'meshbasic_frag' ]

	},

	'lambert': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ 'common' ],
			THREE.UniformsLib[ 'aomap' ],
			THREE.UniformsLib[ 'lightmap' ],
			THREE.UniformsLib[ 'emissivemap' ],
			THREE.UniformsLib[ 'fog' ],
			THREE.UniformsLib[ 'lights' ],

			{
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) }
			}

		] ),

		vertexShader: THREE.ShaderChunk[ 'meshlambert_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'meshlambert_frag' ]

	},

	'phong': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ 'common' ],
			THREE.UniformsLib[ 'aomap' ],
			THREE.UniformsLib[ 'lightmap' ],
			THREE.UniformsLib[ 'emissivemap' ],
			THREE.UniformsLib[ 'bumpmap' ],
			THREE.UniformsLib[ 'normalmap' ],
			THREE.UniformsLib[ 'displacementmap' ],
			THREE.UniformsLib[ 'fog' ],
			THREE.UniformsLib[ 'lights' ],

			{
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
				"shininess": { type: "1f", value: 30 }
			}

		] ),

		vertexShader: THREE.ShaderChunk[ 'meshphong_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'meshphong_frag' ]

	},

	'standard': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ 'common' ],
			THREE.UniformsLib[ 'aomap' ],
			THREE.UniformsLib[ 'lightmap' ],
			THREE.UniformsLib[ 'emissivemap' ],
			THREE.UniformsLib[ 'bumpmap' ],
			THREE.UniformsLib[ 'normalmap' ],
			THREE.UniformsLib[ 'displacementmap' ],
			THREE.UniformsLib[ 'roughnessmap' ],
			THREE.UniformsLib[ 'metalnessmap' ],
			THREE.UniformsLib[ 'fog' ],
			THREE.UniformsLib[ 'lights' ],

			{
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"roughness": { type: "1f", value: 0.5 },
				"metalness": { type: "1f", value: 0 },
				"envMapIntensity" : { type: "1f", value: 1 } // temporary
			}

		] ),

		vertexShader: THREE.ShaderChunk[ 'meshphysical_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'meshphysical_frag' ]

	},

	'points': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ 'points' ],
			THREE.UniformsLib[ 'fog' ]

		] ),

		vertexShader: THREE.ShaderChunk[ 'points_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'points_frag' ]

	},

	'dashed': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ 'common' ],
			THREE.UniformsLib[ 'fog' ],

			{
				"scale"    : { type: "1f", value: 1 },
				"dashSize" : { type: "1f", value: 1 },
				"totalSize": { type: "1f", value: 2 }
			}

		] ),

		vertexShader: THREE.ShaderChunk[ 'linedashed_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'linedashed_frag' ]

	},

	'depth': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ 'common' ],
			THREE.UniformsLib[ 'displacementmap' ]

		] ),

		vertexShader: THREE.ShaderChunk[ 'depth_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'depth_frag' ]

	},

	'normal': {

		uniforms: {

			"opacity" : { type: "1f", value: 1.0 }

		},

		vertexShader: THREE.ShaderChunk[ 'normal_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'normal_frag' ]

	},

	/* -------------------------------------------------------------------------
	//	Cube map shader
	 ------------------------------------------------------------------------- */

	'cube': {

		uniforms: {
			"tCube": { type: "t", value: null },
			"tFlip": { type: "1f", value: - 1 }
		},

		vertexShader: THREE.ShaderChunk[ 'cube_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'cube_frag' ]

	},

	/* -------------------------------------------------------------------------
	//	Cube map shader
	 ------------------------------------------------------------------------- */

	'equirect': {

		uniforms: {
			"tEquirect": { type: "t", value: null },
			"tFlip": { type: "1f", value: - 1 }
		},

		vertexShader: THREE.ShaderChunk[ 'equirect_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'equirect_frag' ]

	},

	'distanceRGBA': {

		uniforms: {

			"lightPos": { type: "v3", value: new THREE.Vector3() }

		},

		vertexShader: THREE.ShaderChunk[ 'distanceRGBA_vert' ],
		fragmentShader: THREE.ShaderChunk[ 'distanceRGBA_frag' ]

	}

};

THREE.ShaderLib[ 'physical' ] = {

	uniforms: THREE.UniformsUtils.merge( [

		THREE.ShaderLib[ 'standard' ].uniforms,

		{
			// future
		}

	] ),

	vertexShader: THREE.ShaderChunk[ 'meshphysical_vert' ],
	fragmentShader: THREE.ShaderChunk[ 'meshphysical_frag' ]

};


// File:src/renderers/WebGLRenderer.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 * @author tschw
 */

THREE.WebGLRenderer = function ( parameters ) {

	console.log( 'THREE.WebGLRenderer', THREE.REVISION );

	parameters = parameters || {};

	var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' ),
	_context = parameters.context !== undefined ? parameters.context : null,

	_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
	_depth = parameters.depth !== undefined ? parameters.depth : true,
	_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
	_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
	_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
	_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

	var lights = [];

	var opaqueObjects = [];
	var opaqueObjectsLastIndex = - 1;
	var transparentObjects = [];
	var transparentObjectsLastIndex = - 1;

	var morphInfluences = new Float32Array( 8 );

	var sprites = [];
	var lensFlares = [];

	// public properties

	this.domElement = _canvas;
	this.context = null;

	// clearing

	this.autoClear = true;
	this.autoClearColor = true;
	this.autoClearDepth = true;
	this.autoClearStencil = true;

	// scene graph

	this.sortObjects = true;

	// user-defined clipping

	this.clippingPlanes = [];
	this.localClippingEnabled = false;

	// physically based shading

	this.gammaFactor = 2.0;	// for backwards compatibility
	this.gammaInput = false;
	this.gammaOutput = false;

	// physical lights

	this.physicallyCorrectLights = false;

	// tone mapping

	this.toneMapping = THREE.LinearToneMapping;
	this.toneMappingExposure = 1.0;
	this.toneMappingWhitePoint = 1.0;

	// morphs

	this.maxMorphTargets = 8;
	this.maxMorphNormals = 4;

	// flags

	this.autoScaleCubemaps = true;

	// internal properties

	var _this = this,

	// internal state cache

	_currentProgram = null,
	_currentRenderTarget = null,
	_currentFramebuffer = null,
	_currentMaterialId = - 1,
	_currentGeometryProgram = '',
	_currentCamera = null,

	_currentScissor = new THREE.Vector4(),
	_currentScissorTest = null,

	_currentViewport = new THREE.Vector4(),

	//

	_usedTextureUnits = 0,

	//

	_clearColor = new THREE.Color( 0x000000 ),
	_clearAlpha = 0,

	_width = _canvas.width,
	_height = _canvas.height,

	_pixelRatio = 1,

	_scissor = new THREE.Vector4( 0, 0, _width, _height ),
	_scissorTest = false,

	_viewport = new THREE.Vector4( 0, 0, _width, _height ),

	// frustum

	_frustum = new THREE.Frustum(),

	// clipping

	_clipping = new THREE.WebGLClipping(),
	_clippingEnabled = false,
	_localClippingEnabled = false,

	_sphere = new THREE.Sphere(),

	// camera matrices cache

	_projScreenMatrix = new THREE.Matrix4(),

	_vector3 = new THREE.Vector3(),

	// light arrays cache

	_lights = {

		hash: '',

		ambient: [ 0, 0, 0 ],
		directional: [],
		directionalShadowMap: [],
		directionalShadowMatrix: [],
		spot: [],
		spotShadowMap: [],
		spotShadowMatrix: [],
		point: [],
		pointShadowMap: [],
		pointShadowMatrix: [],
		hemi: [],

		shadows: []

	},

	// info

	_infoMemory = {

		geometries: 0,
		textures: 0

	},

	_infoRender = {

		calls: 0,
		vertices: 0,
		faces: 0,
		points: 0

	};

	this.info = {

		render: _infoRender,
		memory: _infoMemory,
		programs: null

	};


	// initialize

	var _gl;

	try {

		var attributes = {
			alpha: _alpha,
			depth: _depth,
			stencil: _stencil,
			antialias: _antialias,
			premultipliedAlpha: _premultipliedAlpha,
			preserveDrawingBuffer: _preserveDrawingBuffer
		};

		_gl = _context || _canvas.getContext( 'webgl', attributes ) || _canvas.getContext( 'experimental-webgl', attributes );

		if ( _gl === null ) {

			if ( _canvas.getContext( 'webgl' ) !== null ) {

				throw 'Error creating WebGL context with your selected attributes.';

			} else {

				throw 'Error creating WebGL context.';

			}

		}

		// Some experimental-webgl implementations do not have getShaderPrecisionFormat

		if ( _gl.getShaderPrecisionFormat === undefined ) {

			_gl.getShaderPrecisionFormat = function () {

				return { 'rangeMin': 1, 'rangeMax': 1, 'precision': 1 };

			};

		}

		_canvas.addEventListener( 'webglcontextlost', onContextLost, false );

	} catch ( error ) {

		console.error( 'THREE.WebGLRenderer: ' + error );

	}

	var _isWebGL2 = (typeof WebGL2RenderingContext !== 'undefined' && _gl instanceof WebGL2RenderingContext);
	var extensions = new THREE.WebGLExtensions( _gl );

	extensions.get( 'WEBGL_depth_texture' );
	extensions.get( 'OES_texture_float' );
	extensions.get( 'OES_texture_float_linear' );
	extensions.get( 'OES_texture_half_float' );
	extensions.get( 'OES_texture_half_float_linear' );
	extensions.get( 'OES_standard_derivatives' );
	extensions.get( 'ANGLE_instanced_arrays' );

	if ( extensions.get( 'OES_element_index_uint' ) ) {

		THREE.BufferGeometry.MaxIndex = 4294967296;

	}

	var capabilities = new THREE.WebGLCapabilities( _gl, extensions, parameters );

	var state = new THREE.WebGLState( _gl, extensions, paramThreeToGL );
	var properties = new THREE.WebGLProperties();
	var objects = new THREE.WebGLObjects( _gl, properties, this.info );
	var programCache = new THREE.WebGLPrograms( this, capabilities );
	var lightCache = new THREE.WebGLLights();

	this.info.programs = programCache.programs;

	var bufferRenderer = new THREE.WebGLBufferRenderer( _gl, extensions, _infoRender );
	var indexedBufferRenderer = new THREE.WebGLIndexedBufferRenderer( _gl, extensions, _infoRender );

	//

	function getTargetPixelRatio() {

		return _currentRenderTarget === null ? _pixelRatio : 1;

	}

	function glClearColor( r, g, b, a ) {

		if ( _premultipliedAlpha === true ) {

			r *= a; g *= a; b *= a;

		}

		state.clearColor( r, g, b, a );

	}

	function setDefaultGLState() {

		state.init();

		state.scissor( _currentScissor.copy( _scissor ).multiplyScalar( _pixelRatio ) );
		state.viewport( _currentViewport.copy( _viewport ).multiplyScalar( _pixelRatio ) );

		glClearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	}

	function resetGLState() {

		_currentProgram = null;
		_currentCamera = null;

		_currentGeometryProgram = '';
		_currentMaterialId = - 1;

		state.reset();

	}

	setDefaultGLState();

	this.context = _gl;
	this.capabilities = capabilities;
	this.extensions = extensions;
	this.properties = properties;
	this.state = state;

	// shadow map

	var shadowMap = new THREE.WebGLShadowMap( this, _lights, objects );

	this.shadowMap = shadowMap;


	// Plugins

	var spritePlugin = new THREE.SpritePlugin( this, sprites );
	var lensFlarePlugin = new THREE.LensFlarePlugin( this, lensFlares );

	// API

	this.getContext = function () {

		return _gl;

	};

	this.getContextAttributes = function () {

		return _gl.getContextAttributes();

	};

	this.forceContextLoss = function () {

		extensions.get( 'WEBGL_lose_context' ).loseContext();

	};

	this.getMaxAnisotropy = ( function () {

		var value;

		return function getMaxAnisotropy() {

			if ( value !== undefined ) return value;

			var extension = extensions.get( 'EXT_texture_filter_anisotropic' );

			if ( extension !== null ) {

				value = _gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT );

			} else {

				value = 0;

			}

			return value;

		};

	} )();

	this.getPrecision = function () {

		return capabilities.precision;

	};

	this.getPixelRatio = function () {

		return _pixelRatio;

	};

	this.setPixelRatio = function ( value ) {

		if ( value === undefined ) return;

		_pixelRatio = value;

		this.setSize( _viewport.z, _viewport.w, false );

	};

	this.getSize = function () {

		return {
			width: _width,
			height: _height
		};

	};

	this.setSize = function ( width, height, updateStyle ) {

		_width = width;
		_height = height;

		_canvas.width = width * _pixelRatio;
		_canvas.height = height * _pixelRatio;

		if ( updateStyle !== false ) {

			_canvas.style.width = width + 'px';
			_canvas.style.height = height + 'px';

		}

		this.setViewport( 0, 0, width, height );

	};

	this.setViewport = function ( x, y, width, height ) {

		state.viewport( _viewport.set( x, y, width, height ) );

	};

	this.setScissor = function ( x, y, width, height ) {

		state.scissor( _scissor.set( x, y, width, height ) );

	};

	this.setScissorTest = function ( boolean ) {

		state.setScissorTest( _scissorTest = boolean );

	};

	// Clearing

	this.getClearColor = function () {

		return _clearColor;

	};

	this.setClearColor = function ( color, alpha ) {

		_clearColor.set( color );

		_clearAlpha = alpha !== undefined ? alpha : 1;

		glClearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.getClearAlpha = function () {

		return _clearAlpha;

	};

	this.setClearAlpha = function ( alpha ) {

		_clearAlpha = alpha;

		glClearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.clear = function ( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

		_gl.clear( bits );

	};

	this.clearColor = function () {

		this.clear( true, false, false );

	};

	this.clearDepth = function () {

		this.clear( false, true, false );

	};

	this.clearStencil = function () {

		this.clear( false, false, true );

	};

	this.clearTarget = function ( renderTarget, color, depth, stencil ) {

		this.setRenderTarget( renderTarget );
		this.clear( color, depth, stencil );

	};

	// Reset

	this.resetGLState = resetGLState;

	this.dispose = function() {

		_canvas.removeEventListener( 'webglcontextlost', onContextLost, false );

	};

	// Events

	function onContextLost( event ) {

		event.preventDefault();

		resetGLState();
		setDefaultGLState();

		properties.clear();

	}

	function onTextureDispose( event ) {

		var texture = event.target;

		texture.removeEventListener( 'dispose', onTextureDispose );

		deallocateTexture( texture );

		_infoMemory.textures --;


	}

	function onRenderTargetDispose( event ) {

		var renderTarget = event.target;

		renderTarget.removeEventListener( 'dispose', onRenderTargetDispose );

		deallocateRenderTarget( renderTarget );

		_infoMemory.textures --;

	}

	function onMaterialDispose( event ) {

		var material = event.target;

		material.removeEventListener( 'dispose', onMaterialDispose );

		deallocateMaterial( material );

	}

	// Buffer deallocation

	function deallocateTexture( texture ) {

		var textureProperties = properties.get( texture );

		if ( texture.image && textureProperties.__image__webglTextureCube ) {

			// cube texture

			_gl.deleteTexture( textureProperties.__image__webglTextureCube );

		} else {

			// 2D texture

			if ( textureProperties.__webglInit === undefined ) return;

			_gl.deleteTexture( textureProperties.__webglTexture );

		}

		// remove all webgl properties
		properties.delete( texture );

	}

	function deallocateRenderTarget( renderTarget ) {

		var renderTargetProperties = properties.get( renderTarget );
		var textureProperties = properties.get( renderTarget.texture );

		if ( ! renderTarget ) return;

		if ( textureProperties.__webglTexture !== undefined ) {

			_gl.deleteTexture( textureProperties.__webglTexture );

		}

		if ( renderTarget.depthTexture ) {

			renderTarget.depthTexture.dispose();

		}

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			for ( var i = 0; i < 6; i ++ ) {

				_gl.deleteFramebuffer( renderTargetProperties.__webglFramebuffer[ i ] );
				if ( renderTargetProperties.__webglDepthbuffer ) _gl.deleteRenderbuffer( renderTargetProperties.__webglDepthbuffer[ i ] );

			}

		} else {

			_gl.deleteFramebuffer( renderTargetProperties.__webglFramebuffer );
			if ( renderTargetProperties.__webglDepthbuffer ) _gl.deleteRenderbuffer( renderTargetProperties.__webglDepthbuffer );

		}

		properties.delete( renderTarget.texture );
		properties.delete( renderTarget );

	}

	function deallocateMaterial( material ) {

		releaseMaterialProgramReference( material );

		properties.delete( material );

	}


	function releaseMaterialProgramReference( material ) {

		var programInfo = properties.get( material ).program;

		material.program = undefined;

		if ( programInfo !== undefined ) {

			programCache.releaseProgram( programInfo );

		}

	}

	// Buffer rendering

	this.renderBufferImmediate = function ( object, program, material ) {

		state.initAttributes();

		var buffers = properties.get( object );

		if ( object.hasPositions && ! buffers.position ) buffers.position = _gl.createBuffer();
		if ( object.hasNormals && ! buffers.normal ) buffers.normal = _gl.createBuffer();
		if ( object.hasUvs && ! buffers.uv ) buffers.uv = _gl.createBuffer();
		if ( object.hasColors && ! buffers.color ) buffers.color = _gl.createBuffer();

		var attributes = program.getAttributes();

		if ( object.hasPositions ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.position );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.position );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasNormals ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.normal );

			if ( material.type !== 'MeshPhongMaterial' && material.type !== 'MeshStandardMaterial' && material.type !== 'MeshPhysicalMaterial' && material.shading === THREE.FlatShading ) {

				for ( var i = 0, l = object.count * 3; i < l; i += 9 ) {

					var array = object.normalArray;

					var nx = ( array[ i + 0 ] + array[ i + 3 ] + array[ i + 6 ] ) / 3;
					var ny = ( array[ i + 1 ] + array[ i + 4 ] + array[ i + 7 ] ) / 3;
					var nz = ( array[ i + 2 ] + array[ i + 5 ] + array[ i + 8 ] ) / 3;

					array[ i + 0 ] = nx;
					array[ i + 1 ] = ny;
					array[ i + 2 ] = nz;

					array[ i + 3 ] = nx;
					array[ i + 4 ] = ny;
					array[ i + 5 ] = nz;

					array[ i + 6 ] = nx;
					array[ i + 7 ] = ny;
					array[ i + 8 ] = nz;

				}

			}

			_gl.bufferData( _gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.normal );

			_gl.vertexAttribPointer( attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasUvs && material.map ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.uv );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.uv );

			_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasColors && material.vertexColors !== THREE.NoColors ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.color );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.color );

			_gl.vertexAttribPointer( attributes.color, 3, _gl.FLOAT, false, 0, 0 );

		}

		state.disableUnusedAttributes();

		_gl.drawArrays( _gl.TRIANGLES, 0, object.count );

		object.count = 0;

	};

	this.renderBufferDirect = function ( camera, fog, geometry, material, object, group ) {

		setMaterial( material );

		var program = setProgram( camera, fog, material, object );

		var updateBuffers = false;
		var geometryProgram = geometry.id + '_' + program.id + '_' + material.wireframe;

		if ( geometryProgram !== _currentGeometryProgram ) {

			_currentGeometryProgram = geometryProgram;
			updateBuffers = true;

		}

		// morph targets

		var morphTargetInfluences = object.morphTargetInfluences;

		if ( morphTargetInfluences !== undefined ) {

			var activeInfluences = [];

			for ( var i = 0, l = morphTargetInfluences.length; i < l; i ++ ) {

				var influence = morphTargetInfluences[ i ];
				activeInfluences.push( [ influence, i ] );

			}

			activeInfluences.sort( absNumericalSort );

			if ( activeInfluences.length > 8 ) {

				activeInfluences.length = 8;

			}

			var morphAttributes = geometry.morphAttributes;

			for ( var i = 0, l = activeInfluences.length; i < l; i ++ ) {

				var influence = activeInfluences[ i ];
				morphInfluences[ i ] = influence[ 0 ];

				if ( influence[ 0 ] !== 0 ) {

					var index = influence[ 1 ];

					if ( material.morphTargets === true && morphAttributes.position ) geometry.addAttribute( 'morphTarget' + i, morphAttributes.position[ index ] );
					if ( material.morphNormals === true && morphAttributes.normal ) geometry.addAttribute( 'morphNormal' + i, morphAttributes.normal[ index ] );

				} else {

					if ( material.morphTargets === true ) geometry.removeAttribute( 'morphTarget' + i );
					if ( material.morphNormals === true ) geometry.removeAttribute( 'morphNormal' + i );

				}

			}

			program.getUniforms().setValue(
					_gl, 'morphTargetInfluences', morphInfluences );

			updateBuffers = true;

		}

		//

		var index = geometry.index;
		var position = geometry.attributes.position;

		if ( material.wireframe === true ) {

			index = objects.getWireframeAttribute( geometry );

		}

		var renderer;

		if ( index !== null ) {

			renderer = indexedBufferRenderer;
			renderer.setIndex( index );

		} else {

			renderer = bufferRenderer;

		}

		if ( updateBuffers ) {

			setupVertexAttributes( material, program, geometry );

			if ( index !== null ) {

				_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, objects.getAttributeBuffer( index ) );

			}

		}

		//

		var dataStart = 0;
		var dataCount = Infinity;

		if ( index !== null ) {

			dataCount = index.count;

		} else if ( position !== undefined ) {

			dataCount = position.count;

		}

		var rangeStart = geometry.drawRange.start;
		var rangeCount = geometry.drawRange.count;

		var groupStart = group !== null ? group.start : 0;
		var groupCount = group !== null ? group.count : Infinity;

		var drawStart = Math.max( dataStart, rangeStart, groupStart );
		var drawEnd = Math.min( dataStart + dataCount, rangeStart + rangeCount, groupStart + groupCount ) - 1;

		var drawCount = Math.max( 0, drawEnd - drawStart + 1 );

		//

		if ( object instanceof THREE.Mesh ) {

			if ( material.wireframe === true ) {

				state.setLineWidth( material.wireframeLinewidth * getTargetPixelRatio() );
				renderer.setMode( _gl.LINES );

			} else {

				switch ( object.drawMode ) {

					case THREE.TrianglesDrawMode:
						renderer.setMode( _gl.TRIANGLES );
						break;

					case THREE.TriangleStripDrawMode:
						renderer.setMode( _gl.TRIANGLE_STRIP );
						break;

					case THREE.TriangleFanDrawMode:
						renderer.setMode( _gl.TRIANGLE_FAN );
						break;

				}

			}


		} else if ( object instanceof THREE.Line ) {

			var lineWidth = material.linewidth;

			if ( lineWidth === undefined ) lineWidth = 1; // Not using Line*Material

			state.setLineWidth( lineWidth * getTargetPixelRatio() );

			if ( object instanceof THREE.LineSegments ) {

				renderer.setMode( _gl.LINES );

			} else {

				renderer.setMode( _gl.LINE_STRIP );

			}

		} else if ( object instanceof THREE.Points ) {

			renderer.setMode( _gl.POINTS );

		}

		if ( geometry instanceof THREE.InstancedBufferGeometry ) {

			if ( geometry.maxInstancedCount > 0 ) {

				renderer.renderInstances( geometry, drawStart, drawCount );

			}

		} else {

			renderer.render( drawStart, drawCount );

		}

	};

	function setupVertexAttributes( material, program, geometry, startIndex ) {

		var extension;

		if ( geometry instanceof THREE.InstancedBufferGeometry ) {

			extension = extensions.get( 'ANGLE_instanced_arrays' );

			if ( extension === null ) {

				console.error( 'THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
				return;

			}

		}

		if ( startIndex === undefined ) startIndex = 0;

		state.initAttributes();

		var geometryAttributes = geometry.attributes;

		var programAttributes = program.getAttributes();

		var materialDefaultAttributeValues = material.defaultAttributeValues;

		for ( var name in programAttributes ) {

			var programAttribute = programAttributes[ name ];

			if ( programAttribute >= 0 ) {

				var geometryAttribute = geometryAttributes[ name ];

				if ( geometryAttribute !== undefined ) {

					var type = _gl.FLOAT;
					var array = geometryAttribute.array;
					var normalized = geometryAttribute.normalized;

					if ( array instanceof Float32Array ) {

						type = _gl.FLOAT;

					} else if ( array instanceof Float64Array ) {

						console.warn("Unsupported data buffer format: Float64Array");

					} else if ( array instanceof Uint16Array ) {

						type = _gl.UNSIGNED_SHORT;

					} else if ( array instanceof Int16Array ) {

						type = _gl.SHORT;

					} else if ( array instanceof Uint32Array ) {

						type = _gl.UNSIGNED_INT;

					} else if ( array instanceof Int32Array ) {

						type = _gl.INT;

					} else if ( array instanceof Int8Array ) {

						type = _gl.BYTE;

					} else if ( array instanceof Uint8Array ) {

						type = _gl.UNSIGNED_BYTE;

					}

					var size = geometryAttribute.itemSize;
					var buffer = objects.getAttributeBuffer( geometryAttribute );

					if ( geometryAttribute instanceof THREE.InterleavedBufferAttribute ) {

						var data = geometryAttribute.data;
						var stride = data.stride;
						var offset = geometryAttribute.offset;

						if ( data instanceof THREE.InstancedInterleavedBuffer ) {

							state.enableAttributeAndDivisor( programAttribute, data.meshPerAttribute, extension );

							if ( geometry.maxInstancedCount === undefined ) {

								geometry.maxInstancedCount = data.meshPerAttribute * data.count;

							}

						} else {

							state.enableAttribute( programAttribute );

						}

						_gl.bindBuffer( _gl.ARRAY_BUFFER, buffer );
						_gl.vertexAttribPointer( programAttribute, size, type, normalized, stride * data.array.BYTES_PER_ELEMENT, ( startIndex * stride + offset ) * data.array.BYTES_PER_ELEMENT );

					} else {

						if ( geometryAttribute instanceof THREE.InstancedBufferAttribute ) {

							state.enableAttributeAndDivisor( programAttribute, geometryAttribute.meshPerAttribute, extension );

							if ( geometry.maxInstancedCount === undefined ) {

								geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;

							}

						} else {

							state.enableAttribute( programAttribute );

						}

						_gl.bindBuffer( _gl.ARRAY_BUFFER, buffer );
						_gl.vertexAttribPointer( programAttribute, size, type, normalized, 0, startIndex * size * geometryAttribute.array.BYTES_PER_ELEMENT );

					}

				} else if ( materialDefaultAttributeValues !== undefined ) {

					var value = materialDefaultAttributeValues[ name ];

					if ( value !== undefined ) {

						switch ( value.length ) {

							case 2:
								_gl.vertexAttrib2fv( programAttribute, value );
								break;

							case 3:
								_gl.vertexAttrib3fv( programAttribute, value );
								break;

							case 4:
								_gl.vertexAttrib4fv( programAttribute, value );
								break;

							default:
								_gl.vertexAttrib1fv( programAttribute, value );

						}

					}

				}

			}

		}

		state.disableUnusedAttributes();

	}

	// Sorting

	function absNumericalSort( a, b ) {

		return Math.abs( b[ 0 ] ) - Math.abs( a[ 0 ] );

	}

	function painterSortStable ( a, b ) {

		if ( a.object.renderOrder !== b.object.renderOrder ) {

			return a.object.renderOrder - b.object.renderOrder;

		} else if ( a.material.id !== b.material.id ) {

			return a.material.id - b.material.id;

		} else if ( a.z !== b.z ) {

			return a.z - b.z;

		} else {

			return a.id - b.id;

		}

	}

	function reversePainterSortStable ( a, b ) {

		if ( a.object.renderOrder !== b.object.renderOrder ) {

			return a.object.renderOrder - b.object.renderOrder;

		} if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return a.id - b.id;

		}

	}

	// Rendering

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		if ( camera instanceof THREE.Camera === false ) {

			console.error( 'THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

		var fog = scene.fog;

		// reset caching for this frame

		_currentGeometryProgram = '';
		_currentMaterialId = - 1;
		_currentCamera = null;

		// update scene graph

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

		// update camera matrices and frustum

		if ( camera.parent === null ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
		_frustum.setFromMatrix( _projScreenMatrix );

		lights.length = 0;

		opaqueObjectsLastIndex = - 1;
		transparentObjectsLastIndex = - 1;

		sprites.length = 0;
		lensFlares.length = 0;

		_localClippingEnabled = this.localClippingEnabled;
		_clippingEnabled = _clipping.init(
				this.clippingPlanes, _localClippingEnabled, camera );

		projectObject( scene, camera );


		opaqueObjects.length = opaqueObjectsLastIndex + 1;
		transparentObjects.length = transparentObjectsLastIndex + 1;

		if ( _this.sortObjects === true ) {

			opaqueObjects.sort( painterSortStable );
			transparentObjects.sort( reversePainterSortStable );

		}

		//

		if ( _clippingEnabled ) _clipping.beginShadows();

		setupShadows( lights );

		shadowMap.render( scene, camera );

		setupLights( lights, camera );

		if ( _clippingEnabled ) _clipping.endShadows();

		//

		_infoRender.calls = 0;
		_infoRender.vertices = 0;
		_infoRender.faces = 0;
		_infoRender.points = 0;

		if ( renderTarget === undefined ) {

			renderTarget = null;

		}

		this.setRenderTarget( renderTarget );

		if ( this.autoClear || forceClear ) {

			this.clear( this.autoClearColor, this.autoClearDepth, this.autoClearStencil );

		}

		//

		if ( scene.overrideMaterial ) {

			var overrideMaterial = scene.overrideMaterial;

			renderObjects( opaqueObjects, camera, fog, overrideMaterial );
			renderObjects( transparentObjects, camera, fog, overrideMaterial );

		} else {

			// opaque pass (front-to-back order)

			state.setBlending( THREE.NoBlending );
			renderObjects( opaqueObjects, camera, fog );

			// transparent pass (back-to-front order)

			renderObjects( transparentObjects, camera, fog );

		}

		// custom render plugins (post pass)

		spritePlugin.render( scene, camera );
		lensFlarePlugin.render( scene, camera, _currentViewport );

		// Generate mipmap if we're using any kind of mipmap filtering

		if ( renderTarget ) {

			var texture = renderTarget.texture;

			if ( texture.generateMipmaps && isPowerOfTwo( renderTarget ) &&
					texture.minFilter !== THREE.NearestFilter &&
					texture.minFilter !== THREE.LinearFilter ) {

				updateRenderTargetMipmap( renderTarget );

			}

		}

		// Ensure depth buffer writing is enabled so it can be cleared on next render

		state.setDepthTest( true );
		state.setDepthWrite( true );
		state.setColorWrite( true );

		// _gl.finish();

	};

	function pushRenderItem( object, geometry, material, z, group ) {

		var array, index;

		// allocate the next position in the appropriate array

		if ( material.transparent ) {

			array = transparentObjects;
			index = ++ transparentObjectsLastIndex;

		} else {

			array = opaqueObjects;
			index = ++ opaqueObjectsLastIndex;

		}

		// recycle existing render item or grow the array

		var renderItem = array[ index ];

		if ( renderItem !== undefined ) {

			renderItem.id = object.id;
			renderItem.object = object;
			renderItem.geometry = geometry;
			renderItem.material = material;
			renderItem.z = _vector3.z;
			renderItem.group = group;

		} else {

			renderItem = {
				id: object.id,
				object: object,
				geometry: geometry,
				material: material,
				z: _vector3.z,
				group: group
			};

			// assert( index === array.length );
			array.push( renderItem );

		}

	}

	// TODO Duplicated code (Frustum)

	function isObjectViewable( object ) {

		var geometry = object.geometry;

		if ( geometry.boundingSphere === null )
			geometry.computeBoundingSphere();

		_sphere.copy( geometry.boundingSphere ).
			applyMatrix4( object.matrixWorld );

		return isSphereViewable( _sphere );

	}

	function isSpriteViewable( sprite ) {

		_sphere.center.set( 0, 0, 0 );
		_sphere.radius = 0.7071067811865476;
		_sphere.applyMatrix4( sprite.matrixWorld );

		return isSphereViewable( _sphere );

	}

	function isSphereViewable( sphere ) {

		if ( ! _frustum.intersectsSphere( sphere ) ) return false;

		var numPlanes = _clipping.numPlanes;

		if ( numPlanes === 0 ) return true;

		var planes = _this.clippingPlanes,

			center = sphere.center,
			negRad = - sphere.radius,
			i = 0;

		do {

			// out when deeper than radius in the negative halfspace
			if ( planes[ i ].distanceToPoint( center ) < negRad ) return false;

		} while ( ++ i !== numPlanes );

		return true;

	}

	function projectObject( object, camera ) {

		if ( object.visible === false ) return;

		if ( object.layers.test( camera.layers ) ) {

			if ( object instanceof THREE.Light ) {

				lights.push( object );

			} else if ( object instanceof THREE.Sprite ) {

				if ( object.frustumCulled === false || isSpriteViewable( object ) === true ) {

					sprites.push( object );

				}

			} else if ( object instanceof THREE.LensFlare ) {

				lensFlares.push( object );

			} else if ( object instanceof THREE.ImmediateRenderObject ) {

				if ( _this.sortObjects === true ) {

					_vector3.setFromMatrixPosition( object.matrixWorld );
					_vector3.applyProjection( _projScreenMatrix );

				}

				pushRenderItem( object, null, object.material, _vector3.z, null );

			} else if ( object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points ) {

				if ( object instanceof THREE.SkinnedMesh ) {

					object.skeleton.update();

				}

				if ( object.frustumCulled === false || isObjectViewable( object ) === true ) {

					var material = object.material;

					if ( material.visible === true ) {

						if ( _this.sortObjects === true ) {

							_vector3.setFromMatrixPosition( object.matrixWorld );
							_vector3.applyProjection( _projScreenMatrix );

						}

						var geometry = objects.update( object );

						if ( material instanceof THREE.MultiMaterial ) {

							var groups = geometry.groups;
							var materials = material.materials;

							for ( var i = 0, l = groups.length; i < l; i ++ ) {

								var group = groups[ i ];
								var groupMaterial = materials[ group.materialIndex ];

								if ( groupMaterial.visible === true ) {

									pushRenderItem( object, geometry, groupMaterial, _vector3.z, group );

								}

							}

						} else {

							pushRenderItem( object, geometry, material, _vector3.z, null );

						}

					}

				}

			}

		}

		var children = object.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			projectObject( children[ i ], camera );

		}

	}

	function renderObjects( renderList, camera, fog, overrideMaterial ) {

		for ( var i = 0, l = renderList.length; i < l; i ++ ) {

			var renderItem = renderList[ i ];

			var object = renderItem.object;
			var geometry = renderItem.geometry;
			var material = overrideMaterial === undefined ? renderItem.material : overrideMaterial;
			var group = renderItem.group;

			object.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
			object.normalMatrix.getNormalMatrix( object.modelViewMatrix );

			if ( object instanceof THREE.ImmediateRenderObject ) {

				setMaterial( material );

				var program = setProgram( camera, fog, material, object );

				_currentGeometryProgram = '';

				object.render( function ( object ) {

					_this.renderBufferImmediate( object, program, material );

				} );

			} else {

				_this.renderBufferDirect( camera, fog, geometry, material, object, group );

			}

		}

	}

	function initMaterial( material, fog, object ) {

		var materialProperties = properties.get( material );

		var parameters = programCache.getParameters(
				material, _lights, fog, _clipping.numPlanes, object );

		var code = programCache.getProgramCode( material, parameters );

		var program = materialProperties.program;
		var programChange = true;

		if ( program === undefined ) {

			// new material
			material.addEventListener( 'dispose', onMaterialDispose );

		} else if ( program.code !== code ) {

			// changed glsl or parameters
			releaseMaterialProgramReference( material );

		} else if ( parameters.shaderID !== undefined ) {

			// same glsl and uniform list
			return;

		} else {

			// only rebuild uniform list
			programChange = false;

		}

		if ( programChange ) {

			if ( parameters.shaderID ) {

				var shader = THREE.ShaderLib[ parameters.shaderID ];

				materialProperties.__webglShader = {
					name: material.type,
					uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
					vertexShader: shader.vertexShader,
					fragmentShader: shader.fragmentShader
				};

			} else {

				materialProperties.__webglShader = {
					name: material.type,
					uniforms: material.uniforms,
					vertexShader: material.vertexShader,
					fragmentShader: material.fragmentShader
				};

			}

			material.__webglShader = materialProperties.__webglShader;

			program = programCache.acquireProgram( material, parameters, code );

			materialProperties.program = program;
			material.program = program;

		}

		var attributes = program.getAttributes();

		if ( material.morphTargets ) {

			material.numSupportedMorphTargets = 0;

			for ( var i = 0; i < _this.maxMorphTargets; i ++ ) {

				if ( attributes[ 'morphTarget' + i ] >= 0 ) {

					material.numSupportedMorphTargets ++;

				}

			}

		}

		if ( material.morphNormals ) {

			material.numSupportedMorphNormals = 0;

			for ( var i = 0; i < _this.maxMorphNormals; i ++ ) {

				if ( attributes[ 'morphNormal' + i ] >= 0 ) {

					material.numSupportedMorphNormals ++;

				}

			}

		}

		var uniforms = materialProperties.__webglShader.uniforms;

		if ( ! ( material instanceof THREE.ShaderMaterial ) &&
				! ( material instanceof THREE.RawShaderMaterial ) ||
				material.clipping === true ) {

			materialProperties.numClippingPlanes = _clipping.numPlanes;
			uniforms.clippingPlanes = _clipping.uniform;

		}

		if ( material.lights ) {

			// store the light setup it was created for

			materialProperties.lightsHash = _lights.hash;

			// wire up the material to this renderer's lighting state

			uniforms.ambientLightColor.value = _lights.ambient;
			uniforms.directionalLights.value = _lights.directional;
			uniforms.spotLights.value = _lights.spot;
			uniforms.pointLights.value = _lights.point;
			uniforms.hemisphereLights.value = _lights.hemi;

			uniforms.directionalShadowMap.value = _lights.directionalShadowMap;
			uniforms.directionalShadowMatrix.value = _lights.directionalShadowMatrix;
			uniforms.spotShadowMap.value = _lights.spotShadowMap;
			uniforms.spotShadowMatrix.value = _lights.spotShadowMatrix;
			uniforms.pointShadowMap.value = _lights.pointShadowMap;
			uniforms.pointShadowMatrix.value = _lights.pointShadowMatrix;

		}

		var progUniforms = materialProperties.program.getUniforms(),
			uniformsList =
					THREE.WebGLUniforms.seqWithValue( progUniforms.seq, uniforms );

		materialProperties.uniformsList = uniformsList;
		materialProperties.dynamicUniforms =
				THREE.WebGLUniforms.splitDynamic( uniformsList, uniforms );

	}

	function setMaterial( material ) {

		if ( material.side !== THREE.DoubleSide )
			state.enable( _gl.CULL_FACE );
		else
			state.disable( _gl.CULL_FACE );

		state.setFlipSided( material.side === THREE.BackSide );

		if ( material.transparent === true ) {

			state.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha );

		} else {

			state.setBlending( THREE.NoBlending );

		}

		state.setDepthFunc( material.depthFunc );
		state.setDepthTest( material.depthTest );
		state.setDepthWrite( material.depthWrite );
		state.setColorWrite( material.colorWrite );
		state.setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

	}

	function setProgram( camera, fog, material, object ) {

		_usedTextureUnits = 0;

		var materialProperties = properties.get( material );

		if ( _clippingEnabled ) {

			if ( _localClippingEnabled || camera !== _currentCamera ) {

				var useCache =
						camera === _currentCamera &&
						material.id === _currentMaterialId;

				// we might want to call this function with some ClippingGroup
				// object instead of the material, once it becomes feasible
				// (#8465, #8379)
				_clipping.setState(
						material.clippingPlanes, material.clipShadows,
						camera, materialProperties, useCache );

			}

			if ( materialProperties.numClippingPlanes !== undefined &&
				materialProperties.numClippingPlanes !== _clipping.numPlanes ) {

				material.needsUpdate = true;

			}

		}

		if ( materialProperties.program === undefined ) {

			material.needsUpdate = true;

		}

		if ( materialProperties.lightsHash !== undefined &&
			materialProperties.lightsHash !== _lights.hash ) {

			material.needsUpdate = true;

		}

		if ( material.needsUpdate ) {

			initMaterial( material, fog, object );
			material.needsUpdate = false;

		}

		var refreshProgram = false;
		var refreshMaterial = false;
		var refreshLights = false;

		var program = materialProperties.program,
			p_uniforms = program.getUniforms(),
			m_uniforms = materialProperties.__webglShader.uniforms;

		if ( program.id !== _currentProgram ) {

			_gl.useProgram( program.program );
			_currentProgram = program.id;

			refreshProgram = true;
			refreshMaterial = true;
			refreshLights = true;

		}

		if ( material.id !== _currentMaterialId ) {

			_currentMaterialId = material.id;

			refreshMaterial = true;

		}

		if ( refreshProgram || camera !== _currentCamera ) {

			p_uniforms.set( _gl, camera, 'projectionMatrix' );

			if ( capabilities.logarithmicDepthBuffer ) {

				p_uniforms.setValue( _gl, 'logDepthBufFC',
						2.0 / ( Math.log( camera.far + 1.0 ) / Math.LN2 ) );

			}


			if ( camera !== _currentCamera ) {

				_currentCamera = camera;

				// lighting uniforms depend on the camera so enforce an update
				// now, in case this material supports lights - or later, when
				// the next material that does gets activated:

				refreshMaterial = true;		// set to true on material change
				refreshLights = true;		// remains set until update done

			}

			// load material specific uniforms
			// (shader material also gets them for the sake of genericity)

			if ( material instanceof THREE.ShaderMaterial ||
				 material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshStandardMaterial ||
				 material.envMap ) {

				var uCamPos = p_uniforms.map.cameraPosition;

				if ( uCamPos !== undefined ) {

					uCamPos.setValue( _gl,
							_vector3.setFromMatrixPosition( camera.matrixWorld ) );

				}

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.MeshBasicMaterial ||
				 material instanceof THREE.MeshStandardMaterial ||
				 material instanceof THREE.ShaderMaterial ||
				 material.skinning ) {

				p_uniforms.setValue( _gl, 'viewMatrix', camera.matrixWorldInverse );

			}

			p_uniforms.set( _gl, _this, 'toneMappingExposure' );
			p_uniforms.set( _gl, _this, 'toneMappingWhitePoint' );

		}

		// skinning uniforms must be set even if material didn't change
		// auto-setting of texture unit for bone texture must go before other textures
		// not sure why, but otherwise weird things happen

		if ( material.skinning ) {

			p_uniforms.setOptional( _gl, object, 'bindMatrix' );
			p_uniforms.setOptional( _gl, object, 'bindMatrixInverse' );

			var skeleton = object.skeleton;

			if ( skeleton ) {

				if ( capabilities.floatVertexTextures && skeleton.useVertexTexture ) {

					p_uniforms.set( _gl, skeleton, 'boneTexture' );
					p_uniforms.set( _gl, skeleton, 'boneTextureWidth' );
					p_uniforms.set( _gl, skeleton, 'boneTextureHeight' );

				} else {

					p_uniforms.setOptional( _gl, skeleton, 'boneMatrices' );

				}

			}

		}

		if ( refreshMaterial ) {

			if ( material.lights ) {

				// the current material requires lighting info

				// note: all lighting uniforms are always set correctly
				// they simply reference the renderer's state for their
				// values
				//
				// use the current material's .needsUpdate flags to set
				// the GL state when required

				markUniformsLightsNeedsUpdate( m_uniforms, refreshLights );

			}

			// refresh uniforms common to several materials

			if ( fog && material.fog ) {

				refreshUniformsFog( m_uniforms, fog );

			}

			if ( material instanceof THREE.MeshBasicMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshStandardMaterial ||
				 material instanceof THREE.MeshDepthMaterial ) {

				refreshUniformsCommon( m_uniforms, material );

			}

			// refresh single material specific uniforms

			if ( material instanceof THREE.LineBasicMaterial ) {

				refreshUniformsLine( m_uniforms, material );

			} else if ( material instanceof THREE.LineDashedMaterial ) {

				refreshUniformsLine( m_uniforms, material );
				refreshUniformsDash( m_uniforms, material );

			} else if ( material instanceof THREE.PointsMaterial ) {

				refreshUniformsPoints( m_uniforms, material );

			} else if ( material instanceof THREE.MeshLambertMaterial ) {

				refreshUniformsLambert( m_uniforms, material );

			} else if ( material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsPhong( m_uniforms, material );

			} else if ( material instanceof THREE.MeshPhysicalMaterial ) {

				refreshUniformsPhysical( m_uniforms, material );

			} else if ( material instanceof THREE.MeshStandardMaterial ) {

				refreshUniformsStandard( m_uniforms, material );

			} else if ( material instanceof THREE.MeshDepthMaterial ) {

				if ( material.displacementMap ) {

					m_uniforms.displacementMap.value = material.displacementMap;
					m_uniforms.displacementScale.value = material.displacementScale;
					m_uniforms.displacementBias.value = material.displacementBias;

				}

			} else if ( material instanceof THREE.MeshNormalMaterial ) {

				m_uniforms.opacity.value = material.opacity;

			}

			THREE.WebGLUniforms.upload(
					_gl, materialProperties.uniformsList, m_uniforms, _this );

		}


		// common matrices

		p_uniforms.set( _gl, object, 'modelViewMatrix' );
		p_uniforms.set( _gl, object, 'normalMatrix' );
		p_uniforms.setValue( _gl, 'modelMatrix', object.matrixWorld );


		// dynamic uniforms

		var dynUniforms = materialProperties.dynamicUniforms;

		if ( dynUniforms !== null ) {

			THREE.WebGLUniforms.evalDynamic(
					dynUniforms, m_uniforms, object, camera );

			THREE.WebGLUniforms.upload( _gl, dynUniforms, m_uniforms, _this );

		}

		return program;

	}

	// Uniforms (refresh uniforms objects)

	function refreshUniformsCommon ( uniforms, material ) {

		uniforms.opacity.value = material.opacity;

		uniforms.diffuse.value = material.color;

		if ( material.emissive ) {

			uniforms.emissive.value.copy( material.emissive ).multiplyScalar( material.emissiveIntensity );

		}

		uniforms.map.value = material.map;
		uniforms.specularMap.value = material.specularMap;
		uniforms.alphaMap.value = material.alphaMap;

		if ( material.aoMap ) {

			uniforms.aoMap.value = material.aoMap;
			uniforms.aoMapIntensity.value = material.aoMapIntensity;

		}

		// uv repeat and offset setting priorities
		// 1. color map
		// 2. specular map
		// 3. normal map
		// 4. bump map
		// 5. alpha map
		// 6. emissive map

		var uvScaleMap;

		if ( material.map ) {

			uvScaleMap = material.map;

		} else if ( material.specularMap ) {

			uvScaleMap = material.specularMap;

		} else if ( material.displacementMap ) {

			uvScaleMap = material.displacementMap;

		} else if ( material.normalMap ) {

			uvScaleMap = material.normalMap;

		} else if ( material.bumpMap ) {

			uvScaleMap = material.bumpMap;

		} else if ( material.roughnessMap ) {

			uvScaleMap = material.roughnessMap;

		} else if ( material.metalnessMap ) {

			uvScaleMap = material.metalnessMap;

		} else if ( material.alphaMap ) {

			uvScaleMap = material.alphaMap;

		} else if ( material.emissiveMap ) {

			uvScaleMap = material.emissiveMap;

		}

		if ( uvScaleMap !== undefined ) {

			// backwards compatibility
			if ( uvScaleMap instanceof THREE.WebGLRenderTarget ) {

				uvScaleMap = uvScaleMap.texture;

			}

			var offset = uvScaleMap.offset;
			var repeat = uvScaleMap.repeat;

			uniforms.offsetRepeat.value.set( offset.x, offset.y, repeat.x, repeat.y );

		}

		uniforms.envMap.value = material.envMap;

		// don't flip CubeTexture envMaps, flip everything else:
		//  WebGLRenderTargetCube will be flipped for backwards compatibility
		//  WebGLRenderTargetCube.texture will be flipped because it's a Texture and NOT a CubeTexture
		// this check must be handled differently, or removed entirely, if WebGLRenderTargetCube uses a CubeTexture in the future
		uniforms.flipEnvMap.value = ( ! ( material.envMap instanceof THREE.CubeTexture ) ) ? 1 : - 1;

		uniforms.reflectivity.value = material.reflectivity;
		uniforms.refractionRatio.value = material.refractionRatio;

	}

	function refreshUniformsLine ( uniforms, material ) {

		uniforms.diffuse.value = material.color;
		uniforms.opacity.value = material.opacity;

	}

	function refreshUniformsDash ( uniforms, material ) {

		uniforms.dashSize.value = material.dashSize;
		uniforms.totalSize.value = material.dashSize + material.gapSize;
		uniforms.scale.value = material.scale;

	}

	function refreshUniformsPoints ( uniforms, material ) {

		uniforms.diffuse.value = material.color;
		uniforms.opacity.value = material.opacity;
		uniforms.size.value = material.size * _pixelRatio;
		uniforms.scale.value = _canvas.clientHeight * 0.5;

		uniforms.map.value = material.map;

		if ( material.map !== null ) {

			var offset = material.map.offset;
			var repeat = material.map.repeat;

			uniforms.offsetRepeat.value.set( offset.x, offset.y, repeat.x, repeat.y );

		}

	}

	function refreshUniformsFog ( uniforms, fog ) {

		uniforms.fogColor.value = fog.color;

		if ( fog instanceof THREE.Fog ) {

			uniforms.fogNear.value = fog.near;
			uniforms.fogFar.value = fog.far;

		} else if ( fog instanceof THREE.FogExp2 ) {

			uniforms.fogDensity.value = fog.density;

		}

	}

	function refreshUniformsLambert ( uniforms, material ) {

		if ( material.lightMap ) {

			uniforms.lightMap.value = material.lightMap;
			uniforms.lightMapIntensity.value = material.lightMapIntensity;

		}

		if ( material.emissiveMap ) {

			uniforms.emissiveMap.value = material.emissiveMap;

		}

	}

	function refreshUniformsPhong ( uniforms, material ) {

		uniforms.specular.value = material.specular;
		uniforms.shininess.value = Math.max( material.shininess, 1e-4 ); // to prevent pow( 0.0, 0.0 )

		if ( material.lightMap ) {

			uniforms.lightMap.value = material.lightMap;
			uniforms.lightMapIntensity.value = material.lightMapIntensity;

		}

		if ( material.emissiveMap ) {

			uniforms.emissiveMap.value = material.emissiveMap;

		}

		if ( material.bumpMap ) {

			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;

		}

		if ( material.normalMap ) {

			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy( material.normalScale );

		}

		if ( material.displacementMap ) {

			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;

		}

	}

	function refreshUniformsStandard ( uniforms, material ) {

		uniforms.roughness.value = material.roughness;
		uniforms.metalness.value = material.metalness;

		if ( material.roughnessMap ) {

			uniforms.roughnessMap.value = material.roughnessMap;

		}

		if ( material.metalnessMap ) {

			uniforms.metalnessMap.value = material.metalnessMap;

		}

		if ( material.lightMap ) {

			uniforms.lightMap.value = material.lightMap;
			uniforms.lightMapIntensity.value = material.lightMapIntensity;

		}

		if ( material.emissiveMap ) {

			uniforms.emissiveMap.value = material.emissiveMap;

		}

		if ( material.bumpMap ) {

			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;

		}

		if ( material.normalMap ) {

			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy( material.normalScale );

		}

		if ( material.displacementMap ) {

			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;

		}

		if ( material.envMap ) {

			//uniforms.envMap.value = material.envMap; // part of uniforms common
			uniforms.envMapIntensity.value = material.envMapIntensity;

		}

	}

	function refreshUniformsPhysical ( uniforms, material ) {

		refreshUniformsStandard( uniforms, material );

	}

	// If uniforms are marked as clean, they don't need to be loaded to the GPU.

	function markUniformsLightsNeedsUpdate ( uniforms, value ) {

		uniforms.ambientLightColor.needsUpdate = value;

		uniforms.directionalLights.needsUpdate = value;
		uniforms.pointLights.needsUpdate = value;
		uniforms.spotLights.needsUpdate = value;
		uniforms.hemisphereLights.needsUpdate = value;

	}

	// Lighting

	function setupShadows ( lights ) {

		var lightShadowsLength = 0;

		for ( var i = 0, l = lights.length; i < l; i ++ ) {

			var light = lights[ i ];

			if ( light.castShadow ) {

				_lights.shadows[ lightShadowsLength ++ ] = light;

			}

		}

		_lights.shadows.length = lightShadowsLength;

	}

	function setupLights ( lights, camera ) {

		var l, ll, light,
		r = 0, g = 0, b = 0,
		color,
		intensity,
		distance,
		shadowMap,

		viewMatrix = camera.matrixWorldInverse,

		directionalLength = 0,
		pointLength = 0,
		spotLength = 0,
		hemiLength = 0;

		for ( l = 0, ll = lights.length; l < ll; l ++ ) {

			light = lights[ l ];

			color = light.color;
			intensity = light.intensity;
			distance = light.distance;

			shadowMap = ( light.shadow && light.shadow.map ) ? light.shadow.map.texture : null;

			if ( light instanceof THREE.AmbientLight ) {

				r += color.r * intensity;
				g += color.g * intensity;
				b += color.b * intensity;

			} else if ( light instanceof THREE.DirectionalLight ) {

				var uniforms = lightCache.get( light );

				uniforms.color.copy( light.color ).multiplyScalar( light.intensity );
				uniforms.direction.setFromMatrixPosition( light.matrixWorld );
				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				uniforms.direction.sub( _vector3 );
				uniforms.direction.transformDirection( viewMatrix );

				uniforms.shadow = light.castShadow;

				if ( light.castShadow ) {

					uniforms.shadowBias = light.shadow.bias;
					uniforms.shadowRadius = light.shadow.radius;
					uniforms.shadowMapSize = light.shadow.mapSize;

				}

				_lights.directionalShadowMap[ directionalLength ] = shadowMap;
				_lights.directionalShadowMatrix[ directionalLength ] = light.shadow.matrix;
				_lights.directional[ directionalLength ++ ] = uniforms;

			} else if ( light instanceof THREE.SpotLight ) {

				var uniforms = lightCache.get( light );

				uniforms.position.setFromMatrixPosition( light.matrixWorld );
				uniforms.position.applyMatrix4( viewMatrix );

				uniforms.color.copy( color ).multiplyScalar( intensity );
				uniforms.distance = distance;

				uniforms.direction.setFromMatrixPosition( light.matrixWorld );
				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				uniforms.direction.sub( _vector3 );
				uniforms.direction.transformDirection( viewMatrix );

				uniforms.coneCos = Math.cos( light.angle );
				uniforms.penumbraCos = Math.cos( light.angle * ( 1 - light.penumbra ) );
				uniforms.decay = ( light.distance === 0 ) ? 0.0 : light.decay;

				uniforms.shadow = light.castShadow;

				if ( light.castShadow ) {

					uniforms.shadowBias = light.shadow.bias;
					uniforms.shadowRadius = light.shadow.radius;
					uniforms.shadowMapSize = light.shadow.mapSize;

				}

				_lights.spotShadowMap[ spotLength ] = shadowMap;
				_lights.spotShadowMatrix[ spotLength ] = light.shadow.matrix;
				_lights.spot[ spotLength ++ ] = uniforms;

			} else if ( light instanceof THREE.PointLight ) {

				var uniforms = lightCache.get( light );

				uniforms.position.setFromMatrixPosition( light.matrixWorld );
				uniforms.position.applyMatrix4( viewMatrix );

				uniforms.color.copy( light.color ).multiplyScalar( light.intensity );
				uniforms.distance = light.distance;
				uniforms.decay = ( light.distance === 0 ) ? 0.0 : light.decay;

				uniforms.shadow = light.castShadow;

				if ( light.castShadow ) {

					uniforms.shadowBias = light.shadow.bias;
					uniforms.shadowRadius = light.shadow.radius;
					uniforms.shadowMapSize = light.shadow.mapSize;

				}

				_lights.pointShadowMap[ pointLength ] = shadowMap;

				if ( _lights.pointShadowMatrix[ pointLength ] === undefined ) {

					_lights.pointShadowMatrix[ pointLength ] = new THREE.Matrix4();

				}

				// for point lights we set the shadow matrix to be a translation-only matrix
				// equal to inverse of the light's position
				_vector3.setFromMatrixPosition( light.matrixWorld ).negate();
				_lights.pointShadowMatrix[ pointLength ].identity().setPosition( _vector3 );

				_lights.point[ pointLength ++ ] = uniforms;

			} else if ( light instanceof THREE.HemisphereLight ) {

				var uniforms = lightCache.get( light );

				uniforms.direction.setFromMatrixPosition( light.matrixWorld );
				uniforms.direction.transformDirection( viewMatrix );
				uniforms.direction.normalize();

				uniforms.skyColor.copy( light.color ).multiplyScalar( intensity );
				uniforms.groundColor.copy( light.groundColor ).multiplyScalar( intensity );

				_lights.hemi[ hemiLength ++ ] = uniforms;

			}

		}

		_lights.ambient[ 0 ] = r;
		_lights.ambient[ 1 ] = g;
		_lights.ambient[ 2 ] = b;

		_lights.directional.length = directionalLength;
		_lights.spot.length = spotLength;
		_lights.point.length = pointLength;
		_lights.hemi.length = hemiLength;

		_lights.hash = directionalLength + ',' + pointLength + ',' + spotLength + ',' + hemiLength + ',' + _lights.shadows.length;

	}

	// GL state setting

	this.setFaceCulling = function ( cullFace, frontFaceDirection ) {

		state.setCullFace( cullFace );
		state.setFlipSided( frontFaceDirection === THREE.FrontFaceDirectionCW );

	};

	// Textures

	function allocTextureUnit() {

		var textureUnit = _usedTextureUnits;

		if ( textureUnit >= capabilities.maxTextures ) {

			console.warn( 'WebGLRenderer: trying to use ' + textureUnit + ' texture units while this GPU supports only ' + capabilities.maxTextures );

		}

		_usedTextureUnits += 1;

		return textureUnit;

	}

	function setTextureParameters ( textureType, texture, isPowerOfTwoImage ) {

		var extension;

		if ( isPowerOfTwoImage ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL( texture.wrapS ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL( texture.wrapT ) );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( texture.minFilter ) );

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			if ( texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping ) {

				console.warn( 'THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.', texture );

			}

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

			if ( texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter ) {

				console.warn( 'THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.', texture );

			}

		}

		extension = extensions.get( 'EXT_texture_filter_anisotropic' );

		if ( extension ) {

			if ( texture.type === THREE.FloatType && extensions.get( 'OES_texture_float_linear' ) === null ) return;
			if ( texture.type === THREE.HalfFloatType && extensions.get( 'OES_texture_half_float_linear' ) === null ) return;

			if ( texture.anisotropy > 1 || properties.get( texture ).__currentAnisotropy ) {

				_gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min( texture.anisotropy, _this.getMaxAnisotropy() ) );
				properties.get( texture ).__currentAnisotropy = texture.anisotropy;

			}

		}

	}

	function uploadTexture( textureProperties, texture, slot ) {

		if ( textureProperties.__webglInit === undefined ) {

			textureProperties.__webglInit = true;

			texture.addEventListener( 'dispose', onTextureDispose );

			textureProperties.__webglTexture = _gl.createTexture();

			_infoMemory.textures ++;

		}

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_2D, textureProperties.__webglTexture );

		_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
		_gl.pixelStorei( _gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha );
		_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, texture.unpackAlignment );

		var image = clampToMaxSize( texture.image, capabilities.maxTextureSize );

		if ( textureNeedsPowerOfTwo( texture ) && isPowerOfTwo( image ) === false ) {

			image = makePowerOfTwo( image );

		}

		var isPowerOfTwoImage = isPowerOfTwo( image ),
		glFormat = paramThreeToGL( texture.format ),
		glType = paramThreeToGL( texture.type );

		setTextureParameters( _gl.TEXTURE_2D, texture, isPowerOfTwoImage );

		var mipmap, mipmaps = texture.mipmaps;

		if ( texture instanceof THREE.DepthTexture ) {

			// populate depth texture with dummy data

			var internalFormat = _gl.DEPTH_COMPONENT;

			if ( texture.type === THREE.FloatType ) {

				if ( !_isWebGL2 ) throw new Error('Float Depth Texture only supported in WebGL2.0');
				internalFormat = _gl.DEPTH_COMPONENT32F;

			} else if ( _isWebGL2 ) {

				// WebGL 2.0 requires signed internalformat for glTexImage2D
				internalFormat = _gl.DEPTH_COMPONENT16;

			}

			state.texImage2D( _gl.TEXTURE_2D, 0, internalFormat, image.width, image.height, 0, glFormat, glType, null );

		} else if ( texture instanceof THREE.DataTexture ) {

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isPowerOfTwoImage ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					state.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

				texture.generateMipmaps = false;

			} else {

				state.texImage2D( _gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data );

			}

		} else if ( texture instanceof THREE.CompressedTexture ) {

			for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

				mipmap = mipmaps[ i ];

				if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

					if ( state.getCompressedTextureFormats().indexOf( glFormat ) > - 1 ) {

						state.compressedTexImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

					} else {

						console.warn( "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()" );

					}

				} else {

					state.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

			}

		} else {

			// regular Texture (image, video, canvas)

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isPowerOfTwoImage ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					state.texImage2D( _gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap );

				}

				texture.generateMipmaps = false;

			} else {

				state.texImage2D( _gl.TEXTURE_2D, 0, glFormat, glFormat, glType, image );

			}

		}

		if ( texture.generateMipmaps && isPowerOfTwoImage ) _gl.generateMipmap( _gl.TEXTURE_2D );

		textureProperties.__version = texture.version;

		if ( texture.onUpdate ) texture.onUpdate( texture );

	}

	function setTexture2D( texture, slot ) {

		var textureProperties = properties.get( texture );

		if ( texture.version > 0 && textureProperties.__version !== texture.version ) {

			var image = texture.image;

			if ( image === undefined ) {

				console.warn( 'THREE.WebGLRenderer: Texture marked for update but image is undefined', texture );
				return;

			}

			if ( image.complete === false ) {

				console.warn( 'THREE.WebGLRenderer: Texture marked for update but image is incomplete', texture );
				return;

			}

			uploadTexture( textureProperties, texture, slot );

			return;

		}

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_2D, textureProperties.__webglTexture );

	}

	function clampToMaxSize ( image, maxSize ) {

		if ( image.width > maxSize || image.height > maxSize ) {

			// Warning: Scaling through the canvas will only work with images that use
			// premultiplied alpha.

			var scale = maxSize / Math.max( image.width, image.height );

			var canvas = document.createElement( 'canvas' );
			canvas.width = Math.floor( image.width * scale );
			canvas.height = Math.floor( image.height * scale );

			var context = canvas.getContext( '2d' );
			context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height );

			console.warn( 'THREE.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image );

			return canvas;

		}

		return image;

	}

	function isPowerOfTwo( image ) {

		return THREE.Math.isPowerOfTwo( image.width ) && THREE.Math.isPowerOfTwo( image.height );

	}

	function textureNeedsPowerOfTwo( texture ) {

		if ( texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping ) return true;
		if ( texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter ) return true;

		return false;

	}

	function makePowerOfTwo( image ) {

		if ( image instanceof HTMLImageElement || image instanceof HTMLCanvasElement ) {

			var canvas = document.createElement( 'canvas' );
			canvas.width = THREE.Math.nearestPowerOfTwo( image.width );
			canvas.height = THREE.Math.nearestPowerOfTwo( image.height );

			var context = canvas.getContext( '2d' );
			context.drawImage( image, 0, 0, canvas.width, canvas.height );

			console.warn( 'THREE.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image );

			return canvas;

		}

		return image;

	}

	function setTextureCube ( texture, slot ) {

		var textureProperties = properties.get( texture );

		if ( texture.image.length === 6 ) {

			if ( texture.version > 0 && textureProperties.__version !== texture.version ) {

				if ( ! textureProperties.__image__webglTextureCube ) {

					texture.addEventListener( 'dispose', onTextureDispose );

					textureProperties.__image__webglTextureCube = _gl.createTexture();

					_infoMemory.textures ++;

				}

				state.activeTexture( _gl.TEXTURE0 + slot );
				state.bindTexture( _gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube );

				_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );

				var isCompressed = texture instanceof THREE.CompressedTexture;
				var isDataTexture = texture.image[ 0 ] instanceof THREE.DataTexture;

				var cubeImage = [];

				for ( var i = 0; i < 6; i ++ ) {

					if ( _this.autoScaleCubemaps && ! isCompressed && ! isDataTexture ) {

						cubeImage[ i ] = clampToMaxSize( texture.image[ i ], capabilities.maxCubemapSize );

					} else {

						cubeImage[ i ] = isDataTexture ? texture.image[ i ].image : texture.image[ i ];

					}

				}

				var image = cubeImage[ 0 ],
				isPowerOfTwoImage = isPowerOfTwo( image ),
				glFormat = paramThreeToGL( texture.format ),
				glType = paramThreeToGL( texture.type );

				setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, isPowerOfTwoImage );

				for ( var i = 0; i < 6; i ++ ) {

					if ( ! isCompressed ) {

						if ( isDataTexture ) {

							state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[ i ].width, cubeImage[ i ].height, 0, glFormat, glType, cubeImage[ i ].data );

						} else {

							state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[ i ] );

						}

					} else {

						var mipmap, mipmaps = cubeImage[ i ].mipmaps;

						for ( var j = 0, jl = mipmaps.length; j < jl; j ++ ) {

							mipmap = mipmaps[ j ];

							if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

								if ( state.getCompressedTextureFormats().indexOf( glFormat ) > - 1 ) {

									state.compressedTexImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

								} else {

									console.warn( "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()" );

								}

							} else {

								state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

							}

						}

					}

				}

				if ( texture.generateMipmaps && isPowerOfTwoImage ) {

					_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

				}

				textureProperties.__version = texture.version;

				if ( texture.onUpdate ) texture.onUpdate( texture );

			} else {

				state.activeTexture( _gl.TEXTURE0 + slot );
				state.bindTexture( _gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube );

			}

		}

	}

	function setTextureCubeDynamic ( texture, slot ) {

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_CUBE_MAP, properties.get( texture ).__webglTexture );

	}

	this.allocTextureUnit = allocTextureUnit;

	//this.setTexture2D = setTexture2D;
	this.setTexture2D = ( function() {

		var warned = false;

		// backwards compatibility: peel texture.texture
		return function( texture, slot ) {

			if ( texture instanceof THREE.WebGLRenderTarget ) {

				if ( ! warned ) {

					console.warn( "THREE.WebGLRenderer.setTexture2D: don't use render targets as textures. Use their .texture property instead." );
					warned = true;

				}

				texture = texture.texture;

			}

			setTexture2D( texture, slot );

		};

	}() );

	this.setTexture = ( function() {

		var warned = false;

		return function( texture, slot ) {

			if ( ! warned ) {

				console.warn( "THREE.WebGLRenderer: .setTexture is deprecated, use setTexture2D instead." );
				warned = true;

			}

			_this.setTexture2D( texture, slot );

		};

	}() );

	this.setTextureCube = ( function() {

		var warned = false;

		return function( texture, slot ) {

			// backwards compatibility: peel texture.texture
			if ( texture instanceof THREE.WebGLRenderTargetCube ) {

				if ( ! warned ) {

					console.warn( "THREE.WebGLRenderer.setTextureCube: don't use cube render targets as textures. Use their .texture property instead." );
					warned = true;

				}

				texture = texture.texture;

			}

			// currently relying on the fact that WebGLRenderTargetCube.texture is a Texture and NOT a CubeTexture
			// TODO: unify these code paths
			if ( texture instanceof THREE.CubeTexture ||
				 ( Array.isArray( texture.image ) && texture.image.length === 6 ) ) {

				// CompressedTexture can have Array in image :/

				// this function alone should take care of cube textures
				setTextureCube( texture, slot );

			} else {

				// assumed: texture property of THREE.WebGLRenderTargetCube

				setTextureCubeDynamic( texture, slot );

			}

		};

	}() );

	// Render targets

	// Setup storage for target texture and bind it to correct framebuffer
	function setupFrameBufferTexture ( framebuffer, renderTarget, attachment, textureTarget ) {

		var glFormat = paramThreeToGL( renderTarget.texture.format );
		var glType = paramThreeToGL( renderTarget.texture.type );
		state.texImage2D( textureTarget, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );
		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, attachment, textureTarget, properties.get( renderTarget.texture ).__webglTexture, 0 );
		_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );

	}

	// Setup storage for internal depth/stencil buffers and bind to correct framebuffer
	function setupRenderBufferStorage ( renderbuffer, renderTarget ) {

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

		if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else {

			// FIXME: We don't support !depth !stencil
			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height );

		}

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );

	}

	// Setup resources for a Depth Texture for a FBO (needs an extension)
	function setupDepthTexture ( framebuffer, renderTarget ) {

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );
		if ( isCube ) throw new Error('Depth Texture with cube render targets is not supported!');

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );

		if ( !( renderTarget.depthTexture instanceof THREE.DepthTexture ) ) {

			throw new Error('renderTarget.depthTexture must be an instance of THREE.DepthTexture');

		}

		// upload an empty depth texture with framebuffer size
		if ( !properties.get( renderTarget.depthTexture ).__webglTexture ||
				renderTarget.depthTexture.image.width !== renderTarget.width ||
				renderTarget.depthTexture.image.height !== renderTarget.height ) {
			renderTarget.depthTexture.image.width = renderTarget.width;
			renderTarget.depthTexture.image.height = renderTarget.height;
			renderTarget.depthTexture.needsUpdate = true;
		}

		_this.setTexture2D( renderTarget.depthTexture, 0 );

		var webglDepthTexture = properties.get( renderTarget.depthTexture ).__webglTexture;
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D, webglDepthTexture, 0 );

	}

	// Setup GL resources for a non-texture depth buffer
	function setupDepthRenderbuffer( renderTarget ) {

		var renderTargetProperties = properties.get( renderTarget );

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );

		if ( renderTarget.depthTexture ) {

			if ( isCube ) throw new Error('target.depthTexture not supported in Cube render targets');

			setupDepthTexture( renderTargetProperties.__webglFramebuffer, renderTarget );

		} else {

			if ( isCube ) {

				renderTargetProperties.__webglDepthbuffer = [];

				for ( var i = 0; i < 6; i ++ ) {

					_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer[ i ] );
					renderTargetProperties.__webglDepthbuffer[ i ] = _gl.createRenderbuffer();
					setupRenderBufferStorage( renderTargetProperties.__webglDepthbuffer[ i ], renderTarget );

				}

			} else {

				_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer );
				renderTargetProperties.__webglDepthbuffer = _gl.createRenderbuffer();
				setupRenderBufferStorage( renderTargetProperties.__webglDepthbuffer, renderTarget );

			}

		}

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );

	}

	// Set up GL resources for the render target
	function setupRenderTarget( renderTarget ) {

		var renderTargetProperties = properties.get( renderTarget );
		var textureProperties = properties.get( renderTarget.texture );

		renderTarget.addEventListener( 'dispose', onRenderTargetDispose );

		textureProperties.__webglTexture = _gl.createTexture();

		_infoMemory.textures ++;

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );
		var isTargetPowerOfTwo = THREE.Math.isPowerOfTwo( renderTarget.width ) && THREE.Math.isPowerOfTwo( renderTarget.height );

		// Setup framebuffer

		if ( isCube ) {

			renderTargetProperties.__webglFramebuffer = [];

			for ( var i = 0; i < 6; i ++ ) {

				renderTargetProperties.__webglFramebuffer[ i ] = _gl.createFramebuffer();

			}

		} else {

			renderTargetProperties.__webglFramebuffer = _gl.createFramebuffer();

		}

		// Setup color buffer

		if ( isCube ) {

			state.bindTexture( _gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture );
			setTextureParameters( _gl.TEXTURE_CUBE_MAP, renderTarget.texture, isTargetPowerOfTwo );

			for ( var i = 0; i < 6; i ++ ) {

				setupFrameBufferTexture( renderTargetProperties.__webglFramebuffer[ i ], renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i );

			}

			if ( renderTarget.texture.generateMipmaps && isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );
			state.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

		} else {

			state.bindTexture( _gl.TEXTURE_2D, textureProperties.__webglTexture );
			setTextureParameters( _gl.TEXTURE_2D, renderTarget.texture, isTargetPowerOfTwo );
			setupFrameBufferTexture( renderTargetProperties.__webglFramebuffer, renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D );

			if ( renderTarget.texture.generateMipmaps && isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );
			state.bindTexture( _gl.TEXTURE_2D, null );

		}

		// Setup depth and stencil buffers

		if ( renderTarget.depthBuffer ) {

			setupDepthRenderbuffer( renderTarget );

		}

	}

	this.getCurrentRenderTarget = function() {

		return _currentRenderTarget;

	};

	this.setRenderTarget = function ( renderTarget ) {

		_currentRenderTarget = renderTarget;

		if ( renderTarget && properties.get( renderTarget ).__webglFramebuffer === undefined ) {

			setupRenderTarget( renderTarget );

		}

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );
		var framebuffer;

		if ( renderTarget ) {

			var renderTargetProperties = properties.get( renderTarget );

			if ( isCube ) {

				framebuffer = renderTargetProperties.__webglFramebuffer[ renderTarget.activeCubeFace ];

			} else {

				framebuffer = renderTargetProperties.__webglFramebuffer;

			}

			_currentScissor.copy( renderTarget.scissor );
			_currentScissorTest = renderTarget.scissorTest;

			_currentViewport.copy( renderTarget.viewport );

		} else {

			framebuffer = null;

			_currentScissor.copy( _scissor ).multiplyScalar( _pixelRatio );
			_currentScissorTest = _scissorTest;

			_currentViewport.copy( _viewport ).multiplyScalar( _pixelRatio );

		}

		if ( _currentFramebuffer !== framebuffer ) {

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
			_currentFramebuffer = framebuffer;

		}

		state.scissor( _currentScissor );
		state.setScissorTest( _currentScissorTest );

		state.viewport( _currentViewport );

		if ( isCube ) {

			var textureProperties = properties.get( renderTarget.texture );
			_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, renderTarget.activeMipMapLevel );

		}

	};

	this.readRenderTargetPixels = function ( renderTarget, x, y, width, height, buffer ) {

		if ( renderTarget instanceof THREE.WebGLRenderTarget === false ) {

			console.error( 'THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.' );
			return;

		}

		var framebuffer = properties.get( renderTarget ).__webglFramebuffer;

		if ( framebuffer ) {

			var restore = false;

			if ( framebuffer !== _currentFramebuffer ) {

				_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );

				restore = true;

			}

			try {

				var texture = renderTarget.texture;

				if ( texture.format !== THREE.RGBAFormat && paramThreeToGL( texture.format ) !== _gl.getParameter( _gl.IMPLEMENTATION_COLOR_READ_FORMAT ) ) {

					console.error( 'THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.' );
					return;

				}

				if ( texture.type !== THREE.UnsignedByteType &&
				     paramThreeToGL( texture.type ) !== _gl.getParameter( _gl.IMPLEMENTATION_COLOR_READ_TYPE ) &&
				     ! ( texture.type === THREE.FloatType && extensions.get( 'WEBGL_color_buffer_float' ) ) &&
				     ! ( texture.type === THREE.HalfFloatType && extensions.get( 'EXT_color_buffer_half_float' ) ) ) {

					console.error( 'THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.' );
					return;

				}

				if ( _gl.checkFramebufferStatus( _gl.FRAMEBUFFER ) === _gl.FRAMEBUFFER_COMPLETE ) {

					// the following if statement ensures valid read requests (no out-of-bounds pixels, see #8604)

					if ( ( x >= 0 && x <= ( renderTarget.width - width ) ) && ( y >= 0 && y <= ( renderTarget.height - height ) ) ) {

						_gl.readPixels( x, y, width, height, paramThreeToGL( texture.format ), paramThreeToGL( texture.type ), buffer );

					}

				} else {

					console.error( 'THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.' );

				}

			} finally {

				if ( restore ) {

					_gl.bindFramebuffer( _gl.FRAMEBUFFER, _currentFramebuffer );

				}

			}

		}

	};

	function updateRenderTargetMipmap( renderTarget ) {

		var target = renderTarget instanceof THREE.WebGLRenderTargetCube ? _gl.TEXTURE_CUBE_MAP : _gl.TEXTURE_2D;
		var texture = properties.get( renderTarget.texture ).__webglTexture;

		state.bindTexture( target, texture );
		_gl.generateMipmap( target );
		state.bindTexture( target, null );

	}

	// Fallback filters for non-power-of-2 textures

	function filterFallback ( f ) {

		if ( f === THREE.NearestFilter || f === THREE.NearestMipMapNearestFilter || f === THREE.NearestMipMapLinearFilter ) {

			return _gl.NEAREST;

		}

		return _gl.LINEAR;

	}

	// Map three.js constants to WebGL constants

	function paramThreeToGL ( p ) {

		var extension;

		if ( p === THREE.RepeatWrapping ) return _gl.REPEAT;
		if ( p === THREE.ClampToEdgeWrapping ) return _gl.CLAMP_TO_EDGE;
		if ( p === THREE.MirroredRepeatWrapping ) return _gl.MIRRORED_REPEAT;

		if ( p === THREE.NearestFilter ) return _gl.NEAREST;
		if ( p === THREE.NearestMipMapNearestFilter ) return _gl.NEAREST_MIPMAP_NEAREST;
		if ( p === THREE.NearestMipMapLinearFilter ) return _gl.NEAREST_MIPMAP_LINEAR;

		if ( p === THREE.LinearFilter ) return _gl.LINEAR;
		if ( p === THREE.LinearMipMapNearestFilter ) return _gl.LINEAR_MIPMAP_NEAREST;
		if ( p === THREE.LinearMipMapLinearFilter ) return _gl.LINEAR_MIPMAP_LINEAR;

		if ( p === THREE.UnsignedByteType ) return _gl.UNSIGNED_BYTE;
		if ( p === THREE.UnsignedShort4444Type ) return _gl.UNSIGNED_SHORT_4_4_4_4;
		if ( p === THREE.UnsignedShort5551Type ) return _gl.UNSIGNED_SHORT_5_5_5_1;
		if ( p === THREE.UnsignedShort565Type ) return _gl.UNSIGNED_SHORT_5_6_5;

		if ( p === THREE.ByteType ) return _gl.BYTE;
		if ( p === THREE.ShortType ) return _gl.SHORT;
		if ( p === THREE.UnsignedShortType ) return _gl.UNSIGNED_SHORT;
		if ( p === THREE.IntType ) return _gl.INT;
		if ( p === THREE.UnsignedIntType ) return _gl.UNSIGNED_INT;
		if ( p === THREE.FloatType ) return _gl.FLOAT;

		extension = extensions.get( 'OES_texture_half_float' );

		if ( extension !== null ) {

			if ( p === THREE.HalfFloatType ) return extension.HALF_FLOAT_OES;

		}

		if ( p === THREE.AlphaFormat ) return _gl.ALPHA;
		if ( p === THREE.RGBFormat ) return _gl.RGB;
		if ( p === THREE.RGBAFormat ) return _gl.RGBA;
		if ( p === THREE.LuminanceFormat ) return _gl.LUMINANCE;
		if ( p === THREE.LuminanceAlphaFormat ) return _gl.LUMINANCE_ALPHA;
		if ( p === THREE.DepthFormat ) return _gl.DEPTH_COMPONENT;

		if ( p === THREE.AddEquation ) return _gl.FUNC_ADD;
		if ( p === THREE.SubtractEquation ) return _gl.FUNC_SUBTRACT;
		if ( p === THREE.ReverseSubtractEquation ) return _gl.FUNC_REVERSE_SUBTRACT;

		if ( p === THREE.ZeroFactor ) return _gl.ZERO;
		if ( p === THREE.OneFactor ) return _gl.ONE;
		if ( p === THREE.SrcColorFactor ) return _gl.SRC_COLOR;
		if ( p === THREE.OneMinusSrcColorFactor ) return _gl.ONE_MINUS_SRC_COLOR;
		if ( p === THREE.SrcAlphaFactor ) return _gl.SRC_ALPHA;
		if ( p === THREE.OneMinusSrcAlphaFactor ) return _gl.ONE_MINUS_SRC_ALPHA;
		if ( p === THREE.DstAlphaFactor ) return _gl.DST_ALPHA;
		if ( p === THREE.OneMinusDstAlphaFactor ) return _gl.ONE_MINUS_DST_ALPHA;

		if ( p === THREE.DstColorFactor ) return _gl.DST_COLOR;
		if ( p === THREE.OneMinusDstColorFactor ) return _gl.ONE_MINUS_DST_COLOR;
		if ( p === THREE.SrcAlphaSaturateFactor ) return _gl.SRC_ALPHA_SATURATE;

		extension = extensions.get( 'WEBGL_compressed_texture_s3tc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_S3TC_DXT1_Format ) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT1_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT3_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
			if ( p === THREE.RGBA_S3TC_DXT5_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;

		}

		extension = extensions.get( 'WEBGL_compressed_texture_pvrtc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGB_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

		}

		extension = extensions.get( 'WEBGL_compressed_texture_etc1' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_ETC1_Format ) return extension.COMPRESSED_RGB_ETC1_WEBGL;

		}

		extension = extensions.get( 'EXT_blend_minmax' );

		if ( extension !== null ) {

			if ( p === THREE.MinEquation ) return extension.MIN_EXT;
			if ( p === THREE.MaxEquation ) return extension.MAX_EXT;

		}

		return 0;

	}

};

// File:src/renderers/WebGLRenderTarget.js

/**
 * @author szimek / https://github.com/szimek/
 * @author alteredq / http://alteredqualia.com/
 * @author Marius Kintel / https://github.com/kintel
 */

/*
 In options, we can specify:
 * Texture parameters for an auto-generated target texture
 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
*/
THREE.WebGLRenderTarget = function ( width, height, options ) {

	this.uuid = THREE.Math.generateUUID();

	this.width = width;
	this.height = height;

	this.scissor = new THREE.Vector4( 0, 0, width, height );
	this.scissorTest = false;

	this.viewport = new THREE.Vector4( 0, 0, width, height );

	options = options || {};

	if ( options.minFilter === undefined ) options.minFilter = THREE.LinearFilter;

	this.texture = new THREE.Texture( undefined, undefined, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding );

	this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
	this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;
	this.depthTexture = null;

};

Object.assign( THREE.WebGLRenderTarget.prototype, THREE.EventDispatcher.prototype, {

	setSize: function ( width, height ) {

		if ( this.width !== width || this.height !== height ) {

			this.width = width;
			this.height = height;

			this.dispose();

		}

		this.viewport.set( 0, 0, width, height );
		this.scissor.set( 0, 0, width, height );

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( source ) {

		this.width = source.width;
		this.height = source.height;

		this.viewport.copy( source.viewport );

		this.texture = source.texture.clone();

		this.depthBuffer = source.depthBuffer;
		this.stencilBuffer = source.stencilBuffer;
		this.depthTexture = source.depthTexture;

		return this;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

} );

// File:src/renderers/WebGLRenderTargetCube.js

/**
 * @author alteredq / http://alteredqualia.com
 */

THREE.WebGLRenderTargetCube = function ( width, height, options ) {

	THREE.WebGLRenderTarget.call( this, width, height, options );

	this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
	this.activeMipMapLevel = 0;

};

THREE.WebGLRenderTargetCube.prototype = Object.create( THREE.WebGLRenderTarget.prototype );
THREE.WebGLRenderTargetCube.prototype.constructor = THREE.WebGLRenderTargetCube;

// File:src/renderers/webgl/WebGLBufferRenderer.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLBufferRenderer = function ( _gl, extensions, _infoRender ) {

	var mode;

	function setMode( value ) {

		mode = value;

	}

	function render( start, count ) {

		_gl.drawArrays( mode, start, count );

		_infoRender.calls ++;
		_infoRender.vertices += count;
		if ( mode === _gl.TRIANGLES ) _infoRender.faces += count / 3;

	}

	function renderInstances( geometry ) {

		var extension = extensions.get( 'ANGLE_instanced_arrays' );

		if ( extension === null ) {

			console.error( 'THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
			return;

		}

		var position = geometry.attributes.position;

		var count = 0;

		if ( position instanceof THREE.InterleavedBufferAttribute ) {

			count = position.data.count;

			extension.drawArraysInstancedANGLE( mode, 0, count, geometry.maxInstancedCount );

		} else {

			count = position.count;

			extension.drawArraysInstancedANGLE( mode, 0, count, geometry.maxInstancedCount );

		}

		_infoRender.calls ++;
		_infoRender.vertices += count * geometry.maxInstancedCount;
		if ( mode === _gl.TRIANGLES ) _infoRender.faces += geometry.maxInstancedCount * count / 3;

	}

	this.setMode = setMode;
	this.render = render;
	this.renderInstances = renderInstances;

};

// File:src/renderers/webgl/WebGLClipping.js

THREE.WebGLClipping = function() {

	var scope = this,

		globalState = null,
		numGlobalPlanes = 0,
		localClippingEnabled = false,
		renderingShadows = false,

		plane = new THREE.Plane(),
		viewNormalMatrix = new THREE.Matrix3(),

		uniform = { value: null, needsUpdate: false };

	this.uniform = uniform;
	this.numPlanes = 0;

	this.init = function( planes, enableLocalClipping, camera ) {

		var enabled =
			planes.length !== 0 ||
			enableLocalClipping ||
			// enable state of previous frame - the clipping code has to
			// run another frame in order to reset the state:
			numGlobalPlanes !== 0 ||
			localClippingEnabled;

		localClippingEnabled = enableLocalClipping;

		globalState = projectPlanes( planes, camera, 0 );
		numGlobalPlanes = planes.length;

		return enabled;

	};

	this.beginShadows = function() {

		renderingShadows = true;
		projectPlanes( null );

	};

	this.endShadows = function() {

		renderingShadows = false;
		resetGlobalState();

	};

	this.setState = function( planes, clipShadows, camera, cache, fromCache ) {

		if ( ! localClippingEnabled ||
				planes === null || planes.length === 0 ||
				renderingShadows && ! clipShadows ) {
			// there's no local clipping

			if ( renderingShadows ) {
				// there's no global clipping

				projectPlanes( null );

			} else {

				resetGlobalState();
			}

		} else {

			var nGlobal = renderingShadows ? 0 : numGlobalPlanes,
				lGlobal = nGlobal * 4,

				dstArray = cache.clippingState || null;

			uniform.value = dstArray; // ensure unique state

			dstArray = projectPlanes( planes, camera, lGlobal, fromCache );

			for ( var i = 0; i !== lGlobal; ++ i ) {

				dstArray[ i ] = globalState[ i ];

			}

			cache.clippingState = dstArray;
			this.numPlanes += nGlobal;

		}


	};

	function resetGlobalState() {

		if ( uniform.value !== globalState ) {

			uniform.value = globalState;
			uniform.needsUpdate = numGlobalPlanes > 0;

		}

		scope.numPlanes = numGlobalPlanes;

	}

	function projectPlanes( planes, camera, dstOffset, skipTransform ) {

		var nPlanes = planes !== null ? planes.length : 0,
			dstArray = null;

		if ( nPlanes !== 0 ) {

			dstArray = uniform.value;

			if ( skipTransform !== true || dstArray === null ) {

				var flatSize = dstOffset + nPlanes * 4,
					viewMatrix = camera.matrixWorldInverse;

				viewNormalMatrix.getNormalMatrix( viewMatrix );

				if ( dstArray === null || dstArray.length < flatSize ) {

					dstArray = new Float32Array( flatSize );

				}

				for ( var i = 0, i4 = dstOffset;
									i !== nPlanes; ++ i, i4 += 4 ) {

					plane.copy( planes[ i ] ).
							applyMatrix4( viewMatrix, viewNormalMatrix );

					plane.normal.toArray( dstArray, i4 );
					dstArray[ i4 + 3 ] = plane.constant;

				}

			}

			uniform.value = dstArray;
			uniform.needsUpdate = true;

		}

		scope.numPlanes = nPlanes;
		return dstArray;

	}

};


// File:src/renderers/webgl/WebGLIndexedBufferRenderer.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLIndexedBufferRenderer = function ( _gl, extensions, _infoRender ) {

	var mode;

	function setMode( value ) {

		mode = value;

	}

	var type, size;

	function setIndex( index ) {

		if ( index.array instanceof Uint32Array && extensions.get( 'OES_element_index_uint' ) ) {

			type = _gl.UNSIGNED_INT;
			size = 4;

		} else {

			type = _gl.UNSIGNED_SHORT;
			size = 2;

		}

	}

	function render( start, count ) {

		_gl.drawElements( mode, count, type, start * size );

		_infoRender.calls ++;
		_infoRender.vertices += count;
		if ( mode === _gl.TRIANGLES ) _infoRender.faces += count / 3;

	}

	function renderInstances( geometry, start, count ) {

		var extension = extensions.get( 'ANGLE_instanced_arrays' );

		if ( extension === null ) {

			console.error( 'THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
			return;

		}

		extension.drawElementsInstancedANGLE( mode, count, type, start * size, geometry.maxInstancedCount );

		_infoRender.calls ++;
		_infoRender.vertices += count * geometry.maxInstancedCount;
		if ( mode === _gl.TRIANGLES ) _infoRender.faces += geometry.maxInstancedCount * count / 3;
	}

	this.setMode = setMode;
	this.setIndex = setIndex;
	this.render = render;
	this.renderInstances = renderInstances;

};

// File:src/renderers/webgl/WebGLExtensions.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLExtensions = function ( gl ) {

	var extensions = {};

	this.get = function ( name ) {

		if ( extensions[ name ] !== undefined ) {

			return extensions[ name ];

		}

		var extension;

		switch ( name ) {

			case 'WEBGL_depth_texture':
				extension = gl.getExtension( 'WEBGL_depth_texture' ) || gl.getExtension( 'MOZ_WEBGL_depth_texture' ) || gl.getExtension( 'WEBKIT_WEBGL_depth_texture' );
				break;

			case 'EXT_texture_filter_anisotropic':
				extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
				break;

			case 'WEBGL_compressed_texture_s3tc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
				break;

			case 'WEBGL_compressed_texture_pvrtc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
				break;

			case 'WEBGL_compressed_texture_etc1':
				extension = gl.getExtension( 'WEBGL_compressed_texture_etc1' );
				break;

			default:
				extension = gl.getExtension( name );

		}

		if ( extension === null ) {

			console.warn( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );

		}

		extensions[ name ] = extension;

		return extension;

	};

};

// File:src/renderers/webgl/WebGLCapabilities.js

THREE.WebGLCapabilities = function ( gl, extensions, parameters ) {

	function getMaxPrecision( precision ) {

		if ( precision === 'highp' ) {

			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision > 0 ) {

				return 'highp';

			}

			precision = 'mediump';

		}

		if ( precision === 'mediump' ) {

			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision > 0 ) {

				return 'mediump';

			}

		}

		return 'lowp';

	}

	this.getMaxPrecision = getMaxPrecision;

	this.precision = parameters.precision !== undefined ? parameters.precision : 'highp';
	this.logarithmicDepthBuffer = parameters.logarithmicDepthBuffer !== undefined ? parameters.logarithmicDepthBuffer : false;

	this.maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );
	this.maxVertexTextures = gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
	this.maxTextureSize = gl.getParameter( gl.MAX_TEXTURE_SIZE );
	this.maxCubemapSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE );

	this.maxAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );
	this.maxVertexUniforms = gl.getParameter( gl.MAX_VERTEX_UNIFORM_VECTORS );
	this.maxVaryings = gl.getParameter( gl.MAX_VARYING_VECTORS );
	this.maxFragmentUniforms = gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS );

	this.vertexTextures = this.maxVertexTextures > 0;
	this.floatFragmentTextures = !! extensions.get( 'OES_texture_float' );
	this.floatVertexTextures = this.vertexTextures && this.floatFragmentTextures;

	var _maxPrecision = getMaxPrecision( this.precision );

	if ( _maxPrecision !== this.precision ) {

		console.warn( 'THREE.WebGLRenderer:', this.precision, 'not supported, using', _maxPrecision, 'instead.' );
		this.precision = _maxPrecision;

	}

	if ( this.logarithmicDepthBuffer ) {

		this.logarithmicDepthBuffer = !! extensions.get( 'EXT_frag_depth' );

	}

};

// File:src/renderers/webgl/WebGLGeometries.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLGeometries = function ( gl, properties, info ) {

	var geometries = {};

	function get( object ) {

		var geometry = object.geometry;

		if ( geometries[ geometry.id ] !== undefined ) {

			return geometries[ geometry.id ];

		}

		geometry.addEventListener( 'dispose', onGeometryDispose );

		var buffergeometry;

		if ( geometry instanceof THREE.BufferGeometry ) {

			buffergeometry = geometry;

		} else if ( geometry instanceof THREE.Geometry ) {

			if ( geometry._bufferGeometry === undefined ) {

				geometry._bufferGeometry = new THREE.BufferGeometry().setFromObject( object );

			}

			buffergeometry = geometry._bufferGeometry;

		}

		geometries[ geometry.id ] = buffergeometry;

		info.memory.geometries ++;

		return buffergeometry;

	}

	function onGeometryDispose( event ) {

		var geometry = event.target;
		var buffergeometry = geometries[ geometry.id ];

		if ( buffergeometry.index !== null ) {

			deleteAttribute( buffergeometry.index );

		}

		deleteAttributes( buffergeometry.attributes );

		geometry.removeEventListener( 'dispose', onGeometryDispose );

		delete geometries[ geometry.id ];

		// TODO

		var property = properties.get( geometry );

		if ( property.wireframe ) {

			deleteAttribute( property.wireframe );

		}

		properties.delete( geometry );

		var bufferproperty = properties.get( buffergeometry );

		if ( bufferproperty.wireframe ) {

			deleteAttribute( bufferproperty.wireframe );

		}

		properties.delete( buffergeometry );

		//

		info.memory.geometries --;

	}

	function getAttributeBuffer( attribute ) {

		if ( attribute instanceof THREE.InterleavedBufferAttribute ) {

			return properties.get( attribute.data ).__webglBuffer;

		}

		return properties.get( attribute ).__webglBuffer;

	}

	function deleteAttribute( attribute ) {

		var buffer = getAttributeBuffer( attribute );

		if ( buffer !== undefined ) {

			gl.deleteBuffer( buffer );
			removeAttributeBuffer( attribute );

		}

	}

	function deleteAttributes( attributes ) {

		for ( var name in attributes ) {

			deleteAttribute( attributes[ name ] );

		}

	}

	function removeAttributeBuffer( attribute ) {

		if ( attribute instanceof THREE.InterleavedBufferAttribute ) {

			properties.delete( attribute.data );

		} else {

			properties.delete( attribute );

		}

	}

	this.get = get;

};

// File:src/renderers/webgl/WebGLLights.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLLights = function () {

	var lights = {};

	this.get = function ( light ) {

		if ( lights[ light.id ] !== undefined ) {

			return lights[ light.id ];

		}

		var uniforms;

		switch ( light.type ) {

			case 'DirectionalLight':
				uniforms = {
					direction: new THREE.Vector3(),
					color: new THREE.Color(),

					shadow: false,
					shadowBias: 0,
					shadowRadius: 1,
					shadowMapSize: new THREE.Vector2()
				};
				break;

			case 'SpotLight':
				uniforms = {
					position: new THREE.Vector3(),
					direction: new THREE.Vector3(),
					color: new THREE.Color(),
					distance: 0,
					coneCos: 0,
					penumbraCos: 0,
					decay: 0,

					shadow: false,
					shadowBias: 0,
					shadowRadius: 1,
					shadowMapSize: new THREE.Vector2()
				};
				break;

			case 'PointLight':
				uniforms = {
					position: new THREE.Vector3(),
					color: new THREE.Color(),
					distance: 0,
					decay: 0,

					shadow: false,
					shadowBias: 0,
					shadowRadius: 1,
					shadowMapSize: new THREE.Vector2()
				};
				break;

			case 'HemisphereLight':
				uniforms = {
					direction: new THREE.Vector3(),
					skyColor: new THREE.Color(),
					groundColor: new THREE.Color()
				};
				break;

		}

		lights[ light.id ] = uniforms;

		return uniforms;

	};

};

// File:src/renderers/webgl/WebGLObjects.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLObjects = function ( gl, properties, info ) {

	var geometries = new THREE.WebGLGeometries( gl, properties, info );

	//

	function update( object ) {

		// TODO: Avoid updating twice (when using shadowMap). Maybe add frame counter.

		var geometry = geometries.get( object );

		if ( object.geometry instanceof THREE.Geometry ) {

			geometry.updateFromObject( object );

		}

		var index = geometry.index;
		var attributes = geometry.attributes;

		if ( index !== null ) {

			updateAttribute( index, gl.ELEMENT_ARRAY_BUFFER );

		}

		for ( var name in attributes ) {

			updateAttribute( attributes[ name ], gl.ARRAY_BUFFER );

		}

		// morph targets

		var morphAttributes = geometry.morphAttributes;

		for ( var name in morphAttributes ) {

			var array = morphAttributes[ name ];

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				updateAttribute( array[ i ], gl.ARRAY_BUFFER );

			}

		}

		return geometry;

	}

	function updateAttribute( attribute, bufferType ) {

		var data = ( attribute instanceof THREE.InterleavedBufferAttribute ) ? attribute.data : attribute;

		var attributeProperties = properties.get( data );

		if ( attributeProperties.__webglBuffer === undefined ) {

			createBuffer( attributeProperties, data, bufferType );

		} else if ( attributeProperties.version !== data.version ) {

			updateBuffer( attributeProperties, data, bufferType );

		}

	}

	function createBuffer( attributeProperties, data, bufferType ) {

		attributeProperties.__webglBuffer = gl.createBuffer();
		gl.bindBuffer( bufferType, attributeProperties.__webglBuffer );

		var usage = data.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

		gl.bufferData( bufferType, data.array, usage );

		attributeProperties.version = data.version;

	}

	function updateBuffer( attributeProperties, data, bufferType ) {

		gl.bindBuffer( bufferType, attributeProperties.__webglBuffer );

		if ( data.dynamic === false || data.updateRange.count === - 1 ) {

			// Not using update ranges

			gl.bufferSubData( bufferType, 0, data.array );

		} else if ( data.updateRange.count === 0 ) {

			console.error( 'THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.' );

		} else {

			gl.bufferSubData( bufferType, data.updateRange.offset * data.array.BYTES_PER_ELEMENT,
							  data.array.subarray( data.updateRange.offset, data.updateRange.offset + data.updateRange.count ) );

			data.updateRange.count = 0; // reset range

		}

		attributeProperties.version = data.version;

	}

	function getAttributeBuffer( attribute ) {

		if ( attribute instanceof THREE.InterleavedBufferAttribute ) {

			return properties.get( attribute.data ).__webglBuffer;

		}

		return properties.get( attribute ).__webglBuffer;

	}

	function getWireframeAttribute( geometry ) {

		var property = properties.get( geometry );

		if ( property.wireframe !== undefined ) {

			return property.wireframe;

		}

		var indices = [];

		var index = geometry.index;
		var attributes = geometry.attributes;
		var position = attributes.position;

		// console.time( 'wireframe' );

		if ( index !== null ) {

			var edges = {};
			var array = index.array;

			for ( var i = 0, l = array.length; i < l; i += 3 ) {

				var a = array[ i + 0 ];
				var b = array[ i + 1 ];
				var c = array[ i + 2 ];

				if ( checkEdge( edges, a, b ) ) indices.push( a, b );
				if ( checkEdge( edges, b, c ) ) indices.push( b, c );
				if ( checkEdge( edges, c, a ) ) indices.push( c, a );

			}

		} else {

			var array = attributes.position.array;

			for ( var i = 0, l = ( array.length / 3 ) - 1; i < l; i += 3 ) {

				var a = i + 0;
				var b = i + 1;
				var c = i + 2;

				indices.push( a, b, b, c, c, a );

			}

		}

		// console.timeEnd( 'wireframe' );

		var TypeArray = position.count > 65535 ? Uint32Array : Uint16Array;
		var attribute = new THREE.BufferAttribute( new TypeArray( indices ), 1 );

		updateAttribute( attribute, gl.ELEMENT_ARRAY_BUFFER );

		property.wireframe = attribute;

		return attribute;

	}

	function checkEdge( edges, a, b ) {

		if ( a > b ) {

			var tmp = a;
			a = b;
			b = tmp;

		}

		var list = edges[ a ];

		if ( list === undefined ) {

			edges[ a ] = [ b ];
			return true;

		} else if ( list.indexOf( b ) === -1 ) {

			list.push( b );
			return true;

		}

		return false;

	}

	this.getAttributeBuffer = getAttributeBuffer;
	this.getWireframeAttribute = getWireframeAttribute;

	this.update = update;

};

// File:src/renderers/webgl/WebGLProgram.js

THREE.WebGLProgram = ( function () {

	var programIdCount = 0;

	function getEncodingComponents( encoding ) {

		switch ( encoding ) {

			case THREE.LinearEncoding:
				return [ 'Linear','( value )' ];
			case THREE.sRGBEncoding:
				return [ 'sRGB','( value )' ];
			case THREE.RGBEEncoding:
				return [ 'RGBE','( value )' ];
			case THREE.RGBM7Encoding:
				return [ 'RGBM','( value, 7.0 )' ];
			case THREE.RGBM16Encoding:
				return [ 'RGBM','( value, 16.0 )' ];
			case THREE.RGBDEncoding:
				return [ 'RGBD','( value, 256.0 )' ];
			case THREE.GammaEncoding:
				return [ 'Gamma','( value, float( GAMMA_FACTOR ) )' ];
			default:
				throw new Error( 'unsupported encoding: ' + encoding );

		}

	}

	function getTexelDecodingFunction( functionName, encoding ) {

		var components = getEncodingComponents( encoding );
		return "vec4 " + functionName + "( vec4 value ) { return " + components[ 0 ] + "ToLinear" + components[ 1 ] + "; }";

	}

	function getTexelEncodingFunction( functionName, encoding ) {

		var components = getEncodingComponents( encoding );
		return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[ 0 ] + components[ 1 ] + "; }";

	}

	function getToneMappingFunction( functionName, toneMapping ) {

		var toneMappingName;

		switch ( toneMapping ) {

			case THREE.LinearToneMapping:
				toneMappingName = "Linear";
				break;

			case THREE.ReinhardToneMapping:
				toneMappingName = "Reinhard";
				break;

			case THREE.Uncharted2ToneMapping:
				toneMappingName = "Uncharted2";
				break;

			case THREE.CineonToneMapping:
				toneMappingName = "OptimizedCineon";
				break;

			default:
				throw new Error( 'unsupported toneMapping: ' + toneMapping );

		}

		return "vec3 " + functionName + "( vec3 color ) { return " + toneMappingName + "ToneMapping( color ); }";

	}

	function generateExtensions( extensions, parameters, rendererExtensions ) {

		extensions = extensions || {};

		var chunks = [
			( extensions.derivatives || parameters.envMapCubeUV || parameters.bumpMap || parameters.normalMap || parameters.flatShading ) ? '#extension GL_OES_standard_derivatives : enable' : '',
			( extensions.fragDepth || parameters.logarithmicDepthBuffer ) && rendererExtensions.get( 'EXT_frag_depth' ) ? '#extension GL_EXT_frag_depth : enable' : '',
			( extensions.drawBuffers ) && rendererExtensions.get( 'WEBGL_draw_buffers' ) ? '#extension GL_EXT_draw_buffers : require' : '',
			( extensions.shaderTextureLOD || parameters.envMap ) && rendererExtensions.get( 'EXT_shader_texture_lod' ) ? '#extension GL_EXT_shader_texture_lod : enable' : '',
		];

		return chunks.filter( filterEmptyLine ).join( '\n' );

	}

	function generateDefines( defines ) {

		var chunks = [];

		for ( var name in defines ) {

			var value = defines[ name ];

			if ( value === false ) continue;

			chunks.push( '#define ' + name + ' ' + value );

		}

		return chunks.join( '\n' );

	}

	function fetchAttributeLocations( gl, program, identifiers ) {

		var attributes = {};

		var n = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );

		for ( var i = 0; i < n; i ++ ) {

			var info = gl.getActiveAttrib( program, i );
			var name = info.name;

			// console.log("THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:", name, i );

			attributes[ name ] = gl.getAttribLocation( program, name );

		}

		return attributes;

	}

	function filterEmptyLine( string ) {

		return string !== '';

	}

	function replaceLightNums( string, parameters ) {

		return string
			.replace( /NUM_DIR_LIGHTS/g, parameters.numDirLights )
			.replace( /NUM_SPOT_LIGHTS/g, parameters.numSpotLights )
			.replace( /NUM_POINT_LIGHTS/g, parameters.numPointLights )
			.replace( /NUM_HEMI_LIGHTS/g, parameters.numHemiLights );

	}

	function parseIncludes( string ) {

		var pattern = /#include +<([\w\d.]+)>/g;

		function replace( match, include ) {

			var replace = THREE.ShaderChunk[ include ];

			if ( replace === undefined ) {

				throw new Error( 'Can not resolve #include <' + include + '>' );

			}

			return parseIncludes( replace );

		}

		return string.replace( pattern, replace );

	}

	function unrollLoops( string ) {

		var pattern = /for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;

		function replace( match, start, end, snippet ) {

			var unroll = '';

			for ( var i = parseInt( start ); i < parseInt( end ); i ++ ) {

				unroll += snippet.replace( /\[ i \]/g, '[ ' + i + ' ]' );

			}

			return unroll;

		}

		return string.replace( pattern, replace );

	}

	return function WebGLProgram( renderer, code, material, parameters ) {

		var gl = renderer.context;

		var extensions = material.extensions;
		var defines = material.defines;

		var vertexShader = material.__webglShader.vertexShader;
		var fragmentShader = material.__webglShader.fragmentShader;

		var shadowMapTypeDefine = 'SHADOWMAP_TYPE_BASIC';

		if ( parameters.shadowMapType === THREE.PCFShadowMap ) {

			shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF';

		} else if ( parameters.shadowMapType === THREE.PCFSoftShadowMap ) {

			shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF_SOFT';

		}

		var envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
		var envMapModeDefine = 'ENVMAP_MODE_REFLECTION';
		var envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';

		if ( parameters.envMap ) {

			switch ( material.envMap.mapping ) {

				case THREE.CubeReflectionMapping:
				case THREE.CubeRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
					break;

				case THREE.CubeUVReflectionMapping:
				case THREE.CubeUVRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_CUBE_UV';
					break;

				case THREE.EquirectangularReflectionMapping:
				case THREE.EquirectangularRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_EQUIREC';
					break;

				case THREE.SphericalReflectionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_SPHERE';
					break;

			}

			switch ( material.envMap.mapping ) {

				case THREE.CubeRefractionMapping:
				case THREE.EquirectangularRefractionMapping:
					envMapModeDefine = 'ENVMAP_MODE_REFRACTION';
					break;

			}

			switch ( material.combine ) {

				case THREE.MultiplyOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
					break;

				case THREE.MixOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_MIX';
					break;

				case THREE.AddOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_ADD';
					break;

			}

		}

		var gammaFactorDefine = ( renderer.gammaFactor > 0 ) ? renderer.gammaFactor : 1.0;

		// console.log( 'building new program ' );

		//

		var customExtensions = generateExtensions( extensions, parameters, renderer.extensions );

		var customDefines = generateDefines( defines );

		//

		var program = gl.createProgram();

		var prefixVertex, prefixFragment;

		if ( material instanceof THREE.RawShaderMaterial ) {

			prefixVertex = '';
			prefixFragment = '';

		} else {

			prefixVertex = [

				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',

				'#define SHADER_NAME ' + material.__webglShader.name,

				customDefines,

				parameters.supportsVertexTextures ? '#define VERTEX_TEXTURES' : '',

				'#define GAMMA_FACTOR ' + gammaFactorDefine,

				'#define MAX_BONES ' + parameters.maxBones,

				parameters.map ? '#define USE_MAP' : '',
				parameters.envMap ? '#define USE_ENVMAP' : '',
				parameters.envMap ? '#define ' + envMapModeDefine : '',
				parameters.lightMap ? '#define USE_LIGHTMAP' : '',
				parameters.aoMap ? '#define USE_AOMAP' : '',
				parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
				parameters.bumpMap ? '#define USE_BUMPMAP' : '',
				parameters.normalMap ? '#define USE_NORMALMAP' : '',
				parameters.displacementMap && parameters.supportsVertexTextures ? '#define USE_DISPLACEMENTMAP' : '',
				parameters.specularMap ? '#define USE_SPECULARMAP' : '',
				parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
				parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
				parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
				parameters.vertexColors ? '#define USE_COLOR' : '',

				parameters.flatShading ? '#define FLAT_SHADED' : '',

				parameters.skinning ? '#define USE_SKINNING' : '',
				parameters.useVertexTexture ? '#define BONE_TEXTURE' : '',

				parameters.morphTargets ? '#define USE_MORPHTARGETS' : '',
				parameters.morphNormals && parameters.flatShading === false ? '#define USE_MORPHNORMALS' : '',
				parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
				parameters.flipSided ? '#define FLIP_SIDED' : '',

				'#define NUM_CLIPPING_PLANES ' + parameters.numClippingPlanes,

				parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
				parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',

				parameters.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',

				parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
				parameters.logarithmicDepthBuffer && renderer.extensions.get( 'EXT_frag_depth' ) ? '#define USE_LOGDEPTHBUF_EXT' : '',

				'uniform mat4 modelMatrix;',
				'uniform mat4 modelViewMatrix;',
				'uniform mat4 projectionMatrix;',
				'uniform mat4 viewMatrix;',
				'uniform mat3 normalMatrix;',
				'uniform vec3 cameraPosition;',

				'attribute vec3 position;',
				'attribute vec3 normal;',
				'attribute vec2 uv;',

				'#ifdef USE_COLOR',

				'	attribute vec3 color;',

				'#endif',

				'#ifdef USE_MORPHTARGETS',

				'	attribute vec3 morphTarget0;',
				'	attribute vec3 morphTarget1;',
				'	attribute vec3 morphTarget2;',
				'	attribute vec3 morphTarget3;',

				'	#ifdef USE_MORPHNORMALS',

				'		attribute vec3 morphNormal0;',
				'		attribute vec3 morphNormal1;',
				'		attribute vec3 morphNormal2;',
				'		attribute vec3 morphNormal3;',

				'	#else',

				'		attribute vec3 morphTarget4;',
				'		attribute vec3 morphTarget5;',
				'		attribute vec3 morphTarget6;',
				'		attribute vec3 morphTarget7;',

				'	#endif',

				'#endif',

				'#ifdef USE_SKINNING',

				'	attribute vec4 skinIndex;',
				'	attribute vec4 skinWeight;',

				'#endif',

				'\n'

			].filter( filterEmptyLine ).join( '\n' );

			prefixFragment = [

				customExtensions,

				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',

				'#define SHADER_NAME ' + material.__webglShader.name,

				customDefines,

				parameters.alphaTest ? '#define ALPHATEST ' + parameters.alphaTest : '',

				'#define GAMMA_FACTOR ' + gammaFactorDefine,

				( parameters.useFog && parameters.fog ) ? '#define USE_FOG' : '',
				( parameters.useFog && parameters.fogExp ) ? '#define FOG_EXP2' : '',

				parameters.map ? '#define USE_MAP' : '',
				parameters.envMap ? '#define USE_ENVMAP' : '',
				parameters.envMap ? '#define ' + envMapTypeDefine : '',
				parameters.envMap ? '#define ' + envMapModeDefine : '',
				parameters.envMap ? '#define ' + envMapBlendingDefine : '',
				parameters.lightMap ? '#define USE_LIGHTMAP' : '',
				parameters.aoMap ? '#define USE_AOMAP' : '',
				parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
				parameters.bumpMap ? '#define USE_BUMPMAP' : '',
				parameters.normalMap ? '#define USE_NORMALMAP' : '',
				parameters.specularMap ? '#define USE_SPECULARMAP' : '',
				parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
				parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
				parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
				parameters.vertexColors ? '#define USE_COLOR' : '',

				parameters.flatShading ? '#define FLAT_SHADED' : '',

				parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
				parameters.flipSided ? '#define FLIP_SIDED' : '',

				'#define NUM_CLIPPING_PLANES ' + parameters.numClippingPlanes,

				parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
				parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',

				parameters.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : '',

				parameters.physicallyCorrectLights ? "#define PHYSICALLY_CORRECT_LIGHTS" : '',

				parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
				parameters.logarithmicDepthBuffer && renderer.extensions.get( 'EXT_frag_depth' ) ? '#define USE_LOGDEPTHBUF_EXT' : '',

				parameters.envMap && renderer.extensions.get( 'EXT_shader_texture_lod' ) ? '#define TEXTURE_LOD_EXT' : '',

				'uniform mat4 viewMatrix;',
				'uniform vec3 cameraPosition;',

				( parameters.toneMapping !== THREE.NoToneMapping ) ? "#define TONE_MAPPING" : '',
				( parameters.toneMapping !== THREE.NoToneMapping ) ? THREE.ShaderChunk[ 'tonemapping_pars_fragment' ] : '',  // this code is required here because it is used by the toneMapping() function defined below
				( parameters.toneMapping !== THREE.NoToneMapping ) ? getToneMappingFunction( "toneMapping", parameters.toneMapping ) : '',

				( parameters.outputEncoding || parameters.mapEncoding || parameters.envMapEncoding || parameters.emissiveMapEncoding ) ? THREE.ShaderChunk[ 'encodings_pars_fragment' ] : '', // this code is required here because it is used by the various encoding/decoding function defined below
				parameters.mapEncoding ? getTexelDecodingFunction( 'mapTexelToLinear', parameters.mapEncoding ) : '',
				parameters.envMapEncoding ? getTexelDecodingFunction( 'envMapTexelToLinear', parameters.envMapEncoding ) : '',
				parameters.emissiveMapEncoding ? getTexelDecodingFunction( 'emissiveMapTexelToLinear', parameters.emissiveMapEncoding ) : '',
				parameters.outputEncoding ? getTexelEncodingFunction( "linearToOutputTexel", parameters.outputEncoding ) : '',

				parameters.depthPacking ? "#define DEPTH_PACKING " + material.depthPacking : '',

				'\n'

			].filter( filterEmptyLine ).join( '\n' );

		}

		vertexShader = parseIncludes( vertexShader, parameters );
		vertexShader = replaceLightNums( vertexShader, parameters );

		fragmentShader = parseIncludes( fragmentShader, parameters );
		fragmentShader = replaceLightNums( fragmentShader, parameters );

		if ( material instanceof THREE.ShaderMaterial === false ) {

			vertexShader = unrollLoops( vertexShader );
			fragmentShader = unrollLoops( fragmentShader );

		}

		var vertexGlsl = prefixVertex + vertexShader;
		var fragmentGlsl = prefixFragment + fragmentShader;

		// console.log( '*VERTEX*', vertexGlsl );
		// console.log( '*FRAGMENT*', fragmentGlsl );

		var glVertexShader = THREE.WebGLShader( gl, gl.VERTEX_SHADER, vertexGlsl );
		var glFragmentShader = THREE.WebGLShader( gl, gl.FRAGMENT_SHADER, fragmentGlsl );

		gl.attachShader( program, glVertexShader );
		gl.attachShader( program, glFragmentShader );

		// Force a particular attribute to index 0.

		if ( material.index0AttributeName !== undefined ) {

			gl.bindAttribLocation( program, 0, material.index0AttributeName );

		} else if ( parameters.morphTargets === true ) {

			// programs with morphTargets displace position out of attribute 0
			gl.bindAttribLocation( program, 0, 'position' );

		}

		gl.linkProgram( program );

		var programLog = gl.getProgramInfoLog( program );
		var vertexLog = gl.getShaderInfoLog( glVertexShader );
		var fragmentLog = gl.getShaderInfoLog( glFragmentShader );

		var runnable = true;
		var haveDiagnostics = true;

		// console.log( '**VERTEX**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glVertexShader ) );
		// console.log( '**FRAGMENT**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glFragmentShader ) );

		if ( gl.getProgramParameter( program, gl.LINK_STATUS ) === false ) {

			runnable = false;

			console.error( 'THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter( program, gl.VALIDATE_STATUS ), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog );

		} else if ( programLog !== '' ) {

			console.warn( 'THREE.WebGLProgram: gl.getProgramInfoLog()', programLog );

		} else if ( vertexLog === '' || fragmentLog === '' ) {

			haveDiagnostics = false;

		}

		if ( haveDiagnostics ) {

			this.diagnostics = {

				runnable: runnable,
				material: material,

				programLog: programLog,

				vertexShader: {

					log: vertexLog,
					prefix: prefixVertex

				},

				fragmentShader: {

					log: fragmentLog,
					prefix: prefixFragment

				}

			};

		}

		// clean up

		gl.deleteShader( glVertexShader );
		gl.deleteShader( glFragmentShader );

		// set up caching for uniform locations

		var cachedUniforms;

		this.getUniforms = function() {

			if ( cachedUniforms === undefined ) {

				cachedUniforms =
						new THREE.WebGLUniforms( gl, program, renderer );

			}

			return cachedUniforms;

		};

		// set up caching for attribute locations

		var cachedAttributes;

		this.getAttributes = function() {

			if ( cachedAttributes === undefined ) {

				cachedAttributes = fetchAttributeLocations( gl, program );

			}

			return cachedAttributes;

		};

		// free resource

		this.destroy = function() {

			gl.deleteProgram( program );
			this.program = undefined;

		};

		// DEPRECATED

		Object.defineProperties( this, {

			uniforms: {
				get: function() {

					console.warn( 'THREE.WebGLProgram: .uniforms is now .getUniforms().' );
					return this.getUniforms();

				}
			},

			attributes: {
				get: function() {

					console.warn( 'THREE.WebGLProgram: .attributes is now .getAttributes().' );
					return this.getAttributes();

				}
			}

		} );


		//

		this.id = programIdCount ++;
		this.code = code;
		this.usedTimes = 1;
		this.program = program;
		this.vertexShader = glVertexShader;
		this.fragmentShader = glFragmentShader;

		return this;

	};

} )();

// File:src/renderers/webgl/WebGLPrograms.js

THREE.WebGLPrograms = function ( renderer, capabilities ) {

	var programs = [];

	var shaderIDs = {
		MeshDepthMaterial: 'depth',
		MeshNormalMaterial: 'normal',
		MeshBasicMaterial: 'basic',
		MeshLambertMaterial: 'lambert',
		MeshPhongMaterial: 'phong',
		MeshStandardMaterial: 'physical',
		MeshPhysicalMaterial: 'physical',
		LineBasicMaterial: 'basic',
		LineDashedMaterial: 'dashed',
		PointsMaterial: 'points'
	};

	var parameterNames = [
		"precision", "supportsVertexTextures", "map", "mapEncoding", "envMap", "envMapMode", "envMapEncoding",
		"lightMap", "aoMap", "emissiveMap", "emissiveMapEncoding", "bumpMap", "normalMap", "displacementMap", "specularMap",
		"roughnessMap", "metalnessMap",
		"alphaMap", "combine", "vertexColors", "fog", "useFog", "fogExp",
		"flatShading", "sizeAttenuation", "logarithmicDepthBuffer", "skinning",
		"maxBones", "useVertexTexture", "morphTargets", "morphNormals",
		"maxMorphTargets", "maxMorphNormals", "premultipliedAlpha",
		"numDirLights", "numPointLights", "numSpotLights", "numHemiLights",
		"shadowMapEnabled", "shadowMapType", "toneMapping", 'physicallyCorrectLights',
		"alphaTest", "doubleSided", "flipSided", "numClippingPlanes", "depthPacking"
	];


	function allocateBones ( object ) {

		if ( capabilities.floatVertexTextures && object && object.skeleton && object.skeleton.useVertexTexture ) {

			return 1024;

		} else {

			// default for when object is not specified
			// ( for example when prebuilding shader to be used with multiple objects )
			//
			//  - leave some extra space for other uniforms
			//  - limit here is ANGLE's 254 max uniform vectors
			//    (up to 54 should be safe)

			var nVertexUniforms = capabilities.maxVertexUniforms;
			var nVertexMatrices = Math.floor( ( nVertexUniforms - 20 ) / 4 );

			var maxBones = nVertexMatrices;

			if ( object !== undefined && object instanceof THREE.SkinnedMesh ) {

				maxBones = Math.min( object.skeleton.bones.length, maxBones );

				if ( maxBones < object.skeleton.bones.length ) {

					console.warn( 'WebGLRenderer: too many bones - ' + object.skeleton.bones.length + ', this GPU supports just ' + maxBones + ' (try OpenGL instead of ANGLE)' );

				}

			}

			return maxBones;

		}

	}

	function getTextureEncodingFromMap( map, gammaOverrideLinear ) {

		var encoding;

		if ( ! map ) {

			encoding = THREE.LinearEncoding;

		} else if ( map instanceof THREE.Texture ) {

			encoding = map.encoding;

		} else if ( map instanceof THREE.WebGLRenderTarget ) {

			console.warn( "THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead." );
			encoding = map.texture.encoding;

		}

		// add backwards compatibility for WebGLRenderer.gammaInput/gammaOutput parameter, should probably be removed at some point.
		if ( encoding === THREE.LinearEncoding && gammaOverrideLinear ) {

			encoding = THREE.GammaEncoding;

		}

		return encoding;

	}

	this.getParameters = function ( material, lights, fog, nClipPlanes, object ) {

		var shaderID = shaderIDs[ material.type ];

		// heuristics to create shader parameters according to lights in the scene
		// (not to blow over maxLights budget)

		var maxBones = allocateBones( object );
		var precision = renderer.getPrecision();

		if ( material.precision !== null ) {

			precision = capabilities.getMaxPrecision( material.precision );

			if ( precision !== material.precision ) {

				console.warn( 'THREE.WebGLProgram.getParameters:', material.precision, 'not supported, using', precision, 'instead.' );

			}

		}

		var currentRenderTarget = renderer.getCurrentRenderTarget();

		var parameters = {

			shaderID: shaderID,

			precision: precision,
			supportsVertexTextures: capabilities.vertexTextures,
			outputEncoding: getTextureEncodingFromMap( ( ! currentRenderTarget ) ? null : currentRenderTarget.texture, renderer.gammaOutput ),
			map: !! material.map,
			mapEncoding: getTextureEncodingFromMap( material.map, renderer.gammaInput ),
			envMap: !! material.envMap,
			envMapMode: material.envMap && material.envMap.mapping,
			envMapEncoding: getTextureEncodingFromMap( material.envMap, renderer.gammaInput ),
			envMapCubeUV: ( !! material.envMap ) && ( ( material.envMap.mapping === THREE.CubeUVReflectionMapping ) || ( material.envMap.mapping === THREE.CubeUVRefractionMapping ) ),
			lightMap: !! material.lightMap,
			aoMap: !! material.aoMap,
			emissiveMap: !! material.emissiveMap,
			emissiveMapEncoding: getTextureEncodingFromMap( material.emissiveMap, renderer.gammaInput ),
			bumpMap: !! material.bumpMap,
			normalMap: !! material.normalMap,
			displacementMap: !! material.displacementMap,
			roughnessMap: !! material.roughnessMap,
			metalnessMap: !! material.metalnessMap,
			specularMap: !! material.specularMap,
			alphaMap: !! material.alphaMap,

			combine: material.combine,

			vertexColors: material.vertexColors,

			fog: fog,
			useFog: material.fog,
			fogExp: fog instanceof THREE.FogExp2,

			flatShading: material.shading === THREE.FlatShading,

			sizeAttenuation: material.sizeAttenuation,
			logarithmicDepthBuffer: capabilities.logarithmicDepthBuffer,

			skinning: material.skinning,
			maxBones: maxBones,
			useVertexTexture: capabilities.floatVertexTextures && object && object.skeleton && object.skeleton.useVertexTexture,

			morphTargets: material.morphTargets,
			morphNormals: material.morphNormals,
			maxMorphTargets: renderer.maxMorphTargets,
			maxMorphNormals: renderer.maxMorphNormals,

			numDirLights: lights.directional.length,
			numPointLights: lights.point.length,
			numSpotLights: lights.spot.length,
			numHemiLights: lights.hemi.length,

			numClippingPlanes: nClipPlanes,

			shadowMapEnabled: renderer.shadowMap.enabled && object.receiveShadow && lights.shadows.length > 0,
			shadowMapType: renderer.shadowMap.type,

			toneMapping: renderer.toneMapping,
			physicallyCorrectLights: renderer.physicallyCorrectLights,

			premultipliedAlpha: material.premultipliedAlpha,

			alphaTest: material.alphaTest,
			doubleSided: material.side === THREE.DoubleSide,
			flipSided: material.side === THREE.BackSide,

			depthPacking: ( material.depthPacking !== undefined ) ? material.depthPacking : false

		};

		return parameters;

	};

	this.getProgramCode = function ( material, parameters ) {

		var array = [];

		if ( parameters.shaderID ) {

			array.push( parameters.shaderID );

		} else {

			array.push( material.fragmentShader );
			array.push( material.vertexShader );

		}

		if ( material.defines !== undefined ) {

			for ( var name in material.defines ) {

				array.push( name );
				array.push( material.defines[ name ] );

			}

		}

		for ( var i = 0; i < parameterNames.length; i ++ ) {

			array.push( parameters[ parameterNames[ i ] ] );

		}

		return array.join();

	};

	this.acquireProgram = function ( material, parameters, code ) {

		var program;

		// Check if code has been already compiled
		for ( var p = 0, pl = programs.length; p < pl; p ++ ) {

			var programInfo = programs[ p ];

			if ( programInfo.code === code ) {

				program = programInfo;
				++ program.usedTimes;

				break;

			}

		}

		if ( program === undefined ) {

			program = new THREE.WebGLProgram( renderer, code, material, parameters );
			programs.push( program );

		}

		return program;

	};

	this.releaseProgram = function( program ) {

		if ( -- program.usedTimes === 0 ) {

			// Remove from unordered set
			var i = programs.indexOf( program );
			programs[ i ] = programs[ programs.length - 1 ];
			programs.pop();

			// Free WebGL resources
			program.destroy();

		}

	};

	// Exposed for resource monitoring & error feedback via renderer.info:
	this.programs = programs;

};

// File:src/renderers/webgl/WebGLProperties.js

/**
* @author fordacious / fordacious.github.io
*/

THREE.WebGLProperties = function () {

	var properties = {};

	this.get = function ( object ) {

		var uuid = object.uuid;
		var map = properties[ uuid ];

		if ( map === undefined ) {

			map = {};
			properties[ uuid ] = map;

		}

		return map;

	};

	this.delete = function ( object ) {

		delete properties[ object.uuid ];

	};

	this.clear = function () {

		properties = {};

	};

};

// File:src/renderers/webgl/WebGLShader.js

THREE.WebGLShader = ( function () {

	function addLineNumbers( string ) {

		var lines = string.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

		}

		return lines.join( '\n' );

	}

	return function WebGLShader( gl, type, string ) {

		var shader = gl.createShader( type );

		gl.shaderSource( shader, string );
		gl.compileShader( shader );

		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {

			console.error( 'THREE.WebGLShader: Shader couldn\'t compile.' );

		}

		if ( gl.getShaderInfoLog( shader ) !== '' ) {

			console.warn( 'THREE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog( shader ), addLineNumbers( string ) );

		}

		// --enable-privileged-webgl-extension
		// console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

		return shader;

	};

} )();

// File:src/renderers/webgl/WebGLShadowMap.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.WebGLShadowMap = function ( _renderer, _lights, _objects ) {

	var _gl = _renderer.context,
	_state = _renderer.state,
	_frustum = new THREE.Frustum(),
	_projScreenMatrix = new THREE.Matrix4(),

	_lightShadows = _lights.shadows,

	_shadowMapSize = new THREE.Vector2(),

	_lookTarget = new THREE.Vector3(),
	_lightPositionWorld = new THREE.Vector3(),

	_renderList = [],

	_MorphingFlag = 1,
	_SkinningFlag = 2,

	_NumberOfMaterialVariants = ( _MorphingFlag | _SkinningFlag ) + 1,

	_depthMaterials = new Array( _NumberOfMaterialVariants ),
	_distanceMaterials = new Array( _NumberOfMaterialVariants ),

	_materialCache = {};

	var cubeDirections = [
		new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( - 1, 0, 0 ), new THREE.Vector3( 0, 0, 1 ),
		new THREE.Vector3( 0, 0, - 1 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, - 1, 0 )
	];

	var cubeUps = [
		new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 1, 0 ),
		new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ),	new THREE.Vector3( 0, 0, - 1 )
	];

	var cube2DViewPorts = [
		new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(),
		new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()
	];

	// init

	var depthMaterialTemplate = new THREE.MeshDepthMaterial();
	depthMaterialTemplate.depthPacking = THREE.RGBADepthPacking;
	depthMaterialTemplate.clipping = true;

	var distanceShader = THREE.ShaderLib[ "distanceRGBA" ];
	var distanceUniforms = THREE.UniformsUtils.clone( distanceShader.uniforms );

	for ( var i = 0; i !== _NumberOfMaterialVariants; ++ i ) {

		var useMorphing = ( i & _MorphingFlag ) !== 0;
		var useSkinning = ( i & _SkinningFlag ) !== 0;

		var depthMaterial = depthMaterialTemplate.clone();
		depthMaterial.morphTargets = useMorphing;
		depthMaterial.skinning = useSkinning;

		_depthMaterials[ i ] = depthMaterial;

		var distanceMaterial = new THREE.ShaderMaterial( {
			defines: {
				'USE_SHADOWMAP': ''
			},
			uniforms: distanceUniforms,
			vertexShader: distanceShader.vertexShader,
			fragmentShader: distanceShader.fragmentShader,
			morphTargets: useMorphing,
			skinning: useSkinning,
			clipping: true
		} );

		_distanceMaterials[ i ] = distanceMaterial;

	}

	//

	var scope = this;

	this.enabled = false;

	this.autoUpdate = true;
	this.needsUpdate = false;

	this.type = THREE.PCFShadowMap;

	this.renderReverseSided = true;
	this.renderSingleSided = true;

	this.render = function ( scene, camera ) {

		if ( scope.enabled === false ) return;
		if ( scope.autoUpdate === false && scope.needsUpdate === false ) return;

		if ( _lightShadows.length === 0 ) return;

		// Set GL state for depth map.
		_state.clearColor( 1, 1, 1, 1 );
		_state.disable( _gl.BLEND );
		_state.setDepthTest( true );
		_state.setScissorTest( false );

		// render depth map

		var faceCount, isPointLight;

		for ( var i = 0, il = _lightShadows.length; i < il; i ++ ) {

			var light = _lightShadows[ i ];
			var shadow = light.shadow;

			if ( shadow === undefined ) {

				console.warn( 'THREE.WebGLShadowMap:', light, 'has no shadow.' );
				continue;

			}

			var shadowCamera = shadow.camera;

			_shadowMapSize.copy( shadow.mapSize );

			if ( light instanceof THREE.PointLight ) {

				faceCount = 6;
				isPointLight = true;

				var vpWidth = _shadowMapSize.x;
				var vpHeight = _shadowMapSize.y;

				// These viewports map a cube-map onto a 2D texture with the
				// following orientation:
				//
				//  xzXZ
				//   y Y
				//
				// X - Positive x direction
				// x - Negative x direction
				// Y - Positive y direction
				// y - Negative y direction
				// Z - Positive z direction
				// z - Negative z direction

				// positive X
				cube2DViewPorts[ 0 ].set( vpWidth * 2, vpHeight, vpWidth, vpHeight );
				// negative X
				cube2DViewPorts[ 1 ].set( 0, vpHeight, vpWidth, vpHeight );
				// positive Z
				cube2DViewPorts[ 2 ].set( vpWidth * 3, vpHeight, vpWidth, vpHeight );
				// negative Z
				cube2DViewPorts[ 3 ].set( vpWidth, vpHeight, vpWidth, vpHeight );
				// positive Y
				cube2DViewPorts[ 4 ].set( vpWidth * 3, 0, vpWidth, vpHeight );
				// negative Y
				cube2DViewPorts[ 5 ].set( vpWidth, 0, vpWidth, vpHeight );

				_shadowMapSize.x *= 4.0;
				_shadowMapSize.y *= 2.0;

			} else {

				faceCount = 1;
				isPointLight = false;

			}

			if ( shadow.map === null ) {

				var pars = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };

				shadow.map = new THREE.WebGLRenderTarget( _shadowMapSize.x, _shadowMapSize.y, pars );

				shadowCamera.updateProjectionMatrix();

			}

			if ( shadow instanceof THREE.SpotLightShadow ) {

				shadow.update( light );

			}

			var shadowMap = shadow.map;
			var shadowMatrix = shadow.matrix;

			_lightPositionWorld.setFromMatrixPosition( light.matrixWorld );
			shadowCamera.position.copy( _lightPositionWorld );

			_renderer.setRenderTarget( shadowMap );
			_renderer.clear();

			// render shadow map for each cube face (if omni-directional) or
			// run a single pass if not

			for ( var face = 0; face < faceCount; face ++ ) {

				if ( isPointLight ) {

					_lookTarget.copy( shadowCamera.position );
					_lookTarget.add( cubeDirections[ face ] );
					shadowCamera.up.copy( cubeUps[ face ] );
					shadowCamera.lookAt( _lookTarget );

					var vpDimensions = cube2DViewPorts[ face ];
					_state.viewport( vpDimensions );

				} else {

					_lookTarget.setFromMatrixPosition( light.target.matrixWorld );
					shadowCamera.lookAt( _lookTarget );

				}

				shadowCamera.updateMatrixWorld();
				shadowCamera.matrixWorldInverse.getInverse( shadowCamera.matrixWorld );

				// compute shadow matrix

				shadowMatrix.set(
					0.5, 0.0, 0.0, 0.5,
					0.0, 0.5, 0.0, 0.5,
					0.0, 0.0, 0.5, 0.5,
					0.0, 0.0, 0.0, 1.0
				);

				shadowMatrix.multiply( shadowCamera.projectionMatrix );
				shadowMatrix.multiply( shadowCamera.matrixWorldInverse );

				// update camera matrices and frustum

				_projScreenMatrix.multiplyMatrices( shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse );
				_frustum.setFromMatrix( _projScreenMatrix );

				// set object matrices & frustum culling

				_renderList.length = 0;

				projectObject( scene, camera, shadowCamera );

				// render shadow map
				// render regular objects

				for ( var j = 0, jl = _renderList.length; j < jl; j ++ ) {

					var object = _renderList[ j ];
					var geometry = _objects.update( object );
					var material = object.material;

					if ( material instanceof THREE.MultiMaterial ) {

						var groups = geometry.groups;
						var materials = material.materials;

						for ( var k = 0, kl = groups.length; k < kl; k ++ ) {

							var group = groups[ k ];
							var groupMaterial = materials[ group.materialIndex ];

							if ( groupMaterial.visible === true ) {

								var depthMaterial = getDepthMaterial( object, groupMaterial, isPointLight, _lightPositionWorld );
								_renderer.renderBufferDirect( shadowCamera, null, geometry, depthMaterial, object, group );

							}

						}

					} else {

						var depthMaterial = getDepthMaterial( object, material, isPointLight, _lightPositionWorld );
						_renderer.renderBufferDirect( shadowCamera, null, geometry, depthMaterial, object, null );

					}

				}

			}

		}

		// Restore GL state.
		var clearColor = _renderer.getClearColor(),
		clearAlpha = _renderer.getClearAlpha();
		_renderer.setClearColor( clearColor, clearAlpha );

		scope.needsUpdate = false;

	};

	function getDepthMaterial( object, material, isPointLight, lightPositionWorld ) {

		var geometry = object.geometry;

		var result = null;

		var materialVariants = _depthMaterials;
		var customMaterial = object.customDepthMaterial;

		if ( isPointLight ) {

			materialVariants = _distanceMaterials;
			customMaterial = object.customDistanceMaterial;

		}

		if ( ! customMaterial ) {

			var useMorphing = geometry.morphTargets !== undefined &&
					geometry.morphTargets.length > 0 && material.morphTargets;

			var useSkinning = object instanceof THREE.SkinnedMesh && material.skinning;

			var variantIndex = 0;

			if ( useMorphing ) variantIndex |= _MorphingFlag;
			if ( useSkinning ) variantIndex |= _SkinningFlag;

			result = materialVariants[ variantIndex ];

		} else {

			result = customMaterial;

		}

		if ( _renderer.localClippingEnabled &&
			 material.clipShadows === true &&
				material.clippingPlanes.length !== 0 ) {

			// in this case we need a unique material instance reflecting the
			// appropriate state

			var keyA = result.uuid, keyB = material.uuid;

			var materialsForVariant = _materialCache[ keyA ];

			if ( materialsForVariant === undefined ) {

				materialsForVariant = {};
				_materialCache[ keyA ] = materialsForVariant;

			}

			var cachedMaterial = materialsForVariant[ keyB ];

			if ( cachedMaterial === undefined ) {

				cachedMaterial = result.clone();
				materialsForVariant[ keyB ] = cachedMaterial;

			}

			result = cachedMaterial;

		}

		result.visible = material.visible;
		result.wireframe = material.wireframe;

		var side = material.side;

		if ( scope.renderSingleSided && side == THREE.DoubleSide ) {

			side = THREE.FrontSide;

		}

		if ( scope.renderReverseSided ) {

			if ( side === THREE.FrontSide ) side = THREE.BackSide;
			else if ( side === THREE.BackSide ) side = THREE.FrontSide;

		}

		result.side = side;

		result.clipShadows = material.clipShadows;
		result.clippingPlanes = material.clippingPlanes;

		result.wireframeLinewidth = material.wireframeLinewidth;
		result.linewidth = material.linewidth;

		if ( isPointLight && result.uniforms.lightPos !== undefined ) {

			result.uniforms.lightPos.value.copy( lightPositionWorld );

		}

		return result;

	}

	function projectObject( object, camera, shadowCamera ) {

		if ( object.visible === false ) return;

		if ( object.layers.test( camera.layers ) && ( object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points ) ) {

			if ( object.castShadow && ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) ) {

				var material = object.material;

				if ( material.visible === true ) {

					object.modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );
					_renderList.push( object );

				}

			}

		}

		var children = object.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			projectObject( children[ i ], camera, shadowCamera );

		}

	}

};

// File:src/renderers/webgl/WebGLState.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLState = function ( gl, extensions, paramThreeToGL ) {

	var _this = this;

	this.buffers = {
		color: new THREE.WebGLColorBuffer( gl, this ),
		depth: new THREE.WebGLDepthBuffer( gl, this ),
		stencil: new THREE.WebGLStencilBuffer( gl, this )
	};

	var maxVertexAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );
	var newAttributes = new Uint8Array( maxVertexAttributes );
	var enabledAttributes = new Uint8Array( maxVertexAttributes );
	var attributeDivisors = new Uint8Array( maxVertexAttributes );

	var capabilities = {};

	var compressedTextureFormats = null;

	var currentBlending = null;
	var currentBlendEquation = null;
	var currentBlendSrc = null;
	var currentBlendDst = null;
	var currentBlendEquationAlpha = null;
	var currentBlendSrcAlpha = null;
	var currentBlendDstAlpha = null;
	var currentPremultipledAlpha = false;

	var currentFlipSided = null;
	var currentCullFace = null;

	var currentLineWidth = null;

	var currentPolygonOffsetFactor = null;
	var currentPolygonOffsetUnits = null;

	var currentScissorTest = null;

	var maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );

	var currentTextureSlot = null;
	var currentBoundTextures = {};

	var currentScissor = new THREE.Vector4();
	var currentViewport = new THREE.Vector4();

	function createTexture( type, target, count ) {

		var data = new Uint8Array( 3 );
		var texture = gl.createTexture();

		gl.bindTexture( type, texture );
		gl.texParameteri( type, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		gl.texParameteri( type, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

		for ( var i = 0; i < count; i ++ ) {

			gl.texImage2D( target + i, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, data );

		}

		return texture;

	}

	var emptyTextures = {};
	emptyTextures[ gl.TEXTURE_2D ] = createTexture( gl.TEXTURE_2D, gl.TEXTURE_2D, 1 );
	emptyTextures[ gl.TEXTURE_CUBE_MAP ] = createTexture( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6 );

	//

	this.init = function () {

		this.clearColor( 0, 0, 0, 1 );
		this.clearDepth( 1 );
		this.clearStencil( 0 );

		this.enable( gl.DEPTH_TEST );
		this.setDepthFunc( THREE.LessEqualDepth );

		this.setFlipSided( false );
		this.setCullFace( THREE.CullFaceBack );
		this.enable( gl.CULL_FACE );

		this.enable( gl.BLEND );
		this.setBlending( THREE.NormalBlending );

	};

	this.initAttributes = function () {

		for ( var i = 0, l = newAttributes.length; i < l; i ++ ) {

			newAttributes[ i ] = 0;

		}

	};

	this.enableAttribute = function ( attribute ) {

		newAttributes[ attribute ] = 1;

		if ( enabledAttributes[ attribute ] === 0 ) {

			gl.enableVertexAttribArray( attribute );
			enabledAttributes[ attribute ] = 1;

		}

		if ( attributeDivisors[ attribute ] !== 0 ) {

			var extension = extensions.get( 'ANGLE_instanced_arrays' );

			extension.vertexAttribDivisorANGLE( attribute, 0 );
			attributeDivisors[ attribute ] = 0;

		}

	};

	this.enableAttributeAndDivisor = function ( attribute, meshPerAttribute, extension ) {

		newAttributes[ attribute ] = 1;

		if ( enabledAttributes[ attribute ] === 0 ) {

			gl.enableVertexAttribArray( attribute );
			enabledAttributes[ attribute ] = 1;

		}

		if ( attributeDivisors[ attribute ] !== meshPerAttribute ) {

			extension.vertexAttribDivisorANGLE( attribute, meshPerAttribute );
			attributeDivisors[ attribute ] = meshPerAttribute;

		}

	};

	this.disableUnusedAttributes = function () {

		for ( var i = 0, l = enabledAttributes.length; i !== l; ++ i ) {

			if ( enabledAttributes[ i ] !== newAttributes[ i ] ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

	};

	this.enable = function ( id ) {

		if ( capabilities[ id ] !== true ) {

			gl.enable( id );
			capabilities[ id ] = true;

		}

	};

	this.disable = function ( id ) {

		if ( capabilities[ id ] !== false ) {

			gl.disable( id );
			capabilities[ id ] = false;

		}

	};

	this.getCompressedTextureFormats = function () {

		if ( compressedTextureFormats === null ) {

			compressedTextureFormats = [];

			if ( extensions.get( 'WEBGL_compressed_texture_pvrtc' ) ||
			     extensions.get( 'WEBGL_compressed_texture_s3tc' ) ||
			     extensions.get( 'WEBGL_compressed_texture_etc1' ) ) {

				var formats = gl.getParameter( gl.COMPRESSED_TEXTURE_FORMATS );

				for ( var i = 0; i < formats.length; i ++ ) {

					compressedTextureFormats.push( formats[ i ] );

				}

			}

		}

		return compressedTextureFormats;

	};

	this.setBlending = function ( blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha ) {

		if ( blending !== THREE.NoBlending ) {

			this.enable( gl.BLEND );

		} else {

			this.disable( gl.BLEND );
			currentBlending = blending; // no blending, that is
			return;

		}

		if ( blending !== currentBlending || premultipliedAlpha !== currentPremultipledAlpha ) {

			if ( blending === THREE.AdditiveBlending ) {

				if ( premultipliedAlpha ) {

					gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
					gl.blendFuncSeparate( gl.ONE, gl.ONE, gl.ONE, gl.ONE );

				} else {

					gl.blendEquation( gl.FUNC_ADD );
					gl.blendFunc( gl.SRC_ALPHA, gl.ONE );

				}

			} else if ( blending === THREE.SubtractiveBlending ) {

				if ( premultipliedAlpha ) {

					gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
					gl.blendFuncSeparate( gl.ZERO, gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA );

				} else {

					gl.blendEquation( gl.FUNC_ADD );
					gl.blendFunc( gl.ZERO, gl.ONE_MINUS_SRC_COLOR );

				}

			} else if ( blending === THREE.MultiplyBlending ) {

				if ( premultipliedAlpha ) {

					gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
					gl.blendFuncSeparate( gl.ZERO, gl.SRC_COLOR, gl.ZERO, gl.SRC_ALPHA );

				} else {

					gl.blendEquation( gl.FUNC_ADD );
					gl.blendFunc( gl.ZERO, gl.SRC_COLOR );

				}

			} else {

				if ( premultipliedAlpha ) {

					gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
					gl.blendFuncSeparate( gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );

				} else {

					gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
					gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );

				}

			}

			currentBlending = blending;
			currentPremultipledAlpha = premultipliedAlpha;

		}

		if ( blending === THREE.CustomBlending ) {

			blendEquationAlpha = blendEquationAlpha || blendEquation;
			blendSrcAlpha = blendSrcAlpha || blendSrc;
			blendDstAlpha = blendDstAlpha || blendDst;

			if ( blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha ) {

				gl.blendEquationSeparate( paramThreeToGL( blendEquation ), paramThreeToGL( blendEquationAlpha ) );

				currentBlendEquation = blendEquation;
				currentBlendEquationAlpha = blendEquationAlpha;

			}

			if ( blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha ) {

				gl.blendFuncSeparate( paramThreeToGL( blendSrc ), paramThreeToGL( blendDst ), paramThreeToGL( blendSrcAlpha ), paramThreeToGL( blendDstAlpha ) );

				currentBlendSrc = blendSrc;
				currentBlendDst = blendDst;
				currentBlendSrcAlpha = blendSrcAlpha;
				currentBlendDstAlpha = blendDstAlpha;

			}

		} else {

			currentBlendEquation = null;
			currentBlendSrc = null;
			currentBlendDst = null;
			currentBlendEquationAlpha = null;
			currentBlendSrcAlpha = null;
			currentBlendDstAlpha = null;

		}

	};

	// TODO Deprecate

	this.setColorWrite = function ( colorWrite ) {

		this.buffers.color.setMask( colorWrite );

	};

	this.setDepthTest = function ( depthTest ) {

		this.buffers.depth.setTest( depthTest );

	};

	this.setDepthWrite = function ( depthWrite ) {

		this.buffers.depth.setMask( depthWrite );

	};

	this.setDepthFunc = function ( depthFunc ) {

		this.buffers.depth.setFunc( depthFunc );

	};

	this.setStencilTest = function ( stencilTest ) {

		this.buffers.stencil.setTest( stencilTest );

	};

	this.setStencilWrite = function ( stencilWrite ) {

		this.buffers.stencil.setMask( stencilWrite );

	};

	this.setStencilFunc = function ( stencilFunc, stencilRef, stencilMask ) {

		this.buffers.stencil.setFunc( stencilFunc, stencilRef, stencilMask );

	};

	this.setStencilOp = function ( stencilFail, stencilZFail, stencilZPass ) {

		this.buffers.stencil.setOp( stencilFail, stencilZFail, stencilZPass );

	};

	//

	this.setFlipSided = function ( flipSided ) {

		if ( currentFlipSided !== flipSided ) {

			if ( flipSided ) {

				gl.frontFace( gl.CW );

			} else {

				gl.frontFace( gl.CCW );

			}

			currentFlipSided = flipSided;

		}

	};

	this.setCullFace = function ( cullFace ) {

		if ( cullFace !== THREE.CullFaceNone ) {

			this.enable( gl.CULL_FACE );

			if ( cullFace !== currentCullFace ) {

				if ( cullFace === THREE.CullFaceBack ) {

					gl.cullFace( gl.BACK );

				} else if ( cullFace === THREE.CullFaceFront ) {

					gl.cullFace( gl.FRONT );

				} else {

					gl.cullFace( gl.FRONT_AND_BACK );

				}

			}

		} else {

			this.disable( gl.CULL_FACE );

		}

		currentCullFace = cullFace;

	};

	this.setLineWidth = function ( width ) {

		if ( width !== currentLineWidth ) {

			gl.lineWidth( width );

			currentLineWidth = width;

		}

	};

	this.setPolygonOffset = function ( polygonOffset, factor, units ) {

		if ( polygonOffset ) {

			this.enable( gl.POLYGON_OFFSET_FILL );

			if ( currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units ) {

				gl.polygonOffset( factor, units );

				currentPolygonOffsetFactor = factor;
				currentPolygonOffsetUnits = units;

			}

		} else {

			this.disable( gl.POLYGON_OFFSET_FILL );

		}

	};

	this.getScissorTest = function () {

		return currentScissorTest;

	};

	this.setScissorTest = function ( scissorTest ) {

		currentScissorTest = scissorTest;

		if ( scissorTest ) {

			this.enable( gl.SCISSOR_TEST );

		} else {

			this.disable( gl.SCISSOR_TEST );

		}

	};

	// texture

	this.activeTexture = function ( webglSlot ) {

		if ( webglSlot === undefined ) webglSlot = gl.TEXTURE0 + maxTextures - 1;

		if ( currentTextureSlot !== webglSlot ) {

			gl.activeTexture( webglSlot );
			currentTextureSlot = webglSlot;

		}

	};

	this.bindTexture = function ( webglType, webglTexture ) {

		if ( currentTextureSlot === null ) {

			_this.activeTexture();

		}

		var boundTexture = currentBoundTextures[ currentTextureSlot ];

		if ( boundTexture === undefined ) {

			boundTexture = { type: undefined, texture: undefined };
			currentBoundTextures[ currentTextureSlot ] = boundTexture;

		}

		if ( boundTexture.type !== webglType || boundTexture.texture !== webglTexture ) {

			gl.bindTexture( webglType, webglTexture || emptyTextures[ webglType ] );

			boundTexture.type = webglType;
			boundTexture.texture = webglTexture;

		}

	};

	this.compressedTexImage2D = function () {

		try {

			gl.compressedTexImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( error );

		}

	};

	this.texImage2D = function () {

		try {

			gl.texImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( error );

		}

	};

	// TODO Deprecate

	this.clearColor = function ( r, g, b, a ) {

		this.buffers.color.setClear( r, g, b, a );

	};

	this.clearDepth = function ( depth ) {

		this.buffers.depth.setClear( depth );

	};

	this.clearStencil = function ( stencil ) {

		this.buffers.stencil.setClear( stencil );

	};

	//

	this.scissor = function ( scissor ) {

		if ( currentScissor.equals( scissor ) === false ) {

			gl.scissor( scissor.x, scissor.y, scissor.z, scissor.w );
			currentScissor.copy( scissor );

		}

	};

	this.viewport = function ( viewport ) {

		if ( currentViewport.equals( viewport ) === false ) {

			gl.viewport( viewport.x, viewport.y, viewport.z, viewport.w );
			currentViewport.copy( viewport );

		}

	};

	//

	this.reset = function () {

		for ( var i = 0; i < enabledAttributes.length; i ++ ) {

			if ( enabledAttributes[ i ] === 1 ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

		capabilities = {};

		compressedTextureFormats = null;

		currentTextureSlot = null;
		currentBoundTextures = {};

		currentBlending = null;

		currentFlipSided = null;
		currentCullFace = null;

		this.buffers.color.reset();
		this.buffers.depth.reset();
		this.buffers.stencil.reset();

	};

};

THREE.WebGLColorBuffer = function ( gl, state ) {

	var locked = false;

	var color = new THREE.Vector4();
	var currentColorMask = null;
	var currentColorClear = new THREE.Vector4();

	this.setMask = function ( colorMask ) {

		if ( currentColorMask !== colorMask && ! locked ) {

			gl.colorMask( colorMask, colorMask, colorMask, colorMask );
			currentColorMask = colorMask;

		}

	};

	this.setLocked = function ( lock ) {

		locked = lock;

	};

	this.setClear = function ( r, g, b, a ) {

		color.set( r, g, b, a );

		if ( currentColorClear.equals( color ) === false ) {

			gl.clearColor( r, g, b, a );
			currentColorClear.copy( color );

		}

	};

	this.reset = function () {

		locked = false;

		currentColorMask = null;
		currentColorClear = new THREE.Vector4();

	};

};

THREE.WebGLDepthBuffer = function( gl, state ) {

	var locked = false;

	var currentDepthMask = null;
	var currentDepthFunc = null;
	var currentDepthClear = null;

	this.setTest = function ( depthTest ) {

		if ( depthTest ) {

			state.enable( gl.DEPTH_TEST );

		} else {

			state.disable( gl.DEPTH_TEST );

		}

	};

	this.setMask = function( depthMask ){

		if ( currentDepthMask !== depthMask && ! locked ) {

			gl.depthMask( depthMask );
			currentDepthMask = depthMask;

		}

	};

	this.setFunc = function ( depthFunc ) {

		if ( currentDepthFunc !== depthFunc ) {

			if ( depthFunc ) {

				switch ( depthFunc ) {

					case THREE.NeverDepth:

						gl.depthFunc( gl.NEVER );
						break;

					case THREE.AlwaysDepth:

						gl.depthFunc( gl.ALWAYS );
						break;

					case THREE.LessDepth:

						gl.depthFunc( gl.LESS );
						break;

					case THREE.LessEqualDepth:

						gl.depthFunc( gl.LEQUAL );
						break;

					case THREE.EqualDepth:

						gl.depthFunc( gl.EQUAL );
						break;

					case THREE.GreaterEqualDepth:

						gl.depthFunc( gl.GEQUAL );
						break;

					case THREE.GreaterDepth:

						gl.depthFunc( gl.GREATER );
						break;

					case THREE.NotEqualDepth:

						gl.depthFunc( gl.NOTEQUAL );
						break;

					default:

						gl.depthFunc( gl.LEQUAL );

				}

			} else {

				gl.depthFunc( gl.LEQUAL );

			}

			currentDepthFunc = depthFunc;

		}

	};

	this.setLocked = function ( lock ) {

		locked = lock;

	};

	this.setClear = function ( depth ) {

		if ( currentDepthClear !== depth ) {

			gl.clearDepth( depth );
			currentDepthClear = depth;

		}

	};

	this.reset = function () {

		locked = false;

		currentDepthMask = null;
		currentDepthFunc = null;
		currentDepthClear = null;

	};

};

THREE.WebGLStencilBuffer = function ( gl, state ) {

	var locked = false;

	var currentStencilMask = null;
	var currentStencilFunc = null;
	var currentStencilRef = null;
	var currentStencilFuncMask = null;
	var currentStencilFail  = null;
	var currentStencilZFail = null;
	var currentStencilZPass = null;
	var currentStencilClear = null;

	this.setTest = function ( stencilTest ) {

		if ( stencilTest ) {

			state.enable( gl.STENCIL_TEST );

		} else {

			state.disable( gl.STENCIL_TEST );

		}

	};

	this.setMask = function ( stencilMask ) {

		if ( currentStencilMask !== stencilMask && ! locked ) {

			gl.stencilMask( stencilMask );
			currentStencilMask = stencilMask;

		}

	};

	this.setFunc = function ( stencilFunc, stencilRef, stencilMask ) {

		if ( currentStencilFunc !== stencilFunc ||
		     currentStencilRef 	!== stencilRef 	||
		     currentStencilFuncMask !== stencilMask ) {

			gl.stencilFunc( stencilFunc,  stencilRef, stencilMask );

			currentStencilFunc = stencilFunc;
			currentStencilRef  = stencilRef;
			currentStencilFuncMask = stencilMask;

		}

	};

	this.setOp	 = function ( stencilFail, stencilZFail, stencilZPass ) {

		if ( currentStencilFail	 !== stencilFail 	||
		     currentStencilZFail !== stencilZFail ||
		     currentStencilZPass !== stencilZPass ) {

			gl.stencilOp( stencilFail,  stencilZFail, stencilZPass );

			currentStencilFail  = stencilFail;
			currentStencilZFail = stencilZFail;
			currentStencilZPass = stencilZPass;

		}

	};

	this.setLocked = function ( lock ) {

		locked = lock;

	};

	this.setClear = function ( stencil ) {

		if ( currentStencilClear !== stencil ) {

			gl.clearStencil( stencil );
			currentStencilClear = stencil;

		}

	};

	this.reset = function () {

		locked = false;

		currentStencilMask = null;
		currentStencilFunc = null;
		currentStencilRef = null;
		currentStencilFuncMask = null;
		currentStencilFail = null;
		currentStencilZFail = null;
		currentStencilZPass = null;
		currentStencilClear = null;

	};

};

// File:src/renderers/webgl/WebGLUniforms.js

/**
 *
 * Uniforms of a program.
 * Those form a tree structure with a special top-level container for the root,
 * which you get by calling 'new WebGLUniforms( gl, program, renderer )'.
 *
 *
 * Properties of inner nodes including the top-level container:
 *
 * .seq - array of nested uniforms
 * .map - nested uniforms by name
 *
 *
 * Methods of all nodes except the top-level container:
 *
 * .setValue( gl, value, [renderer] )
 *
 * 		uploads a uniform value(s)
 *  	the 'renderer' parameter is needed for sampler uniforms
 *
 *
 * Static methods of the top-level container (renderer factorizations):
 *
 * .upload( gl, seq, values, renderer )
 *
 * 		sets uniforms in 'seq' to 'values[id].value'
 *
 * .seqWithValue( seq, values ) : filteredSeq
 *
 * 		filters 'seq' entries with corresponding entry in values
 *
 * .splitDynamic( seq, values ) : filteredSeq
 *
 * 		filters 'seq' entries with dynamic entry and removes them from 'seq'
 *
 *
 * Methods of the top-level container (renderer factorizations):
 *
 * .setValue( gl, name, value )
 *
 * 		sets uniform with  name 'name' to 'value'
 *
 * .set( gl, obj, prop )
 *
 * 		sets uniform from object and property with same name than uniform
 *
 * .setOptional( gl, obj, prop )
 *
 * 		like .set for an optional property of the object
 *
 *
 * @author tschw
 *
 */

THREE.WebGLUniforms = ( function() { // scope

	// --- Base for inner nodes (including the root) ---

	var UniformContainer = function() {

			this.seq = [];
			this.map = {};

		},

	// --- Utilities ---

	// Array Caches (provide typed arrays for temporary by size)

		arrayCacheF32 = [],
		arrayCacheI32 = [],

		uncacheTemporaryArrays = function() {

			arrayCacheF32.length = 0;
			arrayCacheI32.length = 0;

		},

	// Flattening for arrays of vectors and matrices

		flatten = function( array, nBlocks, blockSize ) {

			var firstElem = array[ 0 ];

			if ( firstElem <= 0 || firstElem > 0 ) return array;
			// unoptimized: ! isNaN( firstElem )
			// see http://jacksondunstan.com/articles/983

			var n = nBlocks * blockSize,
				r = arrayCacheF32[ n ];

			if ( r === undefined ) {

				r = new Float32Array( n );
				arrayCacheF32[ n ] = r;

			}

			if ( nBlocks !== 0 ) {

				firstElem.toArray( r, 0 );

				for ( var i = 1, offset = 0; i !== nBlocks; ++ i ) {

					offset += blockSize;
					array[ i ].toArray( r, offset );

				}

			}

			return r;

		},

	// Texture unit allocation

		allocTexUnits = function( renderer, n ) {

			var r = arrayCacheI32[ n ];

			if ( r === undefined ) {

				r = new Int32Array( n );
				arrayCacheI32[ n ] = r;

			}

			for ( var i = 0; i !== n; ++ i )
				r[ i ] = renderer.allocTextureUnit();

			return r;

		},

	// --- Setters ---

	// Note: Defining these methods externally, because they come in a bunch
	// and this way their names minify.

		// Single scalar

		setValue1f = function( gl, v ) { gl.uniform1f( this.addr, v ); },
		setValue1i = function( gl, v ) { gl.uniform1i( this.addr, v ); },

		// Single float vector (from flat array or THREE.VectorN)

		setValue2fv = function( gl, v ) {

			if ( v.x === undefined ) gl.uniform2fv( this.addr, v );
			else gl.uniform2f( this.addr, v.x, v.y );

		},

		setValue3fv = function( gl, v ) {

			if ( v.x !== undefined )
				gl.uniform3f( this.addr, v.x, v.y, v.z );
			else if ( v.r !== undefined )
				gl.uniform3f( this.addr, v.r, v.g, v.b );
			else
				gl.uniform3fv( this.addr, v );

		},

		setValue4fv = function( gl, v ) {

			if ( v.x === undefined ) gl.uniform4fv( this.addr, v );
			else gl.uniform4f( this.addr, v.x, v.y, v.z, v.w );

		},

		// Single matrix (from flat array or MatrixN)

		setValue2fm = function( gl, v ) {

			gl.uniformMatrix2fv( this.addr, false, v.elements || v );

		},

		setValue3fm = function( gl, v ) {

			gl.uniformMatrix3fv( this.addr, false, v.elements || v );

		},

		setValue4fm = function( gl, v ) {

			gl.uniformMatrix4fv( this.addr, false, v.elements || v );

		},

		// Single texture (2D / Cube)

		setValueT1 = function( gl, v, renderer ) {

			var unit = renderer.allocTextureUnit();
			gl.uniform1i( this.addr, unit );
			if ( v ) renderer.setTexture2D( v, unit );

		},

		setValueT6 = function( gl, v, renderer ) {

			var unit = renderer.allocTextureUnit();
			gl.uniform1i( this.addr, unit );
			if ( v ) renderer.setTextureCube( v, unit );

		},

		// Integer / Boolean vectors or arrays thereof (always flat arrays)

		setValue2iv = function( gl, v ) { gl.uniform2iv( this.addr, v ); },
		setValue3iv = function( gl, v ) { gl.uniform3iv( this.addr, v ); },
		setValue4iv = function( gl, v ) { gl.uniform4iv( this.addr, v ); },

		// Helper to pick the right setter for the singular case

		getSingularSetter = function( type ) {

			switch ( type ) {

				case 0x1406: return setValue1f; // FLOAT
				case 0x8b50: return setValue2fv; // _VEC2
				case 0x8b51: return setValue3fv; // _VEC3
				case 0x8b52: return setValue4fv; // _VEC4

				case 0x8b5a: return setValue2fm; // _MAT2
				case 0x8b5b: return setValue3fm; // _MAT3
				case 0x8b5c: return setValue4fm; // _MAT4

				case 0x8b5e: return setValueT1; // SAMPLER_2D
				case 0x8b60: return setValueT6; // SAMPLER_CUBE

				case 0x1404: case 0x8b56: return setValue1i; // INT, BOOL
				case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
				case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
				case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4

			}

		},

		// Array of scalars

		setValue1fv = function( gl, v ) { gl.uniform1fv( this.addr, v ); },
		setValue1iv = function( gl, v ) { gl.uniform1iv( this.addr, v ); },

		// Array of vectors (flat or from THREE classes)

		setValueV2a = function( gl, v ) {

			gl.uniform2fv( this.addr, flatten( v, this.size, 2 ) );

		},

		setValueV3a = function( gl, v ) {

			gl.uniform3fv( this.addr, flatten( v, this.size, 3 ) );

		},

		setValueV4a = function( gl, v ) {

			gl.uniform4fv( this.addr, flatten( v, this.size, 4 ) );

		},

		// Array of matrices (flat or from THREE clases)

		setValueM2a = function( gl, v ) {

			gl.uniformMatrix2fv( this.addr, false, flatten( v, this.size, 4 ) );

		},

		setValueM3a = function( gl, v ) {

			gl.uniformMatrix3fv( this.addr, false, flatten( v, this.size, 9 ) );

		},

		setValueM4a = function( gl, v ) {

			gl.uniformMatrix4fv( this.addr, false, flatten( v, this.size, 16 ) );

		},

		// Array of textures (2D / Cube)

		setValueT1a = function( gl, v, renderer ) {

			var n = v.length,
				units = allocTexUnits( renderer, n );

			gl.uniform1iv( this.addr, units );

			for ( var i = 0; i !== n; ++ i ) {

				var tex = v[ i ];
				if ( tex ) renderer.setTexture2D( tex, units[ i ] );

			}

		},

		setValueT6a = function( gl, v, renderer ) {

			var n = v.length,
				units = allocTexUnits( renderer, n );

			gl.uniform1iv( this.addr, units );

			for ( var i = 0; i !== n; ++ i ) {

				var tex = v[ i ];
				if ( tex ) renderer.setTextureCube( tex, units[ i ] );

			}

		},


		// Helper to pick the right setter for a pure (bottom-level) array

		getPureArraySetter = function( type ) {

			switch ( type ) {

				case 0x1406: return setValue1fv; // FLOAT
				case 0x8b50: return setValueV2a; // _VEC2
				case 0x8b51: return setValueV3a; // _VEC3
				case 0x8b52: return setValueV4a; // _VEC4

				case 0x8b5a: return setValueM2a; // _MAT2
				case 0x8b5b: return setValueM3a; // _MAT3
				case 0x8b5c: return setValueM4a; // _MAT4

				case 0x8b5e: return setValueT1a; // SAMPLER_2D
				case 0x8b60: return setValueT6a; // SAMPLER_CUBE

				case 0x1404: case 0x8b56: return setValue1iv; // INT, BOOL
				case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
				case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
				case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4

			}

		},

	// --- Uniform Classes ---

		SingleUniform = function SingleUniform( id, activeInfo, addr ) {

			this.id = id;
			this.addr = addr;
			this.setValue = getSingularSetter( activeInfo.type );

			// this.path = activeInfo.name; // DEBUG

		},

		PureArrayUniform = function( id, activeInfo, addr ) {

			this.id = id;
			this.addr = addr;
			this.size = activeInfo.size;
			this.setValue = getPureArraySetter( activeInfo.type );

			// this.path = activeInfo.name; // DEBUG

		},

		StructuredUniform = function( id ) {

			this.id = id;

			UniformContainer.call( this ); // mix-in

		};

	StructuredUniform.prototype.setValue = function( gl, value ) {

		// Note: Don't need an extra 'renderer' parameter, since samplers
		// are not allowed in structured uniforms.

		var seq = this.seq;

		for ( var i = 0, n = seq.length; i !== n; ++ i ) {

			var u = seq[ i ];
			u.setValue( gl, value[ u.id ] );

		}

	};

	// --- Top-level ---

	// Parser - builds up the property tree from the path strings

	var RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g,
		// extracts
		// 	- the identifier (member name or array index)
		//  - followed by an optional right bracket (found when array index)
		//  - followed by an optional left bracket or dot (type of subscript)
		//
		// Note: These portions can be read in a non-overlapping fashion and
		// allow straightforward parsing of the hierarchy that WebGL encodes
		// in the uniform names.

		addUniform = function( container, uniformObject ) {

			container.seq.push( uniformObject );
			container.map[ uniformObject.id ] = uniformObject;

		},

		parseUniform = function( activeInfo, addr, container ) {

			var path = activeInfo.name,
				pathLength = path.length;

			// reset RegExp object, because of the early exit of a previous run
			RePathPart.lastIndex = 0;

			for (; ;) {

				var match = RePathPart.exec( path ),
					matchEnd = RePathPart.lastIndex,

					id = match[ 1 ],
					idIsIndex = match[ 2 ] === ']',
					subscript = match[ 3 ];

				if ( idIsIndex ) id = id | 0; // convert to integer

				if ( subscript === undefined ||
						subscript === '[' && matchEnd + 2 === pathLength ) {
					// bare name or "pure" bottom-level array "[0]" suffix

					addUniform( container, subscript === undefined ?
							new SingleUniform( id, activeInfo, addr ) :
							new PureArrayUniform( id, activeInfo, addr ) );

					break;

				} else {
					// step into inner node / create it in case it doesn't exist

					var map = container.map,
						next = map[ id ];

					if ( next === undefined ) {

						next = new StructuredUniform( id );
						addUniform( container, next );

					}

					container = next;

				}

			}

		},

	// Root Container

		WebGLUniforms = function WebGLUniforms( gl, program, renderer ) {

			UniformContainer.call( this );

			this.renderer = renderer;

			var n = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );

			for ( var i = 0; i !== n; ++ i ) {

				var info = gl.getActiveUniform( program, i ),
					path = info.name,
					addr = gl.getUniformLocation( program, path );

				parseUniform( info, addr, this );

			}

		};


	WebGLUniforms.prototype.setValue = function( gl, name, value ) {

		var u = this.map[ name ];

		if ( u !== undefined ) u.setValue( gl, value, this.renderer );

	};

	WebGLUniforms.prototype.set = function( gl, object, name ) {

		var u = this.map[ name ];

		if ( u !== undefined ) u.setValue( gl, object[ name ], this.renderer );

	};

	WebGLUniforms.prototype.setOptional = function( gl, object, name ) {

		var v = object[ name ];

		if ( v !== undefined ) this.setValue( gl, name, v );

	};


	// Static interface

	WebGLUniforms.upload = function( gl, seq, values, renderer ) {

		for ( var i = 0, n = seq.length; i !== n; ++ i ) {

			var u = seq[ i ],
				v = values[ u.id ];

			if ( v.needsUpdate !== false ) {
				// note: always updating when .needsUpdate is undefined

				u.setValue( gl, v.value, renderer );

			}

		}

	};

	WebGLUniforms.seqWithValue = function( seq, values ) {

		var r = [];

		for ( var i = 0, n = seq.length; i !== n; ++ i ) {

			var u = seq[ i ];
			if ( u.id in values ) r.push( u );

		}

		return r;

	};

	WebGLUniforms.splitDynamic = function( seq, values ) {

		var r = null,
			n = seq.length,
			w = 0;

		for ( var i = 0; i !== n; ++ i ) {

			var u = seq[ i ],
				v = values[ u.id ];

			if ( v && v.dynamic === true ) {

				if ( r === null ) r = [];
				r.push( u );

			} else {

				// in-place compact 'seq', removing the matches
				if ( w < i ) seq[ w ] = u;
				++ w;

			}

		}

		if ( w < n ) seq.length = w;

		return r;

	};

	WebGLUniforms.evalDynamic = function( seq, values, object, camera ) {

		for ( var i = 0, n = seq.length; i !== n; ++ i ) {

			var v = values[ seq[ i ].id ],
				f = v.onUpdateCallback;

			if ( f !== undefined ) f.call( v, object, camera );

		}

	};

	return WebGLUniforms;

} )();


// File:src/renderers/webgl/plugins/LensFlarePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlarePlugin = function ( renderer, flares ) {

	var gl = renderer.context;
	var state = renderer.state;

	var vertexBuffer, elementBuffer;
	var shader, program, attributes, uniforms;

	var tempTexture, occlusionTexture;

	function init() {

		var vertices = new Float32Array( [
			- 1, - 1,  0, 0,
			 1, - 1,  1, 0,
			 1,  1,  1, 1,
			- 1,  1,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		// buffers

		vertexBuffer     = gl.createBuffer();
		elementBuffer    = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		// textures

		tempTexture      = gl.createTexture();
		occlusionTexture = gl.createTexture();

		state.bindTexture( gl.TEXTURE_2D, tempTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		state.bindTexture( gl.TEXTURE_2D, occlusionTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		shader = {

			vertexShader: [

				"uniform lowp int renderType;",

				"uniform vec3 screenPosition;",
				"uniform vec2 scale;",
				"uniform float rotation;",

				"uniform sampler2D occlusionMap;",

				"attribute vec2 position;",
				"attribute vec2 uv;",

				"varying vec2 vUV;",
				"varying float vVisibility;",

				"void main() {",

					"vUV = uv;",

					"vec2 pos = position;",

					"if ( renderType == 2 ) {",

						"vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );",
						"visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );",

						"vVisibility =        visibility.r / 9.0;",
						"vVisibility *= 1.0 - visibility.g / 9.0;",
						"vVisibility *=       visibility.b / 9.0;",
						"vVisibility *= 1.0 - visibility.a / 9.0;",

						"pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;",
						"pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;",

					"}",

					"gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );",

				"}"

			].join( "\n" ),

			fragmentShader: [

				"uniform lowp int renderType;",

				"uniform sampler2D map;",
				"uniform float opacity;",
				"uniform vec3 color;",

				"varying vec2 vUV;",
				"varying float vVisibility;",

				"void main() {",

					// pink square

					"if ( renderType == 0 ) {",

						"gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );",

					// restore

					"} else if ( renderType == 1 ) {",

						"gl_FragColor = texture2D( map, vUV );",

					// flare

					"} else {",

						"vec4 texture = texture2D( map, vUV );",
						"texture.a *= opacity * vVisibility;",
						"gl_FragColor = texture;",
						"gl_FragColor.rgb *= color;",

					"}",

				"}"

			].join( "\n" )

		};

		program = createProgram( shader );

		attributes = {
			vertex: gl.getAttribLocation ( program, "position" ),
			uv:     gl.getAttribLocation ( program, "uv" )
		};

		uniforms = {
			renderType:     gl.getUniformLocation( program, "renderType" ),
			map:            gl.getUniformLocation( program, "map" ),
			occlusionMap:   gl.getUniformLocation( program, "occlusionMap" ),
			opacity:        gl.getUniformLocation( program, "opacity" ),
			color:          gl.getUniformLocation( program, "color" ),
			scale:          gl.getUniformLocation( program, "scale" ),
			rotation:       gl.getUniformLocation( program, "rotation" ),
			screenPosition: gl.getUniformLocation( program, "screenPosition" )
		};

	}

	/*
	 * Render lens flares
	 * Method: renders 16x16 0xff00ff-colored points scattered over the light source area,
	 *         reads these back and calculates occlusion.
	 */

	this.render = function ( scene, camera, viewport ) {

		if ( flares.length === 0 ) return;

		var tempPosition = new THREE.Vector3();

		var invAspect = viewport.w / viewport.z,
			halfViewportWidth = viewport.z * 0.5,
			halfViewportHeight = viewport.w * 0.5;

		var size = 16 / viewport.w,
			scale = new THREE.Vector2( size * invAspect, size );

		var screenPosition = new THREE.Vector3( 1, 1, 0 ),
			screenPositionPixels = new THREE.Vector2( 1, 1 );

		var validArea = new THREE.Box2();

		validArea.min.set( 0, 0 );
		validArea.max.set( viewport.z - 16, viewport.w - 16 );

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		state.initAttributes();
		state.enableAttribute( attributes.vertex );
		state.enableAttribute( attributes.uv );
		state.disableUnusedAttributes();

		// loop through all lens flares to update their occlusion and positions
		// setup gl and common used attribs/uniforms

		gl.uniform1i( uniforms.occlusionMap, 0 );
		gl.uniform1i( uniforms.map, 1 );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.vertex, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		state.disable( gl.CULL_FACE );
		state.setDepthWrite( false );

		for ( var i = 0, l = flares.length; i < l; i ++ ) {

			size = 16 / viewport.w;
			scale.set( size * invAspect, size );

			// calc object screen position

			var flare = flares[ i ];

			tempPosition.set( flare.matrixWorld.elements[ 12 ], flare.matrixWorld.elements[ 13 ], flare.matrixWorld.elements[ 14 ] );

			tempPosition.applyMatrix4( camera.matrixWorldInverse );
			tempPosition.applyProjection( camera.projectionMatrix );

			// setup arrays for gl programs

			screenPosition.copy( tempPosition );

			// horizontal and vertical coordinate of the lower left corner of the pixels to copy

			screenPositionPixels.x = viewport.x + ( screenPosition.x * halfViewportWidth ) + halfViewportWidth - 8;
			screenPositionPixels.y = viewport.y + ( screenPosition.y * halfViewportHeight ) + halfViewportHeight - 8;

			// screen cull

			if ( validArea.containsPoint( screenPositionPixels ) === true ) {

				// save current RGB to temp texture

				state.activeTexture( gl.TEXTURE0 );
				state.bindTexture( gl.TEXTURE_2D, null );
				state.activeTexture( gl.TEXTURE1 );
				state.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGB, screenPositionPixels.x, screenPositionPixels.y, 16, 16, 0 );


				// render pink quad

				gl.uniform1i( uniforms.renderType, 0 );
				gl.uniform2f( uniforms.scale, scale.x, scale.y );
				gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );

				state.disable( gl.BLEND );
				state.enable( gl.DEPTH_TEST );

				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// copy result to occlusionMap

				state.activeTexture( gl.TEXTURE0 );
				state.bindTexture( gl.TEXTURE_2D, occlusionTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGBA, screenPositionPixels.x, screenPositionPixels.y, 16, 16, 0 );


				// restore graphics

				gl.uniform1i( uniforms.renderType, 1 );
				state.disable( gl.DEPTH_TEST );

				state.activeTexture( gl.TEXTURE1 );
				state.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// update object positions

				flare.positionScreen.copy( screenPosition );

				if ( flare.customUpdateCallback ) {

					flare.customUpdateCallback( flare );

				} else {

					flare.updateLensFlares();

				}

				// render flares

				gl.uniform1i( uniforms.renderType, 2 );
				state.enable( gl.BLEND );

				for ( var j = 0, jl = flare.lensFlares.length; j < jl; j ++ ) {

					var sprite = flare.lensFlares[ j ];

					if ( sprite.opacity > 0.001 && sprite.scale > 0.001 ) {

						screenPosition.x = sprite.x;
						screenPosition.y = sprite.y;
						screenPosition.z = sprite.z;

						size = sprite.size * sprite.scale / viewport.w;

						scale.x = size * invAspect;
						scale.y = size;

						gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );
						gl.uniform2f( uniforms.scale, scale.x, scale.y );
						gl.uniform1f( uniforms.rotation, sprite.rotation );

						gl.uniform1f( uniforms.opacity, sprite.opacity );
						gl.uniform3f( uniforms.color, sprite.color.r, sprite.color.g, sprite.color.b );

						state.setBlending( sprite.blending, sprite.blendEquation, sprite.blendSrc, sprite.blendDst );
						renderer.setTexture2D( sprite.texture, 1 );

						gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

					}

				}

			}

		}

		// restore gl

		state.enable( gl.CULL_FACE );
		state.enable( gl.DEPTH_TEST );
		state.setDepthWrite( true );

		renderer.resetGLState();

	};

	function createProgram ( shader ) {

		var program = gl.createProgram();

		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
		var vertexShader = gl.createShader( gl.VERTEX_SHADER );

		var prefix = "precision " + renderer.getPrecision() + " float;\n";

		gl.shaderSource( fragmentShader, prefix + shader.fragmentShader );
		gl.shaderSource( vertexShader, prefix + shader.vertexShader );

		gl.compileShader( fragmentShader );
		gl.compileShader( vertexShader );

		gl.attachShader( program, fragmentShader );
		gl.attachShader( program, vertexShader );

		gl.linkProgram( program );

		return program;

	}

};

// File:src/renderers/webgl/plugins/SpritePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpritePlugin = function ( renderer, sprites ) {

	var gl = renderer.context;
	var state = renderer.state;

	var vertexBuffer, elementBuffer;
	var program, attributes, uniforms;

	var texture;

	// decompose matrixWorld

	var spritePosition = new THREE.Vector3();
	var spriteRotation = new THREE.Quaternion();
	var spriteScale = new THREE.Vector3();

	function init() {

		var vertices = new Float32Array( [
			- 0.5, - 0.5,  0, 0,
			  0.5, - 0.5,  1, 0,
			  0.5,   0.5,  1, 1,
			- 0.5,   0.5,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		vertexBuffer  = gl.createBuffer();
		elementBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		program = createProgram();

		attributes = {
			position:			gl.getAttribLocation ( program, 'position' ),
			uv:					gl.getAttribLocation ( program, 'uv' )
		};

		uniforms = {
			uvOffset:			gl.getUniformLocation( program, 'uvOffset' ),
			uvScale:			gl.getUniformLocation( program, 'uvScale' ),

			rotation:			gl.getUniformLocation( program, 'rotation' ),
			scale:				gl.getUniformLocation( program, 'scale' ),

			color:				gl.getUniformLocation( program, 'color' ),
			map:				gl.getUniformLocation( program, 'map' ),
			opacity:			gl.getUniformLocation( program, 'opacity' ),

			modelViewMatrix: 	gl.getUniformLocation( program, 'modelViewMatrix' ),
			projectionMatrix:	gl.getUniformLocation( program, 'projectionMatrix' ),

			fogType:			gl.getUniformLocation( program, 'fogType' ),
			fogDensity:			gl.getUniformLocation( program, 'fogDensity' ),
			fogNear:			gl.getUniformLocation( program, 'fogNear' ),
			fogFar:				gl.getUniformLocation( program, 'fogFar' ),
			fogColor:			gl.getUniformLocation( program, 'fogColor' ),

			alphaTest:			gl.getUniformLocation( program, 'alphaTest' )
		};

		var canvas = document.createElement( 'canvas' );
		canvas.width = 8;
		canvas.height = 8;

		var context = canvas.getContext( '2d' );
		context.fillStyle = 'white';
		context.fillRect( 0, 0, 8, 8 );

		texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;

	}

	this.render = function ( scene, camera ) {

		if ( sprites.length === 0 ) return;

		// setup gl

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		state.initAttributes();
		state.enableAttribute( attributes.position );
		state.enableAttribute( attributes.uv );
		state.disableUnusedAttributes();

		state.disable( gl.CULL_FACE );
		state.enable( gl.BLEND );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.position, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		gl.uniformMatrix4fv( uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

		state.activeTexture( gl.TEXTURE0 );
		gl.uniform1i( uniforms.map, 0 );

		var oldFogType = 0;
		var sceneFogType = 0;
		var fog = scene.fog;

		if ( fog ) {

			gl.uniform3f( uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b );

			if ( fog instanceof THREE.Fog ) {

				gl.uniform1f( uniforms.fogNear, fog.near );
				gl.uniform1f( uniforms.fogFar, fog.far );

				gl.uniform1i( uniforms.fogType, 1 );
				oldFogType = 1;
				sceneFogType = 1;

			} else if ( fog instanceof THREE.FogExp2 ) {

				gl.uniform1f( uniforms.fogDensity, fog.density );

				gl.uniform1i( uniforms.fogType, 2 );
				oldFogType = 2;
				sceneFogType = 2;

			}

		} else {

			gl.uniform1i( uniforms.fogType, 0 );
			oldFogType = 0;
			sceneFogType = 0;

		}


		// update positions and sort

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];

			sprite.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, sprite.matrixWorld );
			sprite.z = - sprite.modelViewMatrix.elements[ 14 ];

		}

		sprites.sort( painterSortStable );

		// render all sprites

		var scale = [];

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];
			var material = sprite.material;

			gl.uniform1f( uniforms.alphaTest, material.alphaTest );
			gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, sprite.modelViewMatrix.elements );

			sprite.matrixWorld.decompose( spritePosition, spriteRotation, spriteScale );

			scale[ 0 ] = spriteScale.x;
			scale[ 1 ] = spriteScale.y;

			var fogType = 0;

			if ( scene.fog && material.fog ) {

				fogType = sceneFogType;

			}

			if ( oldFogType !== fogType ) {

				gl.uniform1i( uniforms.fogType, fogType );
				oldFogType = fogType;

			}

			if ( material.map !== null ) {

				gl.uniform2f( uniforms.uvOffset, material.map.offset.x, material.map.offset.y );
				gl.uniform2f( uniforms.uvScale, material.map.repeat.x, material.map.repeat.y );

			} else {

				gl.uniform2f( uniforms.uvOffset, 0, 0 );
				gl.uniform2f( uniforms.uvScale, 1, 1 );

			}

			gl.uniform1f( uniforms.opacity, material.opacity );
			gl.uniform3f( uniforms.color, material.color.r, material.color.g, material.color.b );

			gl.uniform1f( uniforms.rotation, material.rotation );
			gl.uniform2fv( uniforms.scale, scale );

			state.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );
			state.setDepthTest( material.depthTest );
			state.setDepthWrite( material.depthWrite );

			if ( material.map ) {

				renderer.setTexture2D( material.map, 0 );

			} else {

				renderer.setTexture2D( texture, 0 );

			}

			gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

		}

		// restore gl

		state.enable( gl.CULL_FACE );

		renderer.resetGLState();

	};

	function createProgram () {

		var program = gl.createProgram();

		var vertexShader = gl.createShader( gl.VERTEX_SHADER );
		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );

		gl.shaderSource( vertexShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform mat4 modelViewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform float rotation;',
			'uniform vec2 scale;',
			'uniform vec2 uvOffset;',
			'uniform vec2 uvScale;',

			'attribute vec2 position;',
			'attribute vec2 uv;',

			'varying vec2 vUV;',

			'void main() {',

				'vUV = uvOffset + uv * uvScale;',

				'vec2 alignedPosition = position * scale;',

				'vec2 rotatedPosition;',
				'rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
				'rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

				'vec4 finalPosition;',

				'finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
				'finalPosition.xy += rotatedPosition;',
				'finalPosition = projectionMatrix * finalPosition;',

				'gl_Position = finalPosition;',

			'}'

		].join( '\n' ) );

		gl.shaderSource( fragmentShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform vec3 color;',
			'uniform sampler2D map;',
			'uniform float opacity;',

			'uniform int fogType;',
			'uniform vec3 fogColor;',
			'uniform float fogDensity;',
			'uniform float fogNear;',
			'uniform float fogFar;',
			'uniform float alphaTest;',

			'varying vec2 vUV;',

			'void main() {',

				'vec4 texture = texture2D( map, vUV );',

				'if ( texture.a < alphaTest ) discard;',

				'gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );',

				'if ( fogType > 0 ) {',

					'float depth = gl_FragCoord.z / gl_FragCoord.w;',
					'float fogFactor = 0.0;',

					'if ( fogType == 1 ) {',

						'fogFactor = smoothstep( fogNear, fogFar, depth );',

					'} else {',

						'const float LOG2 = 1.442695;',
						'fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );',
						'fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );',

					'}',

					'gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );',

				'}',

			'}'

		].join( '\n' ) );

		gl.compileShader( vertexShader );
		gl.compileShader( fragmentShader );

		gl.attachShader( program, vertexShader );
		gl.attachShader( program, fragmentShader );

		gl.linkProgram( program );

		return program;

	}

	function painterSortStable ( a, b ) {
		
		if ( a.renderOrder !== b.renderOrder ) {

			return a.renderOrder - b.renderOrder;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return b.id - a.id;

		}

	}

};

// File:src/Three.Legacy.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Object.assign( THREE, {
	Face4: function ( a, b, c, d, normal, color, materialIndex ) {
		console.warn( 'THREE.Face4 has been removed. A THREE.Face3 will be created instead.' );
		return new THREE.Face3( a, b, c, normal, color, materialIndex );
	},
	LineStrip: 0,
	LinePieces: 1,
	MeshFaceMaterial: THREE.MultiMaterial,
	PointCloud: function ( geometry, material ) {
		console.warn( 'THREE.PointCloud has been renamed to THREE.Points.' );
		return new THREE.Points( geometry, material );
	},
	Particle: THREE.Sprite,
	ParticleSystem: function ( geometry, material ) {
		console.warn( 'THREE.ParticleSystem has been renamed to THREE.Points.' );
		return new THREE.Points( geometry, material );
	},
	PointCloudMaterial: function ( parameters ) {
		console.warn( 'THREE.PointCloudMaterial has been renamed to THREE.PointsMaterial.' );
		return new THREE.PointsMaterial( parameters );
	},
	ParticleBasicMaterial: function ( parameters ) {
		console.warn( 'THREE.ParticleBasicMaterial has been renamed to THREE.PointsMaterial.' );
		return new THREE.PointsMaterial( parameters );
	},
	ParticleSystemMaterial: function ( parameters ) {
		console.warn( 'THREE.ParticleSystemMaterial has been renamed to THREE.PointsMaterial.' );
		return new THREE.PointsMaterial( parameters );
	},
	Vertex: function ( x, y, z ) {
		console.warn( 'THREE.Vertex has been removed. Use THREE.Vector3 instead.' );
		return new THREE.Vector3( x, y, z );
	}
} );

//

Object.assign( THREE.Box2.prototype, {
	empty: function () {
		console.warn( 'THREE.Box2: .empty() has been renamed to .isEmpty().' );
		return this.isEmpty();
	},
	isIntersectionBox: function ( box ) {
		console.warn( 'THREE.Box2: .isIntersectionBox() has been renamed to .intersectsBox().' );
		return this.intersectsBox( box );
	}
} );

Object.assign( THREE.Box3.prototype, {
	empty: function () {
		console.warn( 'THREE.Box3: .empty() has been renamed to .isEmpty().' );
		return this.isEmpty();
	},
	isIntersectionBox: function ( box ) {
		console.warn( 'THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox().' );
		return this.intersectsBox( box );
	},
	isIntersectionSphere: function ( sphere ) {
		console.warn( 'THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere().' );
		return this.intersectsSphere( sphere );
	}
} );

Object.assign( THREE.Matrix3.prototype, {
	multiplyVector3: function ( vector ) {
		console.warn( 'THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.' );
		return vector.applyMatrix3( this );
	},
	multiplyVector3Array: function ( a ) {
		console.warn( 'THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );
	}
} );

Object.assign( THREE.Matrix4.prototype, {
	extractPosition: function ( m ) {
		console.warn( 'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
		return this.copyPosition( m );
	},
	setRotationFromQuaternion: function ( q ) {
		console.warn( 'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );
		return this.makeRotationFromQuaternion( q );
	},
	multiplyVector3: function ( vector ) {
		console.warn( 'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
		return vector.applyProjection( this );
	},
	multiplyVector4: function ( vector ) {
		console.warn( 'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );
	},
	multiplyVector3Array: function ( a ) {
		console.warn( 'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );
	},
	rotateAxis: function ( v ) {
		console.warn( 'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );
		v.transformDirection( this );
	},
	crossVector: function ( vector ) {
		console.warn( 'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );
	},
	translate: function ( v ) {
		console.error( 'THREE.Matrix4: .translate() has been removed.' );
	},
	rotateX: function ( angle ) {
		console.error( 'THREE.Matrix4: .rotateX() has been removed.' );
	},
	rotateY: function ( angle ) {
		console.error( 'THREE.Matrix4: .rotateY() has been removed.' );
	},
	rotateZ: function ( angle ) {
		console.error( 'THREE.Matrix4: .rotateZ() has been removed.' );
	},
	rotateByAxis: function ( axis, angle ) {
		console.error( 'THREE.Matrix4: .rotateByAxis() has been removed.' );
	}
} );

Object.assign( THREE.Plane.prototype, {
	isIntersectionLine: function ( line ) {
		console.warn( 'THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine().' );
		return this.intersectsLine( line );
	}
} );

Object.assign( THREE.Quaternion.prototype, {
	multiplyVector3: function ( vector ) {
		console.warn( 'THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
		return vector.applyQuaternion( this );
	}
} );

Object.assign( THREE.Ray.prototype, {
	isIntersectionBox: function ( box ) {
		console.warn( 'THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox().' );
		return this.intersectsBox( box );
	},
	isIntersectionPlane: function ( plane ) {
		console.warn( 'THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane().' );
		return this.intersectsPlane( plane );
	},
	isIntersectionSphere: function ( sphere ) {
		console.warn( 'THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere().' );
		return this.intersectsSphere( sphere );
	}
} );

Object.assign( THREE.Vector3.prototype, {
	setEulerFromRotationMatrix: function () {
		console.error( 'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );
	},
	setEulerFromQuaternion: function () {
		console.error( 'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );
	},
	getPositionFromMatrix: function ( m ) {
		console.warn( 'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );
		return this.setFromMatrixPosition( m );
	},
	getScaleFromMatrix: function ( m ) {
		console.warn( 'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );
		return this.setFromMatrixScale( m );
	},
	getColumnFromMatrix: function ( index, matrix ) {
		console.warn( 'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );
		return this.setFromMatrixColumn( matrix, index );
	}
} );

//

Object.assign( THREE.Object3D.prototype, {
	getChildByName: function ( name ) {
		console.warn( 'THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().' );
		return this.getObjectByName( name );
	},
	renderDepth: function ( value ) {
		console.warn( 'THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.' );
	},
	translate: function ( distance, axis ) {
		console.warn( 'THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.' );
		return this.translateOnAxis( axis, distance );
	}
} );

Object.defineProperties( THREE.Object3D.prototype, {
	eulerOrder: {
		get: function () {
			console.warn( 'THREE.Object3D: .eulerOrder is now .rotation.order.' );
			return this.rotation.order;
		},
		set: function ( value ) {
			console.warn( 'THREE.Object3D: .eulerOrder is now .rotation.order.' );
			this.rotation.order = value;
		}
	},
	useQuaternion: {
		get: function () {
			console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );
		},
		set: function ( value ) {
			console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );
		}
	}
} );

Object.defineProperties( THREE.LOD.prototype, {
	objects: {
		get: function () {
			console.warn( 'THREE.LOD: .objects has been renamed to .levels.' );
			return this.levels;
		}
	}
} );

//

THREE.PerspectiveCamera.prototype.setLens = function ( focalLength, filmGauge ) {

	console.warn( "THREE.PerspectiveCamera.setLens is deprecated. " +
			"Use .setFocalLength and .filmGauge for a photographic setup." );

	if ( filmGauge !== undefined ) this.filmGauge = filmGauge;
	this.setFocalLength( focalLength );

};

//

Object.defineProperties( THREE.Light.prototype, {
	onlyShadow: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .onlyShadow has been removed.' );
		}
	},
	shadowCameraFov: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraFov is now .shadow.camera.fov.' );
			this.shadow.camera.fov = value;
		}
	},
	shadowCameraLeft: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraLeft is now .shadow.camera.left.' );
			this.shadow.camera.left = value;
		}
	},
	shadowCameraRight: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraRight is now .shadow.camera.right.' );
			this.shadow.camera.right = value;
		}
	},
	shadowCameraTop: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraTop is now .shadow.camera.top.' );
			this.shadow.camera.top = value;
		}
	},
	shadowCameraBottom: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom.' );
			this.shadow.camera.bottom = value;
		}
	},
	shadowCameraNear: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraNear is now .shadow.camera.near.' );
			this.shadow.camera.near = value;
		}
	},
	shadowCameraFar: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraFar is now .shadow.camera.far.' );
			this.shadow.camera.far = value;
		}
	},
	shadowCameraVisible: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.' );
		}
	},
	shadowBias: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowBias is now .shadow.bias.' );
			this.shadow.bias = value;
		}
	},
	shadowDarkness: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowDarkness has been removed.' );
		}
	},
	shadowMapWidth: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowMapWidth is now .shadow.mapSize.width.' );
			this.shadow.mapSize.width = value;
		}
	},
	shadowMapHeight: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowMapHeight is now .shadow.mapSize.height.' );
			this.shadow.mapSize.height = value;
		}
	}
} );

//

Object.defineProperties( THREE.BufferAttribute.prototype, {
	length: {
		get: function () {
			console.warn( 'THREE.BufferAttribute: .length has been deprecated. Please use .count.' );
			return this.array.length;
		}
	}
} );

Object.assign( THREE.BufferGeometry.prototype, {
	addIndex: function ( index ) {
		console.warn( 'THREE.BufferGeometry: .addIndex() has been renamed to .setIndex().' );
		this.setIndex( index );
	},
	addDrawCall: function ( start, count, indexOffset ) {
		if ( indexOffset !== undefined ) {
			console.warn( 'THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset.' );
		}
		console.warn( 'THREE.BufferGeometry: .addDrawCall() is now .addGroup().' );
		this.addGroup( start, count );
	},
	clearDrawCalls: function () {
		console.warn( 'THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups().' );
		this.clearGroups();
	},
	computeTangents: function () {
		console.warn( 'THREE.BufferGeometry: .computeTangents() has been removed.' );
	},
	computeOffsets: function () {
		console.warn( 'THREE.BufferGeometry: .computeOffsets() has been removed.' );
	}
} );

Object.defineProperties( THREE.BufferGeometry.prototype, {
	drawcalls: {
		get: function () {
			console.error( 'THREE.BufferGeometry: .drawcalls has been renamed to .groups.' );
			return this.groups;
		}
	},
	offsets: {
		get: function () {
			console.warn( 'THREE.BufferGeometry: .offsets has been renamed to .groups.' );
			return this.groups;
		}
	}
} );

//

Object.defineProperties( THREE.Material.prototype, {
	wrapAround: {
		get: function () {
			console.warn( 'THREE.' + this.type + ': .wrapAround has been removed.' );
		},
		set: function ( value ) {
			console.warn( 'THREE.' + this.type + ': .wrapAround has been removed.' );
		}
	},
	wrapRGB: {
		get: function () {
			console.warn( 'THREE.' + this.type + ': .wrapRGB has been removed.' );
			return new THREE.Color();
		}
	}
} );

Object.defineProperties( THREE.MeshPhongMaterial.prototype, {
	metal: {
		get: function () {
			console.warn( 'THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead.' );
			return false;
		},
		set: function ( value ) {
			console.warn( 'THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead' );
		}
	}
} );

Object.defineProperties( THREE.ShaderMaterial.prototype, {
	derivatives: {
		get: function () {
			console.warn( 'THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives.' );
			return this.extensions.derivatives;
		},
		set: function ( value ) {
			console.warn( 'THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives.' );
			this.extensions.derivatives = value;
		}
	}
} );

//

THREE.EventDispatcher.prototype = Object.assign( Object.create( {

	// Note: Extra base ensures these properties are not 'assign'ed.

	constructor: THREE.EventDispatcher,

	apply: function ( target ) {

		console.warn( "THREE.EventDispatcher: .apply is deprecated, " +
				"just inherit or Object.assign the prototype to mix-in." );

		Object.assign( target, this );

	}

} ), THREE.EventDispatcher.prototype );

//

Object.assign( THREE.WebGLRenderer.prototype, {
	supportsFloatTextures: function () {
		console.warn( 'THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( \'OES_texture_float\' ).' );
		return this.extensions.get( 'OES_texture_float' );
	},
	supportsHalfFloatTextures: function () {
		console.warn( 'THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( \'OES_texture_half_float\' ).' );
		return this.extensions.get( 'OES_texture_half_float' );
	},
	supportsStandardDerivatives: function () {
		console.warn( 'THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( \'OES_standard_derivatives\' ).' );
		return this.extensions.get( 'OES_standard_derivatives' );
	},
	supportsCompressedTextureS3TC: function () {
		console.warn( 'THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( \'WEBGL_compressed_texture_s3tc\' ).' );
		return this.extensions.get( 'WEBGL_compressed_texture_s3tc' );
	},
	supportsCompressedTexturePVRTC: function () {
		console.warn( 'THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( \'WEBGL_compressed_texture_pvrtc\' ).' );
		return this.extensions.get( 'WEBGL_compressed_texture_pvrtc' );
	},
	supportsBlendMinMax: function () {
		console.warn( 'THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( \'EXT_blend_minmax\' ).' );
		return this.extensions.get( 'EXT_blend_minmax' );
	},
	supportsVertexTextures: function () {
		return this.capabilities.vertexTextures;
	},
	supportsInstancedArrays: function () {
		console.warn( 'THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( \'ANGLE_instanced_arrays\' ).' );
		return this.extensions.get( 'ANGLE_instanced_arrays' );
	},
	enableScissorTest: function ( boolean ) {
		console.warn( 'THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest().' );
		this.setScissorTest( boolean );
	},
	initMaterial: function () {
		console.warn( 'THREE.WebGLRenderer: .initMaterial() has been removed.' );
	},
	addPrePlugin: function () {
		console.warn( 'THREE.WebGLRenderer: .addPrePlugin() has been removed.' );
	},
	addPostPlugin: function () {
		console.warn( 'THREE.WebGLRenderer: .addPostPlugin() has been removed.' );
	},
	updateShadowMap: function () {
		console.warn( 'THREE.WebGLRenderer: .updateShadowMap() has been removed.' );
	}
} );

Object.defineProperties( THREE.WebGLRenderer.prototype, {
	shadowMapEnabled: {
		get: function () {
			return this.shadowMap.enabled;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled.' );
			this.shadowMap.enabled = value;
		}
	},
	shadowMapType: {
		get: function () {
			return this.shadowMap.type;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type.' );
			this.shadowMap.type = value;
		}
	},
	shadowMapCullFace: {
		get: function () {
			return this.shadowMap.cullFace;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderer: .shadowMapCullFace is now .shadowMap.cullFace.' );
			this.shadowMap.cullFace = value;
		}
	}
} );

Object.defineProperties( THREE.WebGLShadowMap.prototype, {
	cullFace: {
		get: function () {
			return this.renderReverseSided ? THREE.CullFaceFront : THREE.CullFaceBack;
		},
		set: function ( cullFace ) {
			var value = ( cullFace !== THREE.CullFaceBack );
			console.warn( "WebGLRenderer: .shadowMap.cullFace is deprecated. Set .shadowMap.renderReverseSided to " + value + "." );
			this.renderReverseSided = value;
		}
	}
} );

//

Object.defineProperties( THREE.WebGLRenderTarget.prototype, {
	wrapS: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS.' );
			return this.texture.wrapS;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS.' );
			this.texture.wrapS = value;
		}
	},
	wrapT: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT.' );
			return this.texture.wrapT;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT.' );
			this.texture.wrapT = value;
		}
	},
	magFilter: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter.' );
			return this.texture.magFilter;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter.' );
			this.texture.magFilter = value;
		}
	},
	minFilter: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter.' );
			return this.texture.minFilter;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter.' );
			this.texture.minFilter = value;
		}
	},
	anisotropy: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy.' );
			return this.texture.anisotropy;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy.' );
			this.texture.anisotropy = value;
		}
	},
	offset: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .offset is now .texture.offset.' );
			return this.texture.offset;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .offset is now .texture.offset.' );
			this.texture.offset = value;
		}
	},
	repeat: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .repeat is now .texture.repeat.' );
			return this.texture.repeat;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .repeat is now .texture.repeat.' );
			this.texture.repeat = value;
		}
	},
	format: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .format is now .texture.format.' );
			return this.texture.format;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .format is now .texture.format.' );
			this.texture.format = value;
		}
	},
	type: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .type is now .texture.type.' );
			return this.texture.type;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .type is now .texture.type.' );
			this.texture.type = value;
		}
	},
	generateMipmaps: {
		get: function () {
			console.warn( 'THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps.' );
			return this.texture.generateMipmaps;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps.' );
			this.texture.generateMipmaps = value;
		}
	}
} );

//

Object.assign( THREE.Audio.prototype, {
	load: function ( file ) {
		console.warn( 'THREE.Audio: .load has been deprecated. Please use THREE.AudioLoader.' );
		var scope = this;
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( file, function ( buffer ) {
			scope.setBuffer( buffer );
		} );
		return this;
	}
} );

Object.assign( THREE.AudioAnalyser.prototype, {
	getData: function ( file ) {
		console.warn( 'THREE.AudioAnalyser: .getData() is now .getFrequencyData().' );
		return this.getFrequencyData();
	}
} );

//

THREE.GeometryUtils = {

	merge: function ( geometry1, geometry2, materialIndexOffset ) {

		console.warn( 'THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.' );

		var matrix;

		if ( geometry2 instanceof THREE.Mesh ) {

			geometry2.matrixAutoUpdate && geometry2.updateMatrix();

			matrix = geometry2.matrix;
			geometry2 = geometry2.geometry;

		}

		geometry1.merge( geometry2, matrix, materialIndexOffset );

	},

	center: function ( geometry ) {

		console.warn( 'THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead.' );
		return geometry.center();

	}

};

THREE.ImageUtils = {

	crossOrigin: undefined,

	loadTexture: function ( url, mapping, onLoad, onError ) {

		console.warn( 'THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.' );

		var loader = new THREE.TextureLoader();
		loader.setCrossOrigin( this.crossOrigin );

		var texture = loader.load( url, onLoad, undefined, onError );

		if ( mapping ) texture.mapping = mapping;

		return texture;

	},

	loadTextureCube: function ( urls, mapping, onLoad, onError ) {

		console.warn( 'THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.' );

		var loader = new THREE.CubeTextureLoader();
		loader.setCrossOrigin( this.crossOrigin );

		var texture = loader.load( urls, onLoad, undefined, onError );

		if ( mapping ) texture.mapping = mapping;

		return texture;

	},

	loadCompressedTexture: function () {

		console.error( 'THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.' );

	},

	loadCompressedTextureCube: function () {

		console.error( 'THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.' );

	}

};

//

THREE.Projector = function () {

	console.error( 'THREE.Projector has been moved to /examples/js/renderers/Projector.js.' );

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() is now raycaster.setFromCamera().' );

	};

};

//

THREE.CanvasRenderer = function () {

	console.error( 'THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js' );

	this.domElement = document.createElement( 'canvas' );
	this.clear = function () {};
	this.render = function () {};
	this.setClearColor = function () {};
	this.setSize = function () {};

};

// File:src/extras/CurveUtils.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.CurveUtils = {

	tangentQuadraticBezier: function ( t, p0, p1, p2 ) {

		return 2 * ( 1 - t ) * ( p1 - p0 ) + 2 * t * ( p2 - p1 );

	},

	// Puay Bing, thanks for helping with this derivative!

	tangentCubicBezier: function ( t, p0, p1, p2, p3 ) {

		return - 3 * p0 * ( 1 - t ) * ( 1 - t )  +
			3 * p1 * ( 1 - t ) * ( 1 - t ) - 6 * t * p1 * ( 1 - t ) +
			6 * t *  p2 * ( 1 - t ) - 3 * t * t * p2 +
			3 * t * t * p3;

	},

	tangentSpline: function ( t, p0, p1, p2, p3 ) {

		// To check if my formulas are correct

		var h00 = 6 * t * t - 6 * t; 	// derived from 2t^3 − 3t^2 + 1
		var h10 = 3 * t * t - 4 * t + 1; // t^3 − 2t^2 + t
		var h01 = - 6 * t * t + 6 * t; 	// − 2t3 + 3t2
		var h11 = 3 * t * t - 2 * t;	// t3 − t2

		return h00 + h10 + h01 + h11;

	},

	// Catmull-Rom

	interpolate: function( p0, p1, p2, p3, t ) {

		var v0 = ( p2 - p0 ) * 0.5;
		var v1 = ( p3 - p1 ) * 0.5;
		var t2 = t * t;
		var t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

};

// File:src/extras/SceneUtils.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneUtils = {

	createMultiMaterialObject: function ( geometry, materials ) {

		var group = new THREE.Group();

		for ( var i = 0, l = materials.length; i < l; i ++ ) {

			group.add( new THREE.Mesh( geometry, materials[ i ] ) );

		}

		return group;

	},

	detach: function ( child, parent, scene ) {

		child.applyMatrix( parent.matrixWorld );
		parent.remove( child );
		scene.add( child );

	},

	attach: function ( child, scene, parent ) {

		var matrixWorldInverse = new THREE.Matrix4();
		matrixWorldInverse.getInverse( parent.matrixWorld );
		child.applyMatrix( matrixWorldInverse );

		scene.remove( child );
		parent.add( child );

	}

};

// File:src/extras/ShapeUtils.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.ShapeUtils = {

	// calculate area of the contour polygon

	area: function ( contour ) {

		var n = contour.length;
		var a = 0.0;

		for ( var p = n - 1, q = 0; q < n; p = q ++ ) {

			a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

		}

		return a * 0.5;

	},

	triangulate: ( function () {

		/**
		 * This code is a quick port of code written in C++ which was submitted to
		 * flipcode.com by John W. Ratcliff  // July 22, 2000
		 * See original code and more information here:
		 * http://www.flipcode.com/archives/Efficient_Polygon_Triangulation.shtml
		 *
		 * ported to actionscript by Zevan Rosser
		 * www.actionsnippet.com
		 *
		 * ported to javascript by Joshua Koo
		 * http://www.lab4games.net/zz85/blog
		 *
		 */

		function snip( contour, u, v, w, n, verts ) {

			var p;
			var ax, ay, bx, by;
			var cx, cy, px, py;

			ax = contour[ verts[ u ] ].x;
			ay = contour[ verts[ u ] ].y;

			bx = contour[ verts[ v ] ].x;
			by = contour[ verts[ v ] ].y;

			cx = contour[ verts[ w ] ].x;
			cy = contour[ verts[ w ] ].y;

			if ( Number.EPSILON > ( ( ( bx - ax ) * ( cy - ay ) ) - ( ( by - ay ) * ( cx - ax ) ) ) ) return false;

			var aX, aY, bX, bY, cX, cY;
			var apx, apy, bpx, bpy, cpx, cpy;
			var cCROSSap, bCROSScp, aCROSSbp;

			aX = cx - bx;  aY = cy - by;
			bX = ax - cx;  bY = ay - cy;
			cX = bx - ax;  cY = by - ay;

			for ( p = 0; p < n; p ++ ) {

				px = contour[ verts[ p ] ].x;
				py = contour[ verts[ p ] ].y;

				if ( ( ( px === ax ) && ( py === ay ) ) ||
					 ( ( px === bx ) && ( py === by ) ) ||
					 ( ( px === cx ) && ( py === cy ) ) )	continue;

				apx = px - ax;  apy = py - ay;
				bpx = px - bx;  bpy = py - by;
				cpx = px - cx;  cpy = py - cy;

				// see if p is inside triangle abc

				aCROSSbp = aX * bpy - aY * bpx;
				cCROSSap = cX * apy - cY * apx;
				bCROSScp = bX * cpy - bY * cpx;

				if ( ( aCROSSbp >= - Number.EPSILON ) && ( bCROSScp >= - Number.EPSILON ) && ( cCROSSap >= - Number.EPSILON ) ) return false;

			}

			return true;

		}

		// takes in an contour array and returns

		return function ( contour, indices ) {

			var n = contour.length;

			if ( n < 3 ) return null;

			var result = [],
				verts = [],
				vertIndices = [];

			/* we want a counter-clockwise polygon in verts */

			var u, v, w;

			if ( THREE.ShapeUtils.area( contour ) > 0.0 ) {

				for ( v = 0; v < n; v ++ ) verts[ v ] = v;

			} else {

				for ( v = 0; v < n; v ++ ) verts[ v ] = ( n - 1 ) - v;

			}

			var nv = n;

			/*  remove nv - 2 vertices, creating 1 triangle every time */

			var count = 2 * nv;   /* error detection */

			for ( v = nv - 1; nv > 2; ) {

				/* if we loop, it is probably a non-simple polygon */

				if ( ( count -- ) <= 0 ) {

					//** Triangulate: ERROR - probable bad polygon!

					//throw ( "Warning, unable to triangulate polygon!" );
					//return null;
					// Sometimes warning is fine, especially polygons are triangulated in reverse.
					console.warn( 'THREE.ShapeUtils: Unable to triangulate polygon! in triangulate()' );

					if ( indices ) return vertIndices;
					return result;

				}

				/* three consecutive vertices in current polygon, <u,v,w> */

				u = v; 	 	if ( nv <= u ) u = 0;     /* previous */
				v = u + 1;  if ( nv <= v ) v = 0;     /* new v    */
				w = v + 1;  if ( nv <= w ) w = 0;     /* next     */

				if ( snip( contour, u, v, w, nv, verts ) ) {

					var a, b, c, s, t;

					/* true names of the vertices */

					a = verts[ u ];
					b = verts[ v ];
					c = verts[ w ];

					/* output Triangle */

					result.push( [ contour[ a ],
						contour[ b ],
						contour[ c ] ] );


					vertIndices.push( [ verts[ u ], verts[ v ], verts[ w ] ] );

					/* remove v from the remaining polygon */

					for ( s = v, t = v + 1; t < nv; s ++, t ++ ) {

						verts[ s ] = verts[ t ];

					}

					nv --;

					/* reset error detection counter */

					count = 2 * nv;

				}

			}

			if ( indices ) return vertIndices;
			return result;

		}

	} )(),

	triangulateShape: function ( contour, holes ) {

		function point_in_segment_2D_colin( inSegPt1, inSegPt2, inOtherPt ) {

			// inOtherPt needs to be collinear to the inSegment
			if ( inSegPt1.x !== inSegPt2.x ) {

				if ( inSegPt1.x < inSegPt2.x ) {

					return	( ( inSegPt1.x <= inOtherPt.x ) && ( inOtherPt.x <= inSegPt2.x ) );

				} else {

					return	( ( inSegPt2.x <= inOtherPt.x ) && ( inOtherPt.x <= inSegPt1.x ) );

				}

			} else {

				if ( inSegPt1.y < inSegPt2.y ) {

					return	( ( inSegPt1.y <= inOtherPt.y ) && ( inOtherPt.y <= inSegPt2.y ) );

				} else {

					return	( ( inSegPt2.y <= inOtherPt.y ) && ( inOtherPt.y <= inSegPt1.y ) );

				}

			}

		}

		function intersect_segments_2D( inSeg1Pt1, inSeg1Pt2, inSeg2Pt1, inSeg2Pt2, inExcludeAdjacentSegs ) {

			var seg1dx = inSeg1Pt2.x - inSeg1Pt1.x,   seg1dy = inSeg1Pt2.y - inSeg1Pt1.y;
			var seg2dx = inSeg2Pt2.x - inSeg2Pt1.x,   seg2dy = inSeg2Pt2.y - inSeg2Pt1.y;

			var seg1seg2dx = inSeg1Pt1.x - inSeg2Pt1.x;
			var seg1seg2dy = inSeg1Pt1.y - inSeg2Pt1.y;

			var limit		= seg1dy * seg2dx - seg1dx * seg2dy;
			var perpSeg1	= seg1dy * seg1seg2dx - seg1dx * seg1seg2dy;

			if ( Math.abs( limit ) > Number.EPSILON ) {

				// not parallel

				var perpSeg2;
				if ( limit > 0 ) {

					if ( ( perpSeg1 < 0 ) || ( perpSeg1 > limit ) ) 		return [];
					perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
					if ( ( perpSeg2 < 0 ) || ( perpSeg2 > limit ) ) 		return [];

				} else {

					if ( ( perpSeg1 > 0 ) || ( perpSeg1 < limit ) ) 		return [];
					perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
					if ( ( perpSeg2 > 0 ) || ( perpSeg2 < limit ) ) 		return [];

				}

				// i.e. to reduce rounding errors
				// intersection at endpoint of segment#1?
				if ( perpSeg2 === 0 ) {

					if ( ( inExcludeAdjacentSegs ) &&
						 ( ( perpSeg1 === 0 ) || ( perpSeg1 === limit ) ) )		return [];
					return [ inSeg1Pt1 ];

				}
				if ( perpSeg2 === limit ) {

					if ( ( inExcludeAdjacentSegs ) &&
						 ( ( perpSeg1 === 0 ) || ( perpSeg1 === limit ) ) )		return [];
					return [ inSeg1Pt2 ];

				}
				// intersection at endpoint of segment#2?
				if ( perpSeg1 === 0 )		return [ inSeg2Pt1 ];
				if ( perpSeg1 === limit )	return [ inSeg2Pt2 ];

				// return real intersection point
				var factorSeg1 = perpSeg2 / limit;
				return	[ { x: inSeg1Pt1.x + factorSeg1 * seg1dx,
							y: inSeg1Pt1.y + factorSeg1 * seg1dy } ];

			} else {

				// parallel or collinear
				if ( ( perpSeg1 !== 0 ) ||
					 ( seg2dy * seg1seg2dx !== seg2dx * seg1seg2dy ) ) 			return [];

				// they are collinear or degenerate
				var seg1Pt = ( ( seg1dx === 0 ) && ( seg1dy === 0 ) );	// segment1 is just a point?
				var seg2Pt = ( ( seg2dx === 0 ) && ( seg2dy === 0 ) );	// segment2 is just a point?
				// both segments are points
				if ( seg1Pt && seg2Pt ) {

					if ( ( inSeg1Pt1.x !== inSeg2Pt1.x ) ||
						 ( inSeg1Pt1.y !== inSeg2Pt1.y ) )		return [];	// they are distinct  points
					return [ inSeg1Pt1 ];                 						// they are the same point

				}
				// segment#1  is a single point
				if ( seg1Pt ) {

					if ( ! point_in_segment_2D_colin( inSeg2Pt1, inSeg2Pt2, inSeg1Pt1 ) )		return [];		// but not in segment#2
					return [ inSeg1Pt1 ];

				}
				// segment#2  is a single point
				if ( seg2Pt ) {

					if ( ! point_in_segment_2D_colin( inSeg1Pt1, inSeg1Pt2, inSeg2Pt1 ) )		return [];		// but not in segment#1
					return [ inSeg2Pt1 ];

				}

				// they are collinear segments, which might overlap
				var seg1min, seg1max, seg1minVal, seg1maxVal;
				var seg2min, seg2max, seg2minVal, seg2maxVal;
				if ( seg1dx !== 0 ) {

					// the segments are NOT on a vertical line
					if ( inSeg1Pt1.x < inSeg1Pt2.x ) {

						seg1min = inSeg1Pt1; seg1minVal = inSeg1Pt1.x;
						seg1max = inSeg1Pt2; seg1maxVal = inSeg1Pt2.x;

					} else {

						seg1min = inSeg1Pt2; seg1minVal = inSeg1Pt2.x;
						seg1max = inSeg1Pt1; seg1maxVal = inSeg1Pt1.x;

					}
					if ( inSeg2Pt1.x < inSeg2Pt2.x ) {

						seg2min = inSeg2Pt1; seg2minVal = inSeg2Pt1.x;
						seg2max = inSeg2Pt2; seg2maxVal = inSeg2Pt2.x;

					} else {

						seg2min = inSeg2Pt2; seg2minVal = inSeg2Pt2.x;
						seg2max = inSeg2Pt1; seg2maxVal = inSeg2Pt1.x;

					}

				} else {

					// the segments are on a vertical line
					if ( inSeg1Pt1.y < inSeg1Pt2.y ) {

						seg1min = inSeg1Pt1; seg1minVal = inSeg1Pt1.y;
						seg1max = inSeg1Pt2; seg1maxVal = inSeg1Pt2.y;

					} else {

						seg1min = inSeg1Pt2; seg1minVal = inSeg1Pt2.y;
						seg1max = inSeg1Pt1; seg1maxVal = inSeg1Pt1.y;

					}
					if ( inSeg2Pt1.y < inSeg2Pt2.y ) {

						seg2min = inSeg2Pt1; seg2minVal = inSeg2Pt1.y;
						seg2max = inSeg2Pt2; seg2maxVal = inSeg2Pt2.y;

					} else {

						seg2min = inSeg2Pt2; seg2minVal = inSeg2Pt2.y;
						seg2max = inSeg2Pt1; seg2maxVal = inSeg2Pt1.y;

					}

				}
				if ( seg1minVal <= seg2minVal ) {

					if ( seg1maxVal <  seg2minVal )	return [];
					if ( seg1maxVal === seg2minVal )	{

						if ( inExcludeAdjacentSegs )		return [];
						return [ seg2min ];

					}
					if ( seg1maxVal <= seg2maxVal )	return [ seg2min, seg1max ];
					return	[ seg2min, seg2max ];

				} else {

					if ( seg1minVal >  seg2maxVal )	return [];
					if ( seg1minVal === seg2maxVal )	{

						if ( inExcludeAdjacentSegs )		return [];
						return [ seg1min ];

					}
					if ( seg1maxVal <= seg2maxVal )	return [ seg1min, seg1max ];
					return	[ seg1min, seg2max ];

				}

			}

		}

		function isPointInsideAngle( inVertex, inLegFromPt, inLegToPt, inOtherPt ) {

			// The order of legs is important

			// translation of all points, so that Vertex is at (0,0)
			var legFromPtX	= inLegFromPt.x - inVertex.x,  legFromPtY	= inLegFromPt.y - inVertex.y;
			var legToPtX	= inLegToPt.x	- inVertex.x,  legToPtY		= inLegToPt.y	- inVertex.y;
			var otherPtX	= inOtherPt.x	- inVertex.x,  otherPtY		= inOtherPt.y	- inVertex.y;

			// main angle >0: < 180 deg.; 0: 180 deg.; <0: > 180 deg.
			var from2toAngle	= legFromPtX * legToPtY - legFromPtY * legToPtX;
			var from2otherAngle	= legFromPtX * otherPtY - legFromPtY * otherPtX;

			if ( Math.abs( from2toAngle ) > Number.EPSILON ) {

				// angle != 180 deg.

				var other2toAngle		= otherPtX * legToPtY - otherPtY * legToPtX;
				// console.log( "from2to: " + from2toAngle + ", from2other: " + from2otherAngle + ", other2to: " + other2toAngle );

				if ( from2toAngle > 0 ) {

					// main angle < 180 deg.
					return	( ( from2otherAngle >= 0 ) && ( other2toAngle >= 0 ) );

				} else {

					// main angle > 180 deg.
					return	( ( from2otherAngle >= 0 ) || ( other2toAngle >= 0 ) );

				}

			} else {

				// angle == 180 deg.
				// console.log( "from2to: 180 deg., from2other: " + from2otherAngle  );
				return	( from2otherAngle > 0 );

			}

		}


		function removeHoles( contour, holes ) {

			var shape = contour.concat(); // work on this shape
			var hole;

			function isCutLineInsideAngles( inShapeIdx, inHoleIdx ) {

				// Check if hole point lies within angle around shape point
				var lastShapeIdx = shape.length - 1;

				var prevShapeIdx = inShapeIdx - 1;
				if ( prevShapeIdx < 0 )			prevShapeIdx = lastShapeIdx;

				var nextShapeIdx = inShapeIdx + 1;
				if ( nextShapeIdx > lastShapeIdx )	nextShapeIdx = 0;

				var insideAngle = isPointInsideAngle( shape[ inShapeIdx ], shape[ prevShapeIdx ], shape[ nextShapeIdx ], hole[ inHoleIdx ] );
				if ( ! insideAngle ) {

					// console.log( "Vertex (Shape): " + inShapeIdx + ", Point: " + hole[inHoleIdx].x + "/" + hole[inHoleIdx].y );
					return	false;

				}

				// Check if shape point lies within angle around hole point
				var lastHoleIdx = hole.length - 1;

				var prevHoleIdx = inHoleIdx - 1;
				if ( prevHoleIdx < 0 )			prevHoleIdx = lastHoleIdx;

				var nextHoleIdx = inHoleIdx + 1;
				if ( nextHoleIdx > lastHoleIdx )	nextHoleIdx = 0;

				insideAngle = isPointInsideAngle( hole[ inHoleIdx ], hole[ prevHoleIdx ], hole[ nextHoleIdx ], shape[ inShapeIdx ] );
				if ( ! insideAngle ) {

					// console.log( "Vertex (Hole): " + inHoleIdx + ", Point: " + shape[inShapeIdx].x + "/" + shape[inShapeIdx].y );
					return	false;

				}

				return	true;

			}

			function intersectsShapeEdge( inShapePt, inHolePt ) {

				// checks for intersections with shape edges
				var sIdx, nextIdx, intersection;
				for ( sIdx = 0; sIdx < shape.length; sIdx ++ ) {

					nextIdx = sIdx + 1; nextIdx %= shape.length;
					intersection = intersect_segments_2D( inShapePt, inHolePt, shape[ sIdx ], shape[ nextIdx ], true );
					if ( intersection.length > 0 )		return	true;

				}

				return	false;

			}

			var indepHoles = [];

			function intersectsHoleEdge( inShapePt, inHolePt ) {

				// checks for intersections with hole edges
				var ihIdx, chkHole,
					hIdx, nextIdx, intersection;
				for ( ihIdx = 0; ihIdx < indepHoles.length; ihIdx ++ ) {

					chkHole = holes[ indepHoles[ ihIdx ]];
					for ( hIdx = 0; hIdx < chkHole.length; hIdx ++ ) {

						nextIdx = hIdx + 1; nextIdx %= chkHole.length;
						intersection = intersect_segments_2D( inShapePt, inHolePt, chkHole[ hIdx ], chkHole[ nextIdx ], true );
						if ( intersection.length > 0 )		return	true;

					}

				}
				return	false;

			}

			var holeIndex, shapeIndex,
				shapePt, holePt,
				holeIdx, cutKey, failedCuts = [],
				tmpShape1, tmpShape2,
				tmpHole1, tmpHole2;

			for ( var h = 0, hl = holes.length; h < hl; h ++ ) {

				indepHoles.push( h );

			}

			var minShapeIndex = 0;
			var counter = indepHoles.length * 2;
			while ( indepHoles.length > 0 ) {

				counter --;
				if ( counter < 0 ) {

					console.log( "Infinite Loop! Holes left:" + indepHoles.length + ", Probably Hole outside Shape!" );
					break;

				}

				// search for shape-vertex and hole-vertex,
				// which can be connected without intersections
				for ( shapeIndex = minShapeIndex; shapeIndex < shape.length; shapeIndex ++ ) {

					shapePt = shape[ shapeIndex ];
					holeIndex	= - 1;

					// search for hole which can be reached without intersections
					for ( var h = 0; h < indepHoles.length; h ++ ) {

						holeIdx = indepHoles[ h ];

						// prevent multiple checks
						cutKey = shapePt.x + ":" + shapePt.y + ":" + holeIdx;
						if ( failedCuts[ cutKey ] !== undefined )			continue;

						hole = holes[ holeIdx ];
						for ( var h2 = 0; h2 < hole.length; h2 ++ ) {

							holePt = hole[ h2 ];
							if ( ! isCutLineInsideAngles( shapeIndex, h2 ) )		continue;
							if ( intersectsShapeEdge( shapePt, holePt ) )		continue;
							if ( intersectsHoleEdge( shapePt, holePt ) )		continue;

							holeIndex = h2;
							indepHoles.splice( h, 1 );

							tmpShape1 = shape.slice( 0, shapeIndex + 1 );
							tmpShape2 = shape.slice( shapeIndex );
							tmpHole1 = hole.slice( holeIndex );
							tmpHole2 = hole.slice( 0, holeIndex + 1 );

							shape = tmpShape1.concat( tmpHole1 ).concat( tmpHole2 ).concat( tmpShape2 );

							minShapeIndex = shapeIndex;

							// Debug only, to show the selected cuts
							// glob_CutLines.push( [ shapePt, holePt ] );

							break;

						}
						if ( holeIndex >= 0 )	break;		// hole-vertex found

						failedCuts[ cutKey ] = true;			// remember failure

					}
					if ( holeIndex >= 0 )	break;		// hole-vertex found

				}

			}

			return shape; 			/* shape with no holes */

		}


		var i, il, f, face,
			key, index,
			allPointsMap = {};

		// To maintain reference to old shape, one must match coordinates, or offset the indices from original arrays. It's probably easier to do the first.

		var allpoints = contour.concat();

		for ( var h = 0, hl = holes.length; h < hl; h ++ ) {

			Array.prototype.push.apply( allpoints, holes[ h ] );

		}

		//console.log( "allpoints",allpoints, allpoints.length );

		// prepare all points map

		for ( i = 0, il = allpoints.length; i < il; i ++ ) {

			key = allpoints[ i ].x + ":" + allpoints[ i ].y;

			if ( allPointsMap[ key ] !== undefined ) {

				console.warn( "THREE.Shape: Duplicate point", key );

			}

			allPointsMap[ key ] = i;

		}

		// remove holes by cutting paths to holes and adding them to the shape
		var shapeWithoutHoles = removeHoles( contour, holes );

		var triangles = THREE.ShapeUtils.triangulate( shapeWithoutHoles, false ); // True returns indices for points of spooled shape
		//console.log( "triangles",triangles, triangles.length );

		// check all face vertices against all points map

		for ( i = 0, il = triangles.length; i < il; i ++ ) {

			face = triangles[ i ];

			for ( f = 0; f < 3; f ++ ) {

				key = face[ f ].x + ":" + face[ f ].y;

				index = allPointsMap[ key ];

				if ( index !== undefined ) {

					face[ f ] = index;

				}

			}

		}

		return triangles.concat();

	},

	isClockWise: function ( pts ) {

		return THREE.ShapeUtils.area( pts ) < 0;

	},

	// Bezier Curves formulas obtained from
	// http://en.wikipedia.org/wiki/B%C3%A9zier_curve

	// Quad Bezier Functions

	b2: ( function () {

		function b2p0( t, p ) {

			var k = 1 - t;
			return k * k * p;

		}

		function b2p1( t, p ) {

			return 2 * ( 1 - t ) * t * p;

		}

		function b2p2( t, p ) {

			return t * t * p;

		}

		return function ( t, p0, p1, p2 ) {

			return b2p0( t, p0 ) + b2p1( t, p1 ) + b2p2( t, p2 );

		};

	} )(),

	// Cubic Bezier Functions

	b3: ( function () {

		function b3p0( t, p ) {

			var k = 1 - t;
			return k * k * k * p;

		}

		function b3p1( t, p ) {

			var k = 1 - t;
			return 3 * k * k * t * p;

		}

		function b3p2( t, p ) {

			var k = 1 - t;
			return 3 * k * t * t * p;

		}

		function b3p3( t, p ) {

			return t * t * t * p;

		}

		return function ( t, p0, p1, p2, p3 ) {

			return b3p0( t, p0 ) + b3p1( t, p1 ) + b3p2( t, p2 ) + b3p3( t, p3 );

		};

	} )()

};

// File:src/extras/core/Curve.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Extensible curve object
 *
 * Some common of Curve methods
 * .getPoint(t), getTangent(t)
 * .getPointAt(u), getTagentAt(u)
 * .getPoints(), .getSpacedPoints()
 * .getLength()
 * .updateArcLengths()
 *
 * This following classes subclasses THREE.Curve:
 *
 * -- 2d classes --
 * THREE.LineCurve
 * THREE.QuadraticBezierCurve
 * THREE.CubicBezierCurve
 * THREE.SplineCurve
 * THREE.ArcCurve
 * THREE.EllipseCurve
 *
 * -- 3d classes --
 * THREE.LineCurve3
 * THREE.QuadraticBezierCurve3
 * THREE.CubicBezierCurve3
 * THREE.SplineCurve3
 *
 * A series of curves can be represented as a THREE.CurvePath
 *
 **/

/**************************************************************
 *	Abstract Curve base class
 **************************************************************/

THREE.Curve = function () {

};

THREE.Curve.prototype = {

	constructor: THREE.Curve,

	// Virtual base class method to overwrite and implement in subclasses
	//	- t [0 .. 1]

	getPoint: function ( t ) {

		console.warn( "THREE.Curve: Warning, getPoint() not implemented!" );
		return null;

	},

	// Get point at relative position in curve according to arc length
	// - u [0 .. 1]

	getPointAt: function ( u ) {

		var t = this.getUtoTmapping( u );
		return this.getPoint( t );

	},

	// Get sequence of points using getPoint( t )

	getPoints: function ( divisions ) {

		if ( ! divisions ) divisions = 5;

		var d, pts = [];

		for ( d = 0; d <= divisions; d ++ ) {

			pts.push( this.getPoint( d / divisions ) );

		}

		return pts;

	},

	// Get sequence of points using getPointAt( u )

	getSpacedPoints: function ( divisions ) {

		if ( ! divisions ) divisions = 5;

		var d, pts = [];

		for ( d = 0; d <= divisions; d ++ ) {

			pts.push( this.getPointAt( d / divisions ) );

		}

		return pts;

	},

	// Get total curve arc length

	getLength: function () {

		var lengths = this.getLengths();
		return lengths[ lengths.length - 1 ];

	},

	// Get list of cumulative segment lengths

	getLengths: function ( divisions ) {

		if ( ! divisions ) divisions = ( this.__arcLengthDivisions ) ? ( this.__arcLengthDivisions ) : 200;

		if ( this.cacheArcLengths
			&& ( this.cacheArcLengths.length === divisions + 1 )
			&& ! this.needsUpdate ) {

			//console.log( "cached", this.cacheArcLengths );
			return this.cacheArcLengths;

		}

		this.needsUpdate = false;

		var cache = [];
		var current, last = this.getPoint( 0 );
		var p, sum = 0;

		cache.push( 0 );

		for ( p = 1; p <= divisions; p ++ ) {

			current = this.getPoint ( p / divisions );
			sum += current.distanceTo( last );
			cache.push( sum );
			last = current;

		}

		this.cacheArcLengths = cache;

		return cache; // { sums: cache, sum:sum }; Sum is in the last element.

	},

	updateArcLengths: function() {

		this.needsUpdate = true;
		this.getLengths();

	},

	// Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant

	getUtoTmapping: function ( u, distance ) {

		var arcLengths = this.getLengths();

		var i = 0, il = arcLengths.length;

		var targetArcLength; // The targeted u distance value to get

		if ( distance ) {

			targetArcLength = distance;

		} else {

			targetArcLength = u * arcLengths[ il - 1 ];

		}

		//var time = Date.now();

		// binary search for the index with largest value smaller than target u distance

		var low = 0, high = il - 1, comparison;

		while ( low <= high ) {

			i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

			comparison = arcLengths[ i ] - targetArcLength;

			if ( comparison < 0 ) {

				low = i + 1;

			} else if ( comparison > 0 ) {

				high = i - 1;

			} else {

				high = i;
				break;

				// DONE

			}

		}

		i = high;

		//console.log('b' , i, low, high, Date.now()- time);

		if ( arcLengths[ i ] === targetArcLength ) {

			var t = i / ( il - 1 );
			return t;

		}

		// we could get finer grain at lengths, or use simple interpolation between two points

		var lengthBefore = arcLengths[ i ];
		var lengthAfter = arcLengths[ i + 1 ];

		var segmentLength = lengthAfter - lengthBefore;

		// determine where we are between the 'before' and 'after' points

		var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

		// add that fractional amount to t

		var t = ( i + segmentFraction ) / ( il - 1 );

		return t;

	},

	// Returns a unit vector tangent at t
	// In case any sub curve does not implement its tangent derivation,
	// 2 points a small delta apart will be used to find its gradient
	// which seems to give a reasonable approximation

	getTangent: function( t ) {

		var delta = 0.0001;
		var t1 = t - delta;
		var t2 = t + delta;

		// Capping in case of danger

		if ( t1 < 0 ) t1 = 0;
		if ( t2 > 1 ) t2 = 1;

		var pt1 = this.getPoint( t1 );
		var pt2 = this.getPoint( t2 );

		var vec = pt2.clone().sub( pt1 );
		return vec.normalize();

	},

	getTangentAt: function ( u ) {

		var t = this.getUtoTmapping( u );
		return this.getTangent( t );

	}

};

// TODO: Transformation for Curves?

/**************************************************************
 *	3D Curves
 **************************************************************/

// A Factory method for creating new curve subclasses

THREE.Curve.create = function ( constructor, getPointFunc ) {

	constructor.prototype = Object.create( THREE.Curve.prototype );
	constructor.prototype.constructor = constructor;
	constructor.prototype.getPoint = getPointFunc;

	return constructor;

};

// File:src/extras/core/CurvePath.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/

/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/

THREE.CurvePath = function () {

	this.curves = [];

	this.autoClose = false; // Automatically closes the path

};

THREE.CurvePath.prototype = Object.assign( Object.create( THREE.Curve.prototype ), {

	constructor: THREE.CurvePath,

	add: function ( curve ) {

		this.curves.push( curve );

	},

	closePath: function () {

		// TODO Test
		// and verify for vector3 (needs to implement equals)
		// Add a line curve if start and end of lines are not connected
		var startPoint = this.curves[ 0 ].getPoint( 0 );
		var endPoint = this.curves[ this.curves.length - 1 ].getPoint( 1 );

		if ( ! startPoint.equals( endPoint ) ) {

			this.curves.push( new THREE.LineCurve( endPoint, startPoint ) );

		}

	},

	// To get accurate point with reference to
	// entire path distance at time t,
	// following has to be done:

	// 1. Length of each sub path have to be known
	// 2. Locate and identify type of curve
	// 3. Get t for the curve
	// 4. Return curve.getPointAt(t')

	getPoint: function ( t ) {

		var d = t * this.getLength();
		var curveLengths = this.getCurveLengths();
		var i = 0;

		// To think about boundaries points.

		while ( i < curveLengths.length ) {

			if ( curveLengths[ i ] >= d ) {

				var diff = curveLengths[ i ] - d;
				var curve = this.curves[ i ];

				var u = 1 - diff / curve.getLength();

				return curve.getPointAt( u );

			}

			i ++;

		}

		return null;

		// loop where sum != 0, sum > d , sum+1 <d

	},

	// We cannot use the default THREE.Curve getPoint() with getLength() because in
	// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
	// getPoint() depends on getLength

	getLength: function () {

		var lens = this.getCurveLengths();
		return lens[ lens.length - 1 ];

	},

	// Compute lengths and cache them
	// We cannot overwrite getLengths() because UtoT mapping uses it.

	getCurveLengths: function () {

		// We use cache values if curves and cache array are same length

		if ( this.cacheLengths && this.cacheLengths.length === this.curves.length ) {

			return this.cacheLengths;

		}

		// Get length of sub-curve
		// Push sums into cached array

		var lengths = [], sums = 0;

		for ( var i = 0, l = this.curves.length; i < l; i ++ ) {

			sums += this.curves[ i ].getLength();
			lengths.push( sums );

		}

		this.cacheLengths = lengths;

		return lengths;

	},

	/**************************************************************
	 *	Create Geometries Helpers
	 **************************************************************/

	/// Generate geometry from path points (for Line or Points objects)

	createPointsGeometry: function ( divisions ) {

		var pts = this.getPoints( divisions );
		return this.createGeometry( pts );

	},

	// Generate geometry from equidistant sampling along the path

	createSpacedPointsGeometry: function ( divisions ) {

		var pts = this.getSpacedPoints( divisions );
		return this.createGeometry( pts );

	},

	createGeometry: function ( points ) {

		var geometry = new THREE.Geometry();

		for ( var i = 0, l = points.length; i < l; i ++ ) {

			var point = points[ i ];
			geometry.vertices.push( new THREE.Vector3( point.x, point.y, point.z || 0 ) );

		}

		return geometry;

	}

} );

// File:src/extras/core/Font.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Font = function ( data ) {

	this.data = data;

};

Object.assign( THREE.Font.prototype, {

	generateShapes: function ( text, size, divisions ) {

		function createPaths( text ) {

			var chars = String( text ).split( '' );
			var scale = size / data.resolution;
			var offset = 0;

			var paths = [];

			for ( var i = 0; i < chars.length; i ++ ) {

				var ret = createPath( chars[ i ], scale, offset );
				offset += ret.offset;

				paths.push( ret.path );

			}

			return paths;

		}

		function createPath( c, scale, offset ) {

			var glyph = data.glyphs[ c ] || data.glyphs[ '?' ];

			if ( ! glyph ) return;

			var path = new THREE.Path();

			var pts = [], b2 = THREE.ShapeUtils.b2, b3 = THREE.ShapeUtils.b3;
			var x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2, laste;

			if ( glyph.o ) {

				var outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );

				for ( var i = 0, l = outline.length; i < l; ) {

					var action = outline[ i ++ ];

					switch ( action ) {

						case 'm': // moveTo

							x = outline[ i ++ ] * scale + offset;
							y = outline[ i ++ ] * scale;

							path.moveTo( x, y );

							break;

						case 'l': // lineTo

							x = outline[ i ++ ] * scale + offset;
							y = outline[ i ++ ] * scale;

							path.lineTo( x, y );

							break;

						case 'q': // quadraticCurveTo

							cpx  = outline[ i ++ ] * scale + offset;
							cpy  = outline[ i ++ ] * scale;
							cpx1 = outline[ i ++ ] * scale + offset;
							cpy1 = outline[ i ++ ] * scale;

							path.quadraticCurveTo( cpx1, cpy1, cpx, cpy );

							laste = pts[ pts.length - 1 ];

							if ( laste ) {

								cpx0 = laste.x;
								cpy0 = laste.y;

								for ( var i2 = 1; i2 <= divisions; i2 ++ ) {

									var t = i2 / divisions;
									b2( t, cpx0, cpx1, cpx );
									b2( t, cpy0, cpy1, cpy );

								}

							}

							break;

						case 'b': // bezierCurveTo

							cpx  = outline[ i ++ ] * scale + offset;
							cpy  = outline[ i ++ ] * scale;
							cpx1 = outline[ i ++ ] * scale + offset;
							cpy1 = outline[ i ++ ] * scale;
							cpx2 = outline[ i ++ ] * scale + offset;
							cpy2 = outline[ i ++ ] * scale;

							path.bezierCurveTo( cpx1, cpy1, cpx2, cpy2, cpx, cpy );

							laste = pts[ pts.length - 1 ];

							if ( laste ) {

								cpx0 = laste.x;
								cpy0 = laste.y;

								for ( var i2 = 1; i2 <= divisions; i2 ++ ) {

									var t = i2 / divisions;
									b3( t, cpx0, cpx1, cpx2, cpx );
									b3( t, cpy0, cpy1, cpy2, cpy );

								}

							}

							break;

					}

				}

			}

			return { offset: glyph.ha * scale, path: path };

		}

		//

		if ( size === undefined ) size = 100;
		if ( divisions === undefined ) divisions = 4;

		var data = this.data;

		var paths = createPaths( text );
		var shapes = [];

		for ( var p = 0, pl = paths.length; p < pl; p ++ ) {

			Array.prototype.push.apply( shapes, paths[ p ].toShapes() );

		}

		return shapes;

	}

} );

// File:src/extras/core/Path.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 *
 **/

THREE.Path = function ( points ) {

	THREE.CurvePath.call( this );

	this.actions = [];

	if ( points ) {

		this.fromPoints( points );

	}

};

THREE.Path.prototype = Object.assign( Object.create( THREE.CurvePath.prototype ), {

	constructor: THREE.Path,

	// TODO Clean up PATH API

	// Create path using straight lines to connect all points
	// - vectors: array of Vector2

	fromPoints: function ( vectors ) {

		this.moveTo( vectors[ 0 ].x, vectors[ 0 ].y );

		for ( var i = 1, l = vectors.length; i < l; i ++ ) {

			this.lineTo( vectors[ i ].x, vectors[ i ].y );

		}

	},

	moveTo: function ( x, y ) {

		this.actions.push( { action: 'moveTo', args: [ x, y ] } );

	},

	lineTo: function ( x, y ) {

		var lastargs = this.actions[ this.actions.length - 1 ].args;

		var x0 = lastargs[ lastargs.length - 2 ];
		var y0 = lastargs[ lastargs.length - 1 ];

		var curve = new THREE.LineCurve( new THREE.Vector2( x0, y0 ), new THREE.Vector2( x, y ) );
		this.curves.push( curve );

		this.actions.push( { action: 'lineTo', args: [ x, y ] } );

	},

	quadraticCurveTo: function ( aCPx, aCPy, aX, aY ) {

		var lastargs = this.actions[ this.actions.length - 1 ].args;

		var x0 = lastargs[ lastargs.length - 2 ];
		var y0 = lastargs[ lastargs.length - 1 ];

		var curve = new THREE.QuadraticBezierCurve(
			new THREE.Vector2( x0, y0 ),
			new THREE.Vector2( aCPx, aCPy ),
			new THREE.Vector2( aX, aY )
		);

		this.curves.push( curve );

		this.actions.push( { action: 'quadraticCurveTo', args: [ aCPx, aCPy, aX, aY ] } );

	},

	bezierCurveTo: function ( aCP1x, aCP1y, aCP2x, aCP2y, aX, aY ) {

		var lastargs = this.actions[ this.actions.length - 1 ].args;

		var x0 = lastargs[ lastargs.length - 2 ];
		var y0 = lastargs[ lastargs.length - 1 ];

		var curve = new THREE.CubicBezierCurve(
			new THREE.Vector2( x0, y0 ),
			new THREE.Vector2( aCP1x, aCP1y ),
			new THREE.Vector2( aCP2x, aCP2y ),
			new THREE.Vector2( aX, aY )
		);

		this.curves.push( curve );

		this.actions.push( { action: 'bezierCurveTo', args: [ aCP1x, aCP1y, aCP2x, aCP2y, aX, aY ] } );

	},

	splineThru: function ( pts /*Array of Vector*/ ) {

		var args = Array.prototype.slice.call( arguments );

		var lastargs = this.actions[ this.actions.length - 1 ].args;

		var x0 = lastargs[ lastargs.length - 2 ];
		var y0 = lastargs[ lastargs.length - 1 ];

		var npts = [ new THREE.Vector2( x0, y0 ) ];
		Array.prototype.push.apply( npts, pts );

		var curve = new THREE.SplineCurve( npts );
		this.curves.push( curve );

		this.actions.push( { action: 'splineThru', args: args } );

	},

	arc: function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

		var lastargs = this.actions[ this.actions.length - 1 ].args;
		var x0 = lastargs[ lastargs.length - 2 ];
		var y0 = lastargs[ lastargs.length - 1 ];

		this.absarc( aX + x0, aY + y0, aRadius,
			aStartAngle, aEndAngle, aClockwise );

	},

	absarc: function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

		this.absellipse( aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );

	},

	ellipse: function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

		var lastargs = this.actions[ this.actions.length - 1 ].args;
		var x0 = lastargs[ lastargs.length - 2 ];
		var y0 = lastargs[ lastargs.length - 1 ];

		this.absellipse( aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation );

	},

	absellipse: function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

		var args = [
			aX, aY,
			xRadius, yRadius,
			aStartAngle, aEndAngle,
			aClockwise,
			aRotation || 0 // aRotation is optional.
		];

		var curve = new THREE.EllipseCurve( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation );
		this.curves.push( curve );

		var lastPoint = curve.getPoint( 1 );
		args.push( lastPoint.x );
		args.push( lastPoint.y );

		this.actions.push( { action: 'ellipse', args: args } );

	},

	getSpacedPoints: function ( divisions ) {

		if ( ! divisions ) divisions = 40;

		var points = [];

		for ( var i = 0; i < divisions; i ++ ) {

			points.push( this.getPoint( i / divisions ) );

			//if ( !this.getPoint( i / divisions ) ) throw "DIE";

		}

		if ( this.autoClose ) {

			points.push( points[ 0 ] );

		}

		return points;

	},

	getPoints: function ( divisions ) {

		divisions = divisions || 12;

		var b2 = THREE.ShapeUtils.b2;
		var b3 = THREE.ShapeUtils.b3;

		var points = [];

		var cpx, cpy, cpx2, cpy2, cpx1, cpy1, cpx0, cpy0,
			laste, tx, ty;

		for ( var i = 0, l = this.actions.length; i < l; i ++ ) {

			var item = this.actions[ i ];

			var action = item.action;
			var args = item.args;

			switch ( action ) {

			case 'moveTo':

				points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

				break;

			case 'lineTo':

				points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

				break;

			case 'quadraticCurveTo':

				cpx  = args[ 2 ];
				cpy  = args[ 3 ];

				cpx1 = args[ 0 ];
				cpy1 = args[ 1 ];

				if ( points.length > 0 ) {

					laste = points[ points.length - 1 ];

					cpx0 = laste.x;
					cpy0 = laste.y;

				} else {

					laste = this.actions[ i - 1 ].args;

					cpx0 = laste[ laste.length - 2 ];
					cpy0 = laste[ laste.length - 1 ];

				}

				for ( var j = 1; j <= divisions; j ++ ) {

					var t = j / divisions;

					tx = b2( t, cpx0, cpx1, cpx );
					ty = b2( t, cpy0, cpy1, cpy );

					points.push( new THREE.Vector2( tx, ty ) );

				}

				break;

			case 'bezierCurveTo':

				cpx  = args[ 4 ];
				cpy  = args[ 5 ];

				cpx1 = args[ 0 ];
				cpy1 = args[ 1 ];

				cpx2 = args[ 2 ];
				cpy2 = args[ 3 ];

				if ( points.length > 0 ) {

					laste = points[ points.length - 1 ];

					cpx0 = laste.x;
					cpy0 = laste.y;

				} else {

					laste = this.actions[ i - 1 ].args;

					cpx0 = laste[ laste.length - 2 ];
					cpy0 = laste[ laste.length - 1 ];

				}


				for ( var j = 1; j <= divisions; j ++ ) {

					var t = j / divisions;

					tx = b3( t, cpx0, cpx1, cpx2, cpx );
					ty = b3( t, cpy0, cpy1, cpy2, cpy );

					points.push( new THREE.Vector2( tx, ty ) );

				}

				break;

			case 'splineThru':

				laste = this.actions[ i - 1 ].args;

				var last = new THREE.Vector2( laste[ laste.length - 2 ], laste[ laste.length - 1 ] );
				var spts = [ last ];

				var n = divisions * args[ 0 ].length;

				spts = spts.concat( args[ 0 ] );

				var spline = new THREE.SplineCurve( spts );

				for ( var j = 1; j <= n; j ++ ) {

					points.push( spline.getPointAt( j / n ) );

				}

				break;

			case 'arc':

				var aX = args[ 0 ], aY = args[ 1 ],
					aRadius = args[ 2 ],
					aStartAngle = args[ 3 ], aEndAngle = args[ 4 ],
					aClockwise = !! args[ 5 ];

				var deltaAngle = aEndAngle - aStartAngle;
				var angle;
				var tdivisions = divisions * 2;

				for ( var j = 1; j <= tdivisions; j ++ ) {

					var t = j / tdivisions;

					if ( ! aClockwise ) {

						t = 1 - t;

					}

					angle = aStartAngle + t * deltaAngle;

					tx = aX + aRadius * Math.cos( angle );
					ty = aY + aRadius * Math.sin( angle );

					//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

					points.push( new THREE.Vector2( tx, ty ) );

				}

				//console.log(points);

				break;

			case 'ellipse':

				var aX = args[ 0 ], aY = args[ 1 ],
					xRadius = args[ 2 ],
					yRadius = args[ 3 ],
					aStartAngle = args[ 4 ], aEndAngle = args[ 5 ],
					aClockwise = !! args[ 6 ],
					aRotation = args[ 7 ];


				var deltaAngle = aEndAngle - aStartAngle;
				var angle;
				var tdivisions = divisions * 2;

				var cos, sin;
				if ( aRotation !== 0 ) {

					cos = Math.cos( aRotation );
					sin = Math.sin( aRotation );

				}

				for ( var j = 1; j <= tdivisions; j ++ ) {

					var t = j / tdivisions;

					if ( ! aClockwise ) {

						t = 1 - t;

					}

					angle = aStartAngle + t * deltaAngle;

					tx = aX + xRadius * Math.cos( angle );
					ty = aY + yRadius * Math.sin( angle );

					if ( aRotation !== 0 ) {

						var x = tx, y = ty;

						// Rotate the point about the center of the ellipse.
						tx = ( x - aX ) * cos - ( y - aY ) * sin + aX;
						ty = ( x - aX ) * sin + ( y - aY ) * cos + aY;

					}

					//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

					points.push( new THREE.Vector2( tx, ty ) );

				}

				//console.log(points);

				break;

			} // end switch

		}



		// Normalize to remove the closing point by default.
		var lastPoint = points[ points.length - 1 ];
		if ( Math.abs( lastPoint.x - points[ 0 ].x ) < Number.EPSILON &&
				 Math.abs( lastPoint.y - points[ 0 ].y ) < Number.EPSILON )
			points.splice( points.length - 1, 1 );

		if ( this.autoClose ) {

			points.push( points[ 0 ] );

		}

		return points;

	},

	toShapes: function ( isCCW, noHoles ) {

		function extractSubpaths( inActions ) {

			var subPaths = [], lastPath = new THREE.Path();

			for ( var i = 0, l = inActions.length; i < l; i ++ ) {

				var item = inActions[ i ];

				var args = item.args;
				var action = item.action;

				if ( action === 'moveTo' ) {

					if ( lastPath.actions.length !== 0 ) {

						subPaths.push( lastPath );
						lastPath = new THREE.Path();

					}

				}

				lastPath[ action ].apply( lastPath, args );

			}

			if ( lastPath.actions.length !== 0 ) {

				subPaths.push( lastPath );

			}

			// console.log(subPaths);

			return	subPaths;

		}

		function toShapesNoHoles( inSubpaths ) {

			var shapes = [];

			for ( var i = 0, l = inSubpaths.length; i < l; i ++ ) {

				var tmpPath = inSubpaths[ i ];

				var tmpShape = new THREE.Shape();
				tmpShape.actions = tmpPath.actions;
				tmpShape.curves = tmpPath.curves;

				shapes.push( tmpShape );

			}

			//console.log("shape", shapes);

			return shapes;

		}

		function isPointInsidePolygon( inPt, inPolygon ) {

			var polyLen = inPolygon.length;

			// inPt on polygon contour => immediate success    or
			// toggling of inside/outside at every single! intersection point of an edge
			//  with the horizontal line through inPt, left of inPt
			//  not counting lowerY endpoints of edges and whole edges on that line
			var inside = false;
			for ( var p = polyLen - 1, q = 0; q < polyLen; p = q ++ ) {

				var edgeLowPt  = inPolygon[ p ];
				var edgeHighPt = inPolygon[ q ];

				var edgeDx = edgeHighPt.x - edgeLowPt.x;
				var edgeDy = edgeHighPt.y - edgeLowPt.y;

				if ( Math.abs( edgeDy ) > Number.EPSILON ) {

					// not parallel
					if ( edgeDy < 0 ) {

						edgeLowPt  = inPolygon[ q ]; edgeDx = - edgeDx;
						edgeHighPt = inPolygon[ p ]; edgeDy = - edgeDy;

					}
					if ( ( inPt.y < edgeLowPt.y ) || ( inPt.y > edgeHighPt.y ) ) 		continue;

					if ( inPt.y === edgeLowPt.y ) {

						if ( inPt.x === edgeLowPt.x )		return	true;		// inPt is on contour ?
						// continue;				// no intersection or edgeLowPt => doesn't count !!!

					} else {

						var perpEdge = edgeDy * ( inPt.x - edgeLowPt.x ) - edgeDx * ( inPt.y - edgeLowPt.y );
						if ( perpEdge === 0 )				return	true;		// inPt is on contour ?
						if ( perpEdge < 0 ) 				continue;
						inside = ! inside;		// true intersection left of inPt

					}

				} else {

					// parallel or collinear
					if ( inPt.y !== edgeLowPt.y ) 		continue;			// parallel
					// edge lies on the same horizontal line as inPt
					if ( ( ( edgeHighPt.x <= inPt.x ) && ( inPt.x <= edgeLowPt.x ) ) ||
						 ( ( edgeLowPt.x <= inPt.x ) && ( inPt.x <= edgeHighPt.x ) ) )		return	true;	// inPt: Point on contour !
					// continue;

				}

			}

			return	inside;

		}

		var isClockWise = THREE.ShapeUtils.isClockWise;

		var subPaths = extractSubpaths( this.actions );
		if ( subPaths.length === 0 ) return [];

		if ( noHoles === true )	return	toShapesNoHoles( subPaths );


		var solid, tmpPath, tmpShape, shapes = [];

		if ( subPaths.length === 1 ) {

			tmpPath = subPaths[ 0 ];
			tmpShape = new THREE.Shape();
			tmpShape.actions = tmpPath.actions;
			tmpShape.curves = tmpPath.curves;
			shapes.push( tmpShape );
			return shapes;

		}

		var holesFirst = ! isClockWise( subPaths[ 0 ].getPoints() );
		holesFirst = isCCW ? ! holesFirst : holesFirst;

		// console.log("Holes first", holesFirst);

		var betterShapeHoles = [];
		var newShapes = [];
		var newShapeHoles = [];
		var mainIdx = 0;
		var tmpPoints;

		newShapes[ mainIdx ] = undefined;
		newShapeHoles[ mainIdx ] = [];

		for ( var i = 0, l = subPaths.length; i < l; i ++ ) {

			tmpPath = subPaths[ i ];
			tmpPoints = tmpPath.getPoints();
			solid = isClockWise( tmpPoints );
			solid = isCCW ? ! solid : solid;

			if ( solid ) {

				if ( ( ! holesFirst ) && ( newShapes[ mainIdx ] ) )	mainIdx ++;

				newShapes[ mainIdx ] = { s: new THREE.Shape(), p: tmpPoints };
				newShapes[ mainIdx ].s.actions = tmpPath.actions;
				newShapes[ mainIdx ].s.curves = tmpPath.curves;

				if ( holesFirst )	mainIdx ++;
				newShapeHoles[ mainIdx ] = [];

				//console.log('cw', i);

			} else {

				newShapeHoles[ mainIdx ].push( { h: tmpPath, p: tmpPoints[ 0 ] } );

				//console.log('ccw', i);

			}

		}

		// only Holes? -> probably all Shapes with wrong orientation
		if ( ! newShapes[ 0 ] )	return	toShapesNoHoles( subPaths );


		if ( newShapes.length > 1 ) {

			var ambiguous = false;
			var toChange = [];

			for ( var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {

				betterShapeHoles[ sIdx ] = [];

			}

			for ( var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {

				var sho = newShapeHoles[ sIdx ];

				for ( var hIdx = 0; hIdx < sho.length; hIdx ++ ) {

					var ho = sho[ hIdx ];
					var hole_unassigned = true;

					for ( var s2Idx = 0; s2Idx < newShapes.length; s2Idx ++ ) {

						if ( isPointInsidePolygon( ho.p, newShapes[ s2Idx ].p ) ) {

							if ( sIdx !== s2Idx )	toChange.push( { froms: sIdx, tos: s2Idx, hole: hIdx } );
							if ( hole_unassigned ) {

								hole_unassigned = false;
								betterShapeHoles[ s2Idx ].push( ho );

							} else {

								ambiguous = true;

							}

						}

					}
					if ( hole_unassigned ) {

						betterShapeHoles[ sIdx ].push( ho );

					}

				}

			}
			// console.log("ambiguous: ", ambiguous);
			if ( toChange.length > 0 ) {

				// console.log("to change: ", toChange);
				if ( ! ambiguous )	newShapeHoles = betterShapeHoles;

			}

		}

		var tmpHoles;

		for ( var i = 0, il = newShapes.length; i < il; i ++ ) {

			tmpShape = newShapes[ i ].s;
			shapes.push( tmpShape );
			tmpHoles = newShapeHoles[ i ];

			for ( var j = 0, jl = tmpHoles.length; j < jl; j ++ ) {

				tmpShape.holes.push( tmpHoles[ j ].h );

			}

		}

		//console.log("shape", shapes);

		return shapes;

	}

} );

// File:src/extras/core/Shape.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/

// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.

THREE.Shape = function () {

	THREE.Path.apply( this, arguments );

	this.holes = [];

};

THREE.Shape.prototype = Object.assign( Object.create( THREE.Path.prototype ), {

	constructor: THREE.Shape,

	// Convenience method to return ExtrudeGeometry

	extrude: function ( options ) {

		return new THREE.ExtrudeGeometry( this, options );

	},

	// Convenience method to return ShapeGeometry

	makeGeometry: function ( options ) {

		return new THREE.ShapeGeometry( this, options );

	},

	getPointsHoles: function ( divisions ) {

		var holesPts = [];

		for ( var i = 0, l = this.holes.length; i < l; i ++ ) {

			holesPts[ i ] = this.holes[ i ].getPoints( divisions );

		}

		return holesPts;

	},

	// Get points of shape and holes (keypoints based on segments parameter)

	extractAllPoints: function ( divisions ) {

		return {

			shape: this.getPoints( divisions ),
			holes: this.getPointsHoles( divisions )

		};

	},

	extractPoints: function ( divisions ) {

		return this.extractAllPoints( divisions );

	}

} );

// File:src/extras/curves/LineCurve.js

/**************************************************************
 *	Line
 **************************************************************/

THREE.LineCurve = function ( v1, v2 ) {

	this.v1 = v1;
	this.v2 = v2;

};

THREE.LineCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.LineCurve.prototype.constructor = THREE.LineCurve;

THREE.LineCurve.prototype.getPoint = function ( t ) {

	var point = this.v2.clone().sub( this.v1 );
	point.multiplyScalar( t ).add( this.v1 );

	return point;

};

// Line curve is linear, so we can overwrite default getPointAt

THREE.LineCurve.prototype.getPointAt = function ( u ) {

	return this.getPoint( u );

};

THREE.LineCurve.prototype.getTangent = function( t ) {

	var tangent = this.v2.clone().sub( this.v1 );

	return tangent.normalize();

};

// File:src/extras/curves/QuadraticBezierCurve.js

/**************************************************************
 *	Quadratic Bezier curve
 **************************************************************/


THREE.QuadraticBezierCurve = function ( v0, v1, v2 ) {

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

};

THREE.QuadraticBezierCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.QuadraticBezierCurve.prototype.constructor = THREE.QuadraticBezierCurve;


THREE.QuadraticBezierCurve.prototype.getPoint = function ( t ) {

	var b2 = THREE.ShapeUtils.b2;

	return new THREE.Vector2(
		b2( t, this.v0.x, this.v1.x, this.v2.x ),
		b2( t, this.v0.y, this.v1.y, this.v2.y )
	);

};


THREE.QuadraticBezierCurve.prototype.getTangent = function( t ) {

	var tangentQuadraticBezier = THREE.CurveUtils.tangentQuadraticBezier;

	return new THREE.Vector2(
		tangentQuadraticBezier( t, this.v0.x, this.v1.x, this.v2.x ),
		tangentQuadraticBezier( t, this.v0.y, this.v1.y, this.v2.y )
	).normalize();

};

// File:src/extras/curves/CubicBezierCurve.js

/**************************************************************
 *	Cubic Bezier curve
 **************************************************************/

THREE.CubicBezierCurve = function ( v0, v1, v2, v3 ) {

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;

};

THREE.CubicBezierCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.CubicBezierCurve.prototype.constructor = THREE.CubicBezierCurve;

THREE.CubicBezierCurve.prototype.getPoint = function ( t ) {

	var b3 = THREE.ShapeUtils.b3;

	return new THREE.Vector2( 
		b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x ),
		b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y )
	);

};

THREE.CubicBezierCurve.prototype.getTangent = function( t ) {

	var tangentCubicBezier = THREE.CurveUtils.tangentCubicBezier;

	return new THREE.Vector2( 
		tangentCubicBezier( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x ),
		tangentCubicBezier( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y )
	).normalize();

};

// File:src/extras/curves/SplineCurve.js

/**************************************************************
 *	Spline curve
 **************************************************************/

THREE.SplineCurve = function ( points /* array of Vector2 */ ) {

	this.points = ( points == undefined ) ? [] : points;

};

THREE.SplineCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.SplineCurve.prototype.constructor = THREE.SplineCurve;

THREE.SplineCurve.prototype.getPoint = function ( t ) {

	var points = this.points;
	var point = ( points.length - 1 ) * t;

	var intPoint = Math.floor( point );
	var weight = point - intPoint;

	var point0 = points[ intPoint === 0 ? intPoint : intPoint - 1 ];
	var point1 = points[ intPoint ];
	var point2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
	var point3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

	var interpolate = THREE.CurveUtils.interpolate;

	return new THREE.Vector2(
		interpolate( point0.x, point1.x, point2.x, point3.x, weight ),
		interpolate( point0.y, point1.y, point2.y, point3.y, weight )
	);

};

// File:src/extras/curves/EllipseCurve.js

/**************************************************************
 *	Ellipse curve
 **************************************************************/

THREE.EllipseCurve = function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

	this.aX = aX;
	this.aY = aY;

	this.xRadius = xRadius;
	this.yRadius = yRadius;

	this.aStartAngle = aStartAngle;
	this.aEndAngle = aEndAngle;

	this.aClockwise = aClockwise;
	
	this.aRotation = aRotation || 0;

};

THREE.EllipseCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.EllipseCurve.prototype.constructor = THREE.EllipseCurve;

THREE.EllipseCurve.prototype.getPoint = function ( t ) {

	var deltaAngle = this.aEndAngle - this.aStartAngle;

	if ( deltaAngle < 0 ) deltaAngle += Math.PI * 2;
	if ( deltaAngle > Math.PI * 2 ) deltaAngle -= Math.PI * 2;

	var angle;

	if ( this.aClockwise === true ) {

		angle = this.aEndAngle + ( 1 - t ) * ( Math.PI * 2 - deltaAngle );

	} else {

		angle = this.aStartAngle + t * deltaAngle;

	}
	
	var x = this.aX + this.xRadius * Math.cos( angle );
	var y = this.aY + this.yRadius * Math.sin( angle );

	if ( this.aRotation !== 0 ) {

		var cos = Math.cos( this.aRotation );
		var sin = Math.sin( this.aRotation );

		var tx = x, ty = y;

		// Rotate the point about the center of the ellipse.
		x = ( tx - this.aX ) * cos - ( ty - this.aY ) * sin + this.aX;
		y = ( tx - this.aX ) * sin + ( ty - this.aY ) * cos + this.aY;

	}

	return new THREE.Vector2( x, y );

};

// File:src/extras/curves/ArcCurve.js

/**************************************************************
 *	Arc curve
 **************************************************************/

THREE.ArcCurve = function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

	THREE.EllipseCurve.call( this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );

};

THREE.ArcCurve.prototype = Object.create( THREE.EllipseCurve.prototype );
THREE.ArcCurve.prototype.constructor = THREE.ArcCurve;

// File:src/extras/curves/LineCurve3.js

/**************************************************************
 *	Line3D
 **************************************************************/

THREE.LineCurve3 = THREE.Curve.create(

	function ( v1, v2 ) {

		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var vector = new THREE.Vector3();

		vector.subVectors( this.v2, this.v1 ); // diff
		vector.multiplyScalar( t );
		vector.add( this.v1 );

		return vector;

	}

);

// File:src/extras/curves/QuadraticBezierCurve3.js

/**************************************************************
 *	Quadratic Bezier 3D curve
 **************************************************************/

THREE.QuadraticBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var b2 = THREE.ShapeUtils.b2;		

		return new THREE.Vector3(
			b2( t, this.v0.x, this.v1.x, this.v2.x ),
			b2( t, this.v0.y, this.v1.y, this.v2.y ),
			b2( t, this.v0.z, this.v1.z, this.v2.z )
		);

	}

);

// File:src/extras/curves/CubicBezierCurve3.js

/**************************************************************
 *	Cubic Bezier 3D curve
 **************************************************************/

THREE.CubicBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2, v3 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;

	},

	function ( t ) {

		var b3 = THREE.ShapeUtils.b3;

		return new THREE.Vector3(
			b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x ),
			b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y ),
			b3( t, this.v0.z, this.v1.z, this.v2.z, this.v3.z )
		);

	}

);

// File:src/extras/curves/SplineCurve3.js

/**************************************************************
 *	Spline 3D curve
 **************************************************************/


THREE.SplineCurve3 = THREE.Curve.create(

	function ( points /* array of Vector3 */ ) {

		console.warn( 'THREE.SplineCurve3 will be deprecated. Please use THREE.CatmullRomCurve3' );
		this.points = ( points == undefined ) ? [] : points;

	},

	function ( t ) {

		var points = this.points;
		var point = ( points.length - 1 ) * t;

		var intPoint = Math.floor( point );
		var weight = point - intPoint;

		var point0 = points[ intPoint == 0 ? intPoint : intPoint - 1 ];
		var point1 = points[ intPoint ];
		var point2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
		var point3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

		var interpolate = THREE.CurveUtils.interpolate;

		return new THREE.Vector3(
			interpolate( point0.x, point1.x, point2.x, point3.x, weight ),
			interpolate( point0.y, point1.y, point2.y, point3.y, weight ),
			interpolate( point0.z, point1.z, point2.z, point3.z, weight )
		);

	}

);

// File:src/extras/curves/CatmullRomCurve3.js

/**
 * @author zz85 https://github.com/zz85
 *
 * Centripetal CatmullRom Curve - which is useful for avoiding
 * cusps and self-intersections in non-uniform catmull rom curves.
 * http://www.cemyuksel.com/research/catmullrom_param/catmullrom.pdf
 *
 * curve.type accepts centripetal(default), chordal and catmullrom
 * curve.tension is used for catmullrom which defaults to 0.5
 */

THREE.CatmullRomCurve3 = ( function() {

	var
		tmp = new THREE.Vector3(),
		px = new CubicPoly(),
		py = new CubicPoly(),
		pz = new CubicPoly();

	/*
	Based on an optimized c++ solution in
	 - http://stackoverflow.com/questions/9489736/catmull-rom-curve-with-no-cusps-and-no-self-intersections/
	 - http://ideone.com/NoEbVM

	This CubicPoly class could be used for reusing some variables and calculations,
	but for three.js curve use, it could be possible inlined and flatten into a single function call
	which can be placed in CurveUtils.
	*/

	function CubicPoly() {

	}

	/*
	 * Compute coefficients for a cubic polynomial
	 *   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
	 * such that
	 *   p(0) = x0, p(1) = x1
	 *  and
	 *   p'(0) = t0, p'(1) = t1.
	 */
	CubicPoly.prototype.init = function( x0, x1, t0, t1 ) {

		this.c0 = x0;
		this.c1 = t0;
		this.c2 = - 3 * x0 + 3 * x1 - 2 * t0 - t1;
		this.c3 = 2 * x0 - 2 * x1 + t0 + t1;

	};

	CubicPoly.prototype.initNonuniformCatmullRom = function( x0, x1, x2, x3, dt0, dt1, dt2 ) {

		// compute tangents when parameterized in [t1,t2]
		var t1 = ( x1 - x0 ) / dt0 - ( x2 - x0 ) / ( dt0 + dt1 ) + ( x2 - x1 ) / dt1;
		var t2 = ( x2 - x1 ) / dt1 - ( x3 - x1 ) / ( dt1 + dt2 ) + ( x3 - x2 ) / dt2;

		// rescale tangents for parametrization in [0,1]
		t1 *= dt1;
		t2 *= dt1;

		// initCubicPoly
		this.init( x1, x2, t1, t2 );

	};

	// standard Catmull-Rom spline: interpolate between x1 and x2 with previous/following points x1/x4
	CubicPoly.prototype.initCatmullRom = function( x0, x1, x2, x3, tension ) {

		this.init( x1, x2, tension * ( x2 - x0 ), tension * ( x3 - x1 ) );

	};

	CubicPoly.prototype.calc = function( t ) {

		var t2 = t * t;
		var t3 = t2 * t;
		return this.c0 + this.c1 * t + this.c2 * t2 + this.c3 * t3;

	};

	// Subclass Three.js curve
	return THREE.Curve.create(

		function ( p /* array of Vector3 */ ) {

			this.points = p || [];
			this.closed = false;

		},

		function ( t ) {

			var points = this.points,
				point, intPoint, weight, l;

			l = points.length;

			if ( l < 2 ) console.log( 'duh, you need at least 2 points' );

			point = ( l - ( this.closed ? 0 : 1 ) ) * t;
			intPoint = Math.floor( point );
			weight = point - intPoint;

			if ( this.closed ) {

				intPoint += intPoint > 0 ? 0 : ( Math.floor( Math.abs( intPoint ) / points.length ) + 1 ) * points.length;

			} else if ( weight === 0 && intPoint === l - 1 ) {

				intPoint = l - 2;
				weight = 1;

			}

			var p0, p1, p2, p3; // 4 points

			if ( this.closed || intPoint > 0 ) {

				p0 = points[ ( intPoint - 1 ) % l ];

			} else {

				// extrapolate first point
				tmp.subVectors( points[ 0 ], points[ 1 ] ).add( points[ 0 ] );
				p0 = tmp;

			}

			p1 = points[ intPoint % l ];
			p2 = points[ ( intPoint + 1 ) % l ];

			if ( this.closed || intPoint + 2 < l ) {

				p3 = points[ ( intPoint + 2 ) % l ];

			} else {

				// extrapolate last point
				tmp.subVectors( points[ l - 1 ], points[ l - 2 ] ).add( points[ l - 1 ] );
				p3 = tmp;

			}

			if ( this.type === undefined || this.type === 'centripetal' || this.type === 'chordal' ) {

				// init Centripetal / Chordal Catmull-Rom
				var pow = this.type === 'chordal' ? 0.5 : 0.25;
				var dt0 = Math.pow( p0.distanceToSquared( p1 ), pow );
				var dt1 = Math.pow( p1.distanceToSquared( p2 ), pow );
				var dt2 = Math.pow( p2.distanceToSquared( p3 ), pow );

				// safety check for repeated points
				if ( dt1 < 1e-4 ) dt1 = 1.0;
				if ( dt0 < 1e-4 ) dt0 = dt1;
				if ( dt2 < 1e-4 ) dt2 = dt1;

				px.initNonuniformCatmullRom( p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2 );
				py.initNonuniformCatmullRom( p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2 );
				pz.initNonuniformCatmullRom( p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2 );

			} else if ( this.type === 'catmullrom' ) {

				var tension = this.tension !== undefined ? this.tension : 0.5;
				px.initCatmullRom( p0.x, p1.x, p2.x, p3.x, tension );
				py.initCatmullRom( p0.y, p1.y, p2.y, p3.y, tension );
				pz.initCatmullRom( p0.z, p1.z, p2.z, p3.z, tension );

			}

			var v = new THREE.Vector3(
				px.calc( weight ),
				py.calc( weight ),
				pz.calc( weight )
			);

			return v;

		}

	);

} )();

// File:src/extras/curves/ClosedSplineCurve3.js

/**************************************************************
 *	Closed Spline 3D curve
 **************************************************************/


THREE.ClosedSplineCurve3 = function ( points ) {

	console.warn( 'THREE.ClosedSplineCurve3 has been deprecated. Please use THREE.CatmullRomCurve3.' );

	THREE.CatmullRomCurve3.call( this, points );
	this.type = 'catmullrom';
	this.closed = true;

};

THREE.ClosedSplineCurve3.prototype = Object.create( THREE.CatmullRomCurve3.prototype );

// File:src/extras/geometries/BoxGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

THREE.BoxGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {

	THREE.Geometry.call( this );

	this.type = 'BoxGeometry';

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};

	this.fromBufferGeometry( new THREE.BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) );
	this.mergeVertices();

};

THREE.BoxGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.BoxGeometry.prototype.constructor = THREE.BoxGeometry;

THREE.CubeGeometry = THREE.BoxGeometry;

// File:src/extras/geometries/BoxBufferGeometry.js

/**
 * @author Mugen87 / https://github.com/Mugen87
 */

THREE.BoxBufferGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {

	THREE.BufferGeometry.call( this );

	this.type = 'BoxBufferGeometry';

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};

	var scope = this;

	// segments
	widthSegments = Math.floor( widthSegments ) || 1;
	heightSegments = Math.floor( heightSegments ) || 1;
	depthSegments = Math.floor( depthSegments ) || 1;

	// these are used to calculate buffer length
	var vertexCount = calculateVertexCount( widthSegments, heightSegments, depthSegments );
	var indexCount = calculateIndexCount( widthSegments, heightSegments, depthSegments );

	// buffers
	var indices = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );
	var vertices = new Float32Array( vertexCount * 3 );
	var normals = new Float32Array( vertexCount * 3 );
	var uvs = new Float32Array( vertexCount * 2 );

	// offset variables
	var vertexBufferOffset = 0;
	var uvBufferOffset = 0;
	var indexBufferOffset = 0;
	var numberOfVertices = 0;

	// group variables
	var groupStart = 0;

	// build each side of the box geometry
	buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height,   width,  depthSegments, heightSegments, 0 ); // px
	buildPlane( 'z', 'y', 'x',   1, - 1, depth, height, - width,  depthSegments, heightSegments, 1 ); // nx
	buildPlane( 'x', 'z', 'y',   1,   1, width, depth,    height, widthSegments, depthSegments,  2 ); // py
	buildPlane( 'x', 'z', 'y',   1, - 1, width, depth,  - height, widthSegments, depthSegments,  3 ); // ny
	buildPlane( 'x', 'y', 'z',   1, - 1, width, height,   depth,  widthSegments, heightSegments, 4 ); // pz
	buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth,  widthSegments, heightSegments, 5 ); // nz

	// build geometry
	this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
	this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	// helper functions

	function calculateVertexCount ( w, h, d ) {

		var vertices = 0;

		// calculate the amount of vertices for each side (plane)
		vertices += (w + 1) * (h + 1) * 2; // xy
		vertices += (w + 1) * (d + 1) * 2; // xz
		vertices += (d + 1) * (h + 1) * 2; // zy

		return vertices;

	}

	function calculateIndexCount ( w, h, d ) {

		var index = 0;

		// calculate the amount of squares for each side
		index += w * h * 2; // xy
		index += w * d * 2; // xz
		index += d * h * 2; // zy

		return index * 6; // two triangles per square => six vertices per square

	}

	function buildPlane ( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

		var segmentWidth	= width / gridX;
		var segmentHeight = height / gridY;

		var widthHalf = width / 2;
		var heightHalf = height / 2;
		var depthHalf = depth / 2;

		var gridX1 = gridX + 1;
		var gridY1 = gridY + 1;

		var vertexCounter = 0;
		var groupCount = 0;

		var vector = new THREE.Vector3();

		// generate vertices, normals and uvs

		for ( var iy = 0; iy < gridY1; iy ++ ) {

			var y = iy * segmentHeight - heightHalf;

			for ( var ix = 0; ix < gridX1; ix ++ ) {

				var x = ix * segmentWidth - widthHalf;

				// set values to correct vector component
				vector[ u ] = x * udir;
				vector[ v ] = y * vdir;
				vector[ w ] = depthHalf;

				// now apply vector to vertex buffer
				vertices[ vertexBufferOffset ] = vector.x;
				vertices[ vertexBufferOffset + 1 ] = vector.y;
				vertices[ vertexBufferOffset + 2 ] = vector.z;

				// set values to correct vector component
				vector[ u ] = 0;
				vector[ v ] = 0;
				vector[ w ] = depth > 0 ? 1 : - 1;

				// now apply vector to normal buffer
				normals[ vertexBufferOffset ] = vector.x;
				normals[ vertexBufferOffset + 1 ] = vector.y;
				normals[ vertexBufferOffset + 2 ] = vector.z;

				// uvs
				uvs[ uvBufferOffset ] = ix / gridX;
				uvs[ uvBufferOffset + 1 ] = 1 - ( iy / gridY );

				// update offsets and counters
				vertexBufferOffset += 3;
				uvBufferOffset += 2;
				vertexCounter += 1;

			}

		}

		// 1. you need three indices to draw a single face
		// 2. a single segment consists of two faces
		// 3. so we need to generate six (2*3) indices per segment

		for ( iy = 0; iy < gridY; iy ++ ) {

			for ( ix = 0; ix < gridX; ix ++ ) {

				// indices
				var a = numberOfVertices + ix + gridX1 * iy;
				var b = numberOfVertices + ix + gridX1 * ( iy + 1 );
				var c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

				// face one
				indices[ indexBufferOffset ] = a;
				indices[ indexBufferOffset + 1 ] = b;
				indices[ indexBufferOffset + 2 ] = d;

				// face two
				indices[ indexBufferOffset + 3 ] = b;
				indices[ indexBufferOffset + 4 ] = c;
				indices[ indexBufferOffset + 5 ] = d;

				// update offsets and counters
				indexBufferOffset += 6;
				groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support
		scope.addGroup( groupStart, groupCount, materialIndex );

		// calculate new start value for groups
		groupStart += groupCount;

		// update total number of vertices
		numberOfVertices += vertexCounter;

	}

};

THREE.BoxBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.BoxBufferGeometry.prototype.constructor = THREE.BoxBufferGeometry;

// File:src/extras/geometries/CircleGeometry.js

/**
 * @author hughes
 */

THREE.CircleGeometry = function ( radius, segments, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'CircleGeometry';

	this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new THREE.CircleBufferGeometry( radius, segments, thetaStart, thetaLength ) );

};

THREE.CircleGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.CircleGeometry.prototype.constructor = THREE.CircleGeometry;

// File:src/extras/geometries/CircleBufferGeometry.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.CircleBufferGeometry = function ( radius, segments, thetaStart, thetaLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'CircleBufferGeometry';

	this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;
	segments = segments !== undefined ? Math.max( 3, segments ) : 8;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	var vertices = segments + 2;

	var positions = new Float32Array( vertices * 3 );
	var normals = new Float32Array( vertices * 3 );
	var uvs = new Float32Array( vertices * 2 );

	// center data is already zero, but need to set a few extras
	normals[ 2 ] = 1.0;
	uvs[ 0 ] = 0.5;
	uvs[ 1 ] = 0.5;

	for ( var s = 0, i = 3, ii = 2 ; s <= segments; s ++, i += 3, ii += 2 ) {

		var segment = thetaStart + s / segments * thetaLength;

		positions[ i ] = radius * Math.cos( segment );
		positions[ i + 1 ] = radius * Math.sin( segment );

		normals[ i + 2 ] = 1; // normal z

		uvs[ ii ] = ( positions[ i ] / radius + 1 ) / 2;
		uvs[ ii + 1 ] = ( positions[ i + 1 ] / radius + 1 ) / 2;

	}

	var indices = [];

	for ( var i = 1; i <= segments; i ++ ) {

		indices.push( i, i + 1, 0 );

	}

	this.setIndex( new THREE.BufferAttribute( new Uint16Array( indices ), 1 ) );
	this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.CircleBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.CircleBufferGeometry.prototype.constructor = THREE.CircleBufferGeometry;

// File:src/extras/geometries/CylinderBufferGeometry.js

/**
 * @author Mugen87 / https://github.com/Mugen87
 */

THREE.CylinderBufferGeometry = function( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'CylinderBufferGeometry';

	this.parameters = {
		radiusTop: radiusTop,
		radiusBottom: radiusBottom,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	var scope = this;

	radiusTop = radiusTop !== undefined ? radiusTop : 20;
	radiusBottom = radiusBottom !== undefined ? radiusBottom : 20;
	height = height !== undefined ? height : 100;

	radialSegments = Math.floor( radialSegments ) || 8;
	heightSegments = Math.floor( heightSegments ) || 1;

	openEnded = openEnded !== undefined ? openEnded : false;
	thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
	thetaLength = thetaLength !== undefined ? thetaLength : 2.0 * Math.PI;

	// used to calculate buffer length

	var nbCap = 0;

	if ( openEnded === false ) {

		if ( radiusTop > 0 ) nbCap ++;
		if ( radiusBottom > 0 ) nbCap ++;

	}

	var vertexCount = calculateVertexCount();
	var indexCount = calculateIndexCount();

	// buffers

	var indices = new THREE.BufferAttribute( new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount ), 1 );
	var vertices = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var normals = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var uvs = new THREE.BufferAttribute( new Float32Array( vertexCount * 2 ), 2 );

	// helper variables

	var index = 0,
	    indexOffset = 0,
	    indexArray = [],
	    halfHeight = height / 2;

	// group variables
	var groupStart = 0;

	// generate geometry

	generateTorso();

	if ( openEnded === false ) {

		if ( radiusTop > 0 ) generateCap( true );
		if ( radiusBottom > 0 ) generateCap( false );

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', vertices );
	this.addAttribute( 'normal', normals );
	this.addAttribute( 'uv', uvs );

	// helper functions

	function calculateVertexCount() {

		var count = ( radialSegments + 1 ) * ( heightSegments + 1 );

		if ( openEnded === false ) {

			count += ( ( radialSegments + 1 ) * nbCap ) + ( radialSegments * nbCap );

		}

		return count;

	}

	function calculateIndexCount() {

		var count = radialSegments * heightSegments * 2 * 3;

		if ( openEnded === false ) {

			count += radialSegments * nbCap * 3;

		}

		return count;

	}

	function generateTorso() {

		var x, y;
		var normal = new THREE.Vector3();
		var vertex = new THREE.Vector3();

		var groupCount = 0;

		// this will be used to calculate the normal
		var tanTheta = ( radiusBottom - radiusTop ) / height;

		// generate vertices, normals and uvs

		for ( y = 0; y <= heightSegments; y ++ ) {

			var indexRow = [];

			var v = y / heightSegments;

			// calculate the radius of the current row
			var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

			for ( x = 0; x <= radialSegments; x ++ ) {

				var u = x / radialSegments;

				// vertex
				vertex.x = radius * Math.sin( u * thetaLength + thetaStart );
				vertex.y = - v * height + halfHeight;
				vertex.z = radius * Math.cos( u * thetaLength + thetaStart );
				vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

				// normal
				normal.copy( vertex );

				// handle special case if radiusTop/radiusBottom is zero

				if ( ( radiusTop === 0 && y === 0 ) || ( radiusBottom === 0 && y === heightSegments ) ) {

					normal.x = Math.sin( u * thetaLength + thetaStart );
					normal.z = Math.cos( u * thetaLength + thetaStart );

				}

				normal.setY( Math.sqrt( normal.x * normal.x + normal.z * normal.z ) * tanTheta ).normalize();
				normals.setXYZ( index, normal.x, normal.y, normal.z );

				// uv
				uvs.setXY( index, u, 1 - v );

				// save index of vertex in respective row
				indexRow.push( index );

				// increase index
				index ++;

			}

			// now save vertices of the row in our index array
			indexArray.push( indexRow );

		}

		// generate indices

		for ( x = 0; x < radialSegments; x ++ ) {

			for ( y = 0; y < heightSegments; y ++ ) {

				// we use the index array to access the correct indices
				var i1 = indexArray[ y ][ x ];
				var i2 = indexArray[ y + 1 ][ x ];
				var i3 = indexArray[ y + 1 ][ x + 1 ];
				var i4 = indexArray[ y ][ x + 1 ];

				// face one
				indices.setX( indexOffset, i1 ); indexOffset ++;
				indices.setX( indexOffset, i2 ); indexOffset ++;
				indices.setX( indexOffset, i4 ); indexOffset ++;

				// face two
				indices.setX( indexOffset, i2 ); indexOffset ++;
				indices.setX( indexOffset, i3 ); indexOffset ++;
				indices.setX( indexOffset, i4 ); indexOffset ++;

				// update counters
				groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support
		scope.addGroup( groupStart, groupCount, 0 );

		// calculate new start value for groups
		groupStart += groupCount;

	}

	function generateCap( top ) {

		var x, centerIndexStart, centerIndexEnd;

		var uv = new THREE.Vector2();
		var vertex = new THREE.Vector3();

		var groupCount = 0;

		var radius = ( top === true ) ? radiusTop : radiusBottom;
		var sign = ( top === true ) ? 1 : - 1;

		// save the index of the first center vertex
		centerIndexStart = index;

		// first we generate the center vertex data of the cap.
		// because the geometry needs one set of uvs per face,
		// we must generate a center vertex per face/segment

		for ( x = 1; x <= radialSegments; x ++ ) {

			// vertex
			vertices.setXYZ( index, 0, halfHeight * sign, 0 );

			// normal
			normals.setXYZ( index, 0, sign, 0 );

			// uv
			uv.x = 0.5;
			uv.y = 0.5;

			uvs.setXY( index, uv.x, uv.y );

			// increase index
			index ++;

		}

		// save the index of the last center vertex
		centerIndexEnd = index;

		// now we generate the surrounding vertices, normals and uvs

		for ( x = 0; x <= radialSegments; x ++ ) {

			var u = x / radialSegments;
			var theta = u * thetaLength + thetaStart;

			var cosTheta = Math.cos( theta );
			var sinTheta = Math.sin( theta );

			// vertex
			vertex.x = radius * sinTheta;
			vertex.y = halfHeight * sign;
			vertex.z = radius * cosTheta;
			vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

			// normal
			normals.setXYZ( index, 0, sign, 0 );

			// uv
			uv.x = ( cosTheta * 0.5 ) + 0.5;
			uv.y = ( sinTheta * 0.5 * sign ) + 0.5;
			uvs.setXY( index, uv.x, uv.y );

			// increase index
			index ++;

		}

		// generate indices

		for ( x = 0; x < radialSegments; x ++ ) {

			var c = centerIndexStart + x;
			var i = centerIndexEnd + x;

			if ( top === true ) {

				// face top
				indices.setX( indexOffset, i ); indexOffset ++;
				indices.setX( indexOffset, i + 1 ); indexOffset ++;
				indices.setX( indexOffset, c ); indexOffset ++;

			} else {

				// face bottom
				indices.setX( indexOffset, i + 1 ); indexOffset ++;
				indices.setX( indexOffset, i ); indexOffset ++;
				indices.setX( indexOffset, c ); indexOffset ++;

			}

			// update counters
			groupCount += 3;

		}

		// add a group to the geometry. this will ensure multi material support
		scope.addGroup( groupStart, groupCount, top === true ? 1 : 2 );

		// calculate new start value for groups
		groupStart += groupCount;

	}

};

THREE.CylinderBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.CylinderBufferGeometry.prototype.constructor = THREE.CylinderBufferGeometry;

// File:src/extras/geometries/CylinderGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'CylinderGeometry';

	this.parameters = {
		radiusTop: radiusTop,
		radiusBottom: radiusBottom,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new THREE.CylinderBufferGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) );
	this.mergeVertices();

};

THREE.CylinderGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry;

// File:src/extras/geometries/ConeBufferGeometry.js

/*
 * @author: abelnation / http://github.com/abelnation
 */

THREE.ConeBufferGeometry = function (
	radius, height,
	radialSegments, heightSegments,
	openEnded, thetaStart, thetaLength ) {

	THREE.CylinderBufferGeometry.call( this,
		0, radius, height,
		radialSegments, heightSegments,
		openEnded, thetaStart, thetaLength );

	this.type = 'ConeBufferGeometry';

	this.parameters = {
		radius: radius,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

};

THREE.ConeBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.ConeBufferGeometry.prototype.constructor = THREE.ConeBufferGeometry;

// File:src/extras/geometries/ConeGeometry.js

/**
 * @author abelnation / http://github.com/abelnation
 */

THREE.ConeGeometry = function (
	radius, height,
	radialSegments, heightSegments,
	openEnded, thetaStart, thetaLength ) {

	THREE.CylinderGeometry.call( this,
		0, radius, height,
		radialSegments, heightSegments,
		openEnded, thetaStart, thetaLength );

	this.type = 'ConeGeometry';

	this.parameters = {
		radius: radius,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

};

THREE.ConeGeometry.prototype = Object.create( THREE.CylinderGeometry.prototype );
THREE.ConeGeometry.prototype.constructor = THREE.ConeGeometry;

// File:src/extras/geometries/EdgesGeometry.js

/**
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.EdgesGeometry = function ( geometry, thresholdAngle ) {

	THREE.BufferGeometry.call( this );

	thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1;

	var thresholdDot = Math.cos( THREE.Math.DEG2RAD * thresholdAngle );

	var edge = [ 0, 0 ], hash = {};

	function sortFunction( a, b ) {

		return a - b;

	}

	var keys = [ 'a', 'b', 'c' ];

	var geometry2;

	if ( geometry instanceof THREE.BufferGeometry ) {

		geometry2 = new THREE.Geometry();
		geometry2.fromBufferGeometry( geometry );

	} else {

		geometry2 = geometry.clone();

	}

	geometry2.mergeVertices();
	geometry2.computeFaceNormals();

	var vertices = geometry2.vertices;
	var faces = geometry2.faces;

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		var face = faces[ i ];

		for ( var j = 0; j < 3; j ++ ) {

			edge[ 0 ] = face[ keys[ j ] ];
			edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
			edge.sort( sortFunction );

			var key = edge.toString();

			if ( hash[ key ] === undefined ) {

				hash[ key ] = { vert1: edge[ 0 ], vert2: edge[ 1 ], face1: i, face2: undefined };

			} else {

				hash[ key ].face2 = i;

			}

		}

	}

	var coords = [];

	for ( var key in hash ) {

		var h = hash[ key ];

		if ( h.face2 === undefined || faces[ h.face1 ].normal.dot( faces[ h.face2 ].normal ) <= thresholdDot ) {

			var vertex = vertices[ h.vert1 ];
			coords.push( vertex.x );
			coords.push( vertex.y );
			coords.push( vertex.z );

			vertex = vertices[ h.vert2 ];
			coords.push( vertex.x );
			coords.push( vertex.y );
			coords.push( vertex.z );

		}

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( coords ), 3 ) );

};

THREE.EdgesGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.EdgesGeometry.prototype.constructor = THREE.EdgesGeometry;

// File:src/extras/geometries/ExtrudeGeometry.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  curveSegments: <int>, // number of points on the curves
 *  steps: <int>, // number of points for z-side extrusions / used for subdividing segments of extrude spline too
 *  amount: <int>, // Depth to extrude the shape
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into the original shape bevel goes
 *  bevelSize: <float>, // how far from shape outline is bevel
 *  bevelSegments: <int>, // number of bevel layers
 *
 *  extrudePath: <THREE.CurvePath> // 3d spline path to extrude shape along. (creates Frames if .frames aren't defined)
 *  frames: <THREE.TubeGeometry.FrenetFrames> // containing arrays of tangents, normals, binormals
 *
 *  uvGenerator: <Object> // object that provides UV generator functions
 *
 * }
 **/

THREE.ExtrudeGeometry = function ( shapes, options ) {

	if ( typeof( shapes ) === "undefined" ) {

		shapes = [];
		return;

	}

	THREE.Geometry.call( this );

	this.type = 'ExtrudeGeometry';

	shapes = Array.isArray( shapes ) ? shapes : [ shapes ];

	this.addShapeList( shapes, options );

	this.computeFaceNormals();

	// can't really use automatic vertex normals
	// as then front and back sides get smoothed too
	// should do separate smoothing just for sides

	//this.computeVertexNormals();

	//console.log( "took", ( Date.now() - startTime ) );

};

THREE.ExtrudeGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry;

THREE.ExtrudeGeometry.prototype.addShapeList = function ( shapes, options ) {

	var sl = shapes.length;

	for ( var s = 0; s < sl; s ++ ) {

		var shape = shapes[ s ];
		this.addShape( shape, options );

	}

};

THREE.ExtrudeGeometry.prototype.addShape = function ( shape, options ) {

	var amount = options.amount !== undefined ? options.amount : 100;

	var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6; // 10
	var bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2; // 8
	var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;

	var bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true; // false

	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

	var steps = options.steps !== undefined ? options.steps : 1;

	var extrudePath = options.extrudePath;
	var extrudePts, extrudeByPath = false;

	// Use default WorldUVGenerator if no UV generators are specified.
	var uvgen = options.UVGenerator !== undefined ? options.UVGenerator : THREE.ExtrudeGeometry.WorldUVGenerator;

	var splineTube, binormal, normal, position2;
	if ( extrudePath ) {

		extrudePts = extrudePath.getSpacedPoints( steps );

		extrudeByPath = true;
		bevelEnabled = false; // bevels not supported for path extrusion

		// SETUP TNB variables

		// Reuse TNB from TubeGeomtry for now.
		// TODO1 - have a .isClosed in spline?

		splineTube = options.frames !== undefined ? options.frames : new THREE.TubeGeometry.FrenetFrames( extrudePath, steps, false );

		// console.log(splineTube, 'splineTube', splineTube.normals.length, 'steps', steps, 'extrudePts', extrudePts.length);

		binormal = new THREE.Vector3();
		normal = new THREE.Vector3();
		position2 = new THREE.Vector3();

	}

	// Safeguards if bevels are not enabled

	if ( ! bevelEnabled ) {

		bevelSegments = 0;
		bevelThickness = 0;
		bevelSize = 0;

	}

	// Variables initialization

	var ahole, h, hl; // looping of holes
	var scope = this;

	var shapesOffset = this.vertices.length;

	var shapePoints = shape.extractPoints( curveSegments );

	var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = ! THREE.ShapeUtils.isClockWise( vertices );

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe ...

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];

			if ( THREE.ShapeUtils.isClockWise( ahole ) ) {

				holes[ h ] = ahole.reverse();

			}

		}

		reverse = false; // If vertices are in order now, we shouldn't need to worry about them again (hopefully)!

	}


	var faces = THREE.ShapeUtils.triangulateShape( vertices, holes );

	/* Vertices */

	var contour = vertices; // vertices has all points but contour has only points of circumference

	for ( h = 0, hl = holes.length; h < hl; h ++ ) {

		ahole = holes[ h ];

		vertices = vertices.concat( ahole );

	}


	function scalePt2 ( pt, vec, size ) {

		if ( ! vec ) console.error( "THREE.ExtrudeGeometry: vec does not exist" );

		return vec.clone().multiplyScalar( size ).add( pt );

	}

	var b, bs, t, z,
		vert, vlen = vertices.length,
		face, flen = faces.length;


	// Find directions for point movement


	function getBevelVec( inPt, inPrev, inNext ) {

		// computes for inPt the corresponding point inPt' on a new contour
		//   shifted by 1 unit (length of normalized vector) to the left
		// if we walk along contour clockwise, this new contour is outside the old one
		//
		// inPt' is the intersection of the two lines parallel to the two
		//  adjacent edges of inPt at a distance of 1 unit on the left side.

		var v_trans_x, v_trans_y, shrink_by = 1;		// resulting translation vector for inPt

		// good reading for geometry algorithms (here: line-line intersection)
		// http://geomalgorithms.com/a05-_intersect-1.html

		var v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y;
		var v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y;

		var v_prev_lensq = ( v_prev_x * v_prev_x + v_prev_y * v_prev_y );

		// check for collinear edges
		var collinear0 = ( v_prev_x * v_next_y - v_prev_y * v_next_x );

		if ( Math.abs( collinear0 ) > Number.EPSILON ) {

			// not collinear

			// length of vectors for normalizing

			var v_prev_len = Math.sqrt( v_prev_lensq );
			var v_next_len = Math.sqrt( v_next_x * v_next_x + v_next_y * v_next_y );

			// shift adjacent points by unit vectors to the left

			var ptPrevShift_x = ( inPrev.x - v_prev_y / v_prev_len );
			var ptPrevShift_y = ( inPrev.y + v_prev_x / v_prev_len );

			var ptNextShift_x = ( inNext.x - v_next_y / v_next_len );
			var ptNextShift_y = ( inNext.y + v_next_x / v_next_len );

			// scaling factor for v_prev to intersection point

			var sf = (  ( ptNextShift_x - ptPrevShift_x ) * v_next_y -
						( ptNextShift_y - ptPrevShift_y ) * v_next_x    ) /
					  ( v_prev_x * v_next_y - v_prev_y * v_next_x );

			// vector from inPt to intersection point

			v_trans_x = ( ptPrevShift_x + v_prev_x * sf - inPt.x );
			v_trans_y = ( ptPrevShift_y + v_prev_y * sf - inPt.y );

			// Don't normalize!, otherwise sharp corners become ugly
			//  but prevent crazy spikes
			var v_trans_lensq = ( v_trans_x * v_trans_x + v_trans_y * v_trans_y );
			if ( v_trans_lensq <= 2 ) {

				return	new THREE.Vector2( v_trans_x, v_trans_y );

			} else {

				shrink_by = Math.sqrt( v_trans_lensq / 2 );

			}

		} else {

			// handle special case of collinear edges

			var direction_eq = false;		// assumes: opposite
			if ( v_prev_x > Number.EPSILON ) {

				if ( v_next_x > Number.EPSILON ) {

					direction_eq = true;

				}

			} else {

				if ( v_prev_x < - Number.EPSILON ) {

					if ( v_next_x < - Number.EPSILON ) {

						direction_eq = true;

					}

				} else {

					if ( Math.sign( v_prev_y ) === Math.sign( v_next_y ) ) {

						direction_eq = true;

					}

				}

			}

			if ( direction_eq ) {

				// console.log("Warning: lines are a straight sequence");
				v_trans_x = - v_prev_y;
				v_trans_y =  v_prev_x;
				shrink_by = Math.sqrt( v_prev_lensq );

			} else {

				// console.log("Warning: lines are a straight spike");
				v_trans_x = v_prev_x;
				v_trans_y = v_prev_y;
				shrink_by = Math.sqrt( v_prev_lensq / 2 );

			}

		}

		return	new THREE.Vector2( v_trans_x / shrink_by, v_trans_y / shrink_by );

	}


	var contourMovements = [];

	for ( var i = 0, il = contour.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {

		if ( j === il ) j = 0;
		if ( k === il ) k = 0;

		//  (j)---(i)---(k)
		// console.log('i,j,k', i, j , k)

		contourMovements[ i ] = getBevelVec( contour[ i ], contour[ j ], contour[ k ] );

	}

	var holesMovements = [], oneHoleMovements, verticesMovements = contourMovements.concat();

	for ( h = 0, hl = holes.length; h < hl; h ++ ) {

		ahole = holes[ h ];

		oneHoleMovements = [];

		for ( i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {

			if ( j === il ) j = 0;
			if ( k === il ) k = 0;

			//  (j)---(i)---(k)
			oneHoleMovements[ i ] = getBevelVec( ahole[ i ], ahole[ j ], ahole[ k ] );

		}

		holesMovements.push( oneHoleMovements );
		verticesMovements = verticesMovements.concat( oneHoleMovements );

	}


	// Loop bevelSegments, 1 for the front, 1 for the back

	for ( b = 0; b < bevelSegments; b ++ ) {

		//for ( b = bevelSegments; b > 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );

		//z = bevelThickness * t;
		bs = bevelSize * ( Math.sin ( t * Math.PI / 2 ) ); // curved
		//bs = bevelSize * t; // linear

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );

			v( vert.x, vert.y,  - z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i ++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				v( vert.x, vert.y,  - z );

			}

		}

	}

	bs = bevelSize;

	// Back facing vertices

	for ( i = 0; i < vlen; i ++ ) {

		vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

		if ( ! extrudeByPath ) {

			v( vert.x, vert.y, 0 );

		} else {

			// v( vert.x, vert.y + extrudePts[ 0 ].y, extrudePts[ 0 ].x );

			normal.copy( splineTube.normals[ 0 ] ).multiplyScalar( vert.x );
			binormal.copy( splineTube.binormals[ 0 ] ).multiplyScalar( vert.y );

			position2.copy( extrudePts[ 0 ] ).add( normal ).add( binormal );

			v( position2.x, position2.y, position2.z );

		}

	}

	// Add stepped vertices...
	// Including front facing vertices

	var s;

	for ( s = 1; s <= steps; s ++ ) {

		for ( i = 0; i < vlen; i ++ ) {

			vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

			if ( ! extrudeByPath ) {

				v( vert.x, vert.y, amount / steps * s );

			} else {

				// v( vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x );

				normal.copy( splineTube.normals[ s ] ).multiplyScalar( vert.x );
				binormal.copy( splineTube.binormals[ s ] ).multiplyScalar( vert.y );

				position2.copy( extrudePts[ s ] ).add( normal ).add( binormal );

				v( position2.x, position2.y, position2.z );

			}

		}

	}


	// Add bevel segments planes

	//for ( b = 1; b <= bevelSegments; b ++ ) {
	for ( b = bevelSegments - 1; b >= 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );
		//bs = bevelSize * ( 1-Math.sin ( ( 1 - t ) * Math.PI/2 ) );
		bs = bevelSize * Math.sin ( t * Math.PI / 2 );

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
			v( vert.x, vert.y,  amount + z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i ++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				if ( ! extrudeByPath ) {

					v( vert.x, vert.y,  amount + z );

				} else {

					v( vert.x, vert.y + extrudePts[ steps - 1 ].y, extrudePts[ steps - 1 ].x + z );

				}

			}

		}

	}

	/* Faces */

	// Top and bottom faces

	buildLidFaces();

	// Sides faces

	buildSideFaces();


	/////  Internal functions

	function buildLidFaces() {

		if ( bevelEnabled ) {

			var layer = 0; // steps + 1
			var offset = vlen * layer;

			// Bottom faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 2 ] + offset, face[ 1 ] + offset, face[ 0 ] + offset );

			}

			layer = steps + bevelSegments * 2;
			offset = vlen * layer;

			// Top faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset );

			}

		} else {

			// Bottom faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 2 ], face[ 1 ], face[ 0 ] );

			}

			// Top faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 0 ] + vlen * steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps );

			}

		}

	}

	// Create faces for the z-sides of the shape

	function buildSideFaces() {

		var layeroffset = 0;
		sidewalls( contour, layeroffset );
		layeroffset += contour.length;

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			sidewalls( ahole, layeroffset );

			//, true
			layeroffset += ahole.length;

		}

	}

	function sidewalls( contour, layeroffset ) {

		var j, k;
		i = contour.length;

		while ( -- i >= 0 ) {

			j = i;
			k = i - 1;
			if ( k < 0 ) k = contour.length - 1;

			//console.log('b', i,j, i-1, k,vertices.length);

			var s = 0, sl = steps  + bevelSegments * 2;

			for ( s = 0; s < sl; s ++ ) {

				var slen1 = vlen * s;
				var slen2 = vlen * ( s + 1 );

				var a = layeroffset + j + slen1,
					b = layeroffset + k + slen1,
					c = layeroffset + k + slen2,
					d = layeroffset + j + slen2;

				f4( a, b, c, d, contour, s, sl, j, k );

			}

		}

	}


	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	}

	function f3( a, b, c ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;

		scope.faces.push( new THREE.Face3( a, b, c, null, null, 0 ) );

		var uvs = uvgen.generateTopUV( scope, a, b, c );

		scope.faceVertexUvs[ 0 ].push( uvs );

	}

	function f4( a, b, c, d, wallContour, stepIndex, stepsLength, contourIndex1, contourIndex2 ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;
		d += shapesOffset;

		scope.faces.push( new THREE.Face3( a, b, d, null, null, 1 ) );
		scope.faces.push( new THREE.Face3( b, c, d, null, null, 1 ) );

		var uvs = uvgen.generateSideWallUV( scope, a, b, c, d );

		scope.faceVertexUvs[ 0 ].push( [ uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] ] );
		scope.faceVertexUvs[ 0 ].push( [ uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] ] );

	}

};

THREE.ExtrudeGeometry.WorldUVGenerator = {

	generateTopUV: function ( geometry, indexA, indexB, indexC ) {

		var vertices = geometry.vertices;

		var a = vertices[ indexA ];
		var b = vertices[ indexB ];
		var c = vertices[ indexC ];

		return [
			new THREE.Vector2( a.x, a.y ),
			new THREE.Vector2( b.x, b.y ),
			new THREE.Vector2( c.x, c.y )
		];

	},

	generateSideWallUV: function ( geometry, indexA, indexB, indexC, indexD ) {

		var vertices = geometry.vertices;

		var a = vertices[ indexA ];
		var b = vertices[ indexB ];
		var c = vertices[ indexC ];
		var d = vertices[ indexD ];

		if ( Math.abs( a.y - b.y ) < 0.01 ) {

			return [
				new THREE.Vector2( a.x, 1 - a.z ),
				new THREE.Vector2( b.x, 1 - b.z ),
				new THREE.Vector2( c.x, 1 - c.z ),
				new THREE.Vector2( d.x, 1 - d.z )
			];

		} else {

			return [
				new THREE.Vector2( a.y, 1 - a.z ),
				new THREE.Vector2( b.y, 1 - b.z ),
				new THREE.Vector2( c.y, 1 - c.z ),
				new THREE.Vector2( d.y, 1 - d.z )
			];

		}

	}
};

// File:src/extras/geometries/ShapeGeometry.js

/**
 * @author jonobr1 / http://jonobr1.com
 *
 * Creates a one-sided polygonal geometry from a path shape. Similar to
 * ExtrudeGeometry.
 *
 * parameters = {
 *
 *	curveSegments: <int>, // number of points on the curves. NOT USED AT THE MOMENT.
 *
 *	material: <int> // material index for front and back faces
 *	uvGenerator: <Object> // object that provides UV generator functions
 *
 * }
 **/

THREE.ShapeGeometry = function ( shapes, options ) {

	THREE.Geometry.call( this );

	this.type = 'ShapeGeometry';

	if ( Array.isArray( shapes ) === false ) shapes = [ shapes ];

	this.addShapeList( shapes, options );

	this.computeFaceNormals();

};

THREE.ShapeGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ShapeGeometry.prototype.constructor = THREE.ShapeGeometry;

/**
 * Add an array of shapes to THREE.ShapeGeometry.
 */
THREE.ShapeGeometry.prototype.addShapeList = function ( shapes, options ) {

	for ( var i = 0, l = shapes.length; i < l; i ++ ) {

		this.addShape( shapes[ i ], options );

	}

	return this;

};

/**
 * Adds a shape to THREE.ShapeGeometry, based on THREE.ExtrudeGeometry.
 */
THREE.ShapeGeometry.prototype.addShape = function ( shape, options ) {

	if ( options === undefined ) options = {};
	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

	var material = options.material;
	var uvgen = options.UVGenerator === undefined ? THREE.ExtrudeGeometry.WorldUVGenerator : options.UVGenerator;

	//

	var i, l, hole;

	var shapesOffset = this.vertices.length;
	var shapePoints = shape.extractPoints( curveSegments );

	var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = ! THREE.ShapeUtils.isClockWise( vertices );

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe...

		for ( i = 0, l = holes.length; i < l; i ++ ) {

			hole = holes[ i ];

			if ( THREE.ShapeUtils.isClockWise( hole ) ) {

				holes[ i ] = hole.reverse();

			}

		}

		reverse = false;

	}

	var faces = THREE.ShapeUtils.triangulateShape( vertices, holes );

	// Vertices

	for ( i = 0, l = holes.length; i < l; i ++ ) {

		hole = holes[ i ];
		vertices = vertices.concat( hole );

	}

	//

	var vert, vlen = vertices.length;
	var face, flen = faces.length;

	for ( i = 0; i < vlen; i ++ ) {

		vert = vertices[ i ];

		this.vertices.push( new THREE.Vector3( vert.x, vert.y, 0 ) );

	}

	for ( i = 0; i < flen; i ++ ) {

		face = faces[ i ];

		var a = face[ 0 ] + shapesOffset;
		var b = face[ 1 ] + shapesOffset;
		var c = face[ 2 ] + shapesOffset;

		this.faces.push( new THREE.Face3( a, b, c, null, null, material ) );
		this.faceVertexUvs[ 0 ].push( uvgen.generateTopUV( this, a, b, c ) );

	}

};

// File:src/extras/geometries/LatheBufferGeometry.js

/**
 * @author Mugen87 / https://github.com/Mugen87
 */

 // points - to create a closed torus, one must use a set of points
 //    like so: [ a, b, c, d, a ], see first is the same as last.
 // segments - the number of circumference segments to create
 // phiStart - the starting radian
 // phiLength - the radian (0 to 2PI) range of the lathed section
 //    2PI is a closed lathe, less than 2PI is a portion.

THREE.LatheBufferGeometry = function ( points, segments, phiStart, phiLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'LatheBufferGeometry';

	this.parameters = {
		points: points,
		segments: segments,
		phiStart: phiStart,
		phiLength: phiLength
	};

	segments = Math.floor( segments ) || 12;
	phiStart = phiStart || 0;
	phiLength = phiLength || Math.PI * 2;

	// clamp phiLength so it's in range of [ 0, 2PI ]
	phiLength = THREE.Math.clamp( phiLength, 0, Math.PI * 2 );

	// these are used to calculate buffer length
	var vertexCount = ( segments + 1 ) * points.length;
	var indexCount = segments * points.length * 2 * 3;

	// buffers
	var indices = new THREE.BufferAttribute( new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount ) , 1 );
	var vertices = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var uvs = new THREE.BufferAttribute( new Float32Array( vertexCount * 2 ), 2 );

	// helper variables
	var index = 0, indexOffset = 0, base;
	var inversePointLength = 1.0 / ( points.length - 1 );
	var inverseSegments = 1.0 / segments;
	var vertex = new THREE.Vector3();
	var uv = new THREE.Vector2();
	var i, j;

	// generate vertices and uvs

	for ( i = 0; i <= segments; i ++ ) {

		var phi = phiStart + i * inverseSegments * phiLength;

		var sin = Math.sin( phi );
		var cos = Math.cos( phi );

		for ( j = 0; j <= ( points.length - 1 ); j ++ ) {

			// vertex
			vertex.x = points[ j ].x * sin;
			vertex.y = points[ j ].y;
			vertex.z = points[ j ].x * cos;
			vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

			// uv
			uv.x = i / segments;
			uv.y = j / ( points.length - 1 );
			uvs.setXY( index, uv.x, uv.y );

			// increase index
			index ++;

		}

	}

	// generate indices

	for ( i = 0; i < segments; i ++ ) {

		for ( j = 0; j < ( points.length - 1 ); j ++ ) {

			base = j + i * points.length;

			// indices
			var a = base;
			var b = base + points.length;
			var c = base + points.length + 1;
			var d = base + 1;

			// face one
			indices.setX( indexOffset, a ); indexOffset++;
			indices.setX( indexOffset, b ); indexOffset++;
			indices.setX( indexOffset, d ); indexOffset++;

			// face two
			indices.setX( indexOffset, b ); indexOffset++;
			indices.setX( indexOffset, c ); indexOffset++;
			indices.setX( indexOffset, d ); indexOffset++;

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', vertices );
	this.addAttribute( 'uv', uvs );

	// generate normals

	this.computeVertexNormals();

	// if the geometry is closed, we need to average the normals along the seam.
	// because the corresponding vertices are identical (but still have different UVs).

	if( phiLength === Math.PI * 2 ) {

		var normals = this.attributes.normal.array;
		var n1 = new THREE.Vector3();
		var n2 = new THREE.Vector3();
		var n = new THREE.Vector3();

		// this is the buffer offset for the last line of vertices
		base = segments * points.length * 3;

		for( i = 0, j = 0; i < points.length; i ++, j += 3 ) {

			// select the normal of the vertex in the first line
			n1.x = normals[ j + 0 ];
			n1.y = normals[ j + 1 ];
			n1.z = normals[ j + 2 ];

			// select the normal of the vertex in the last line
			n2.x = normals[ base + j + 0 ];
			n2.y = normals[ base + j + 1 ];
			n2.z = normals[ base + j + 2 ];

			// average normals
			n.addVectors( n1, n2 ).normalize();

			// assign the new values to both normals
			normals[ j + 0 ] = normals[ base + j + 0 ] = n.x;
			normals[ j + 1 ] = normals[ base + j + 1 ] = n.y;
			normals[ j + 2 ] = normals[ base + j + 2 ] = n.z;

		} // next row

	}

};

THREE.LatheBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.LatheBufferGeometry.prototype.constructor = THREE.LatheBufferGeometry;

// File:src/extras/geometries/LatheGeometry.js

/**
 * @author astrodud / http://astrodud.isgreat.org/
 * @author zz85 / https://github.com/zz85
 * @author bhouston / http://clara.io
 */

// points - to create a closed torus, one must use a set of points
//    like so: [ a, b, c, d, a ], see first is the same as last.
// segments - the number of circumference segments to create
// phiStart - the starting radian
// phiLength - the radian (0 to 2PI) range of the lathed section
//    2PI is a closed lathe, less than 2PI is a portion.

THREE.LatheGeometry = function ( points, segments, phiStart, phiLength ) {

	THREE.Geometry.call( this );

	this.type = 'LatheGeometry';

	this.parameters = {
		points: points,
		segments: segments,
		phiStart: phiStart,
		phiLength: phiLength
	};

	this.fromBufferGeometry( new THREE.LatheBufferGeometry( points, segments, phiStart, phiLength ) );
	this.mergeVertices();

};

THREE.LatheGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry;

// File:src/extras/geometries/PlaneGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

THREE.PlaneGeometry = function ( width, height, widthSegments, heightSegments ) {

	THREE.Geometry.call( this );

	this.type = 'PlaneGeometry';

	this.parameters = {
		width: width,
		height: height,
		widthSegments: widthSegments,
		heightSegments: heightSegments
	};

	this.fromBufferGeometry( new THREE.PlaneBufferGeometry( width, height, widthSegments, heightSegments ) );

};

THREE.PlaneGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry;

// File:src/extras/geometries/PlaneBufferGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

THREE.PlaneBufferGeometry = function ( width, height, widthSegments, heightSegments ) {

	THREE.BufferGeometry.call( this );

	this.type = 'PlaneBufferGeometry';

	this.parameters = {
		width: width,
		height: height,
		widthSegments: widthSegments,
		heightSegments: heightSegments
	};

	var width_half = width / 2;
	var height_half = height / 2;

	var gridX = Math.floor( widthSegments ) || 1;
	var gridY = Math.floor( heightSegments ) || 1;

	var gridX1 = gridX + 1;
	var gridY1 = gridY + 1;

	var segment_width = width / gridX;
	var segment_height = height / gridY;

	var vertices = new Float32Array( gridX1 * gridY1 * 3 );
	var normals = new Float32Array( gridX1 * gridY1 * 3 );
	var uvs = new Float32Array( gridX1 * gridY1 * 2 );

	var offset = 0;
	var offset2 = 0;

	for ( var iy = 0; iy < gridY1; iy ++ ) {

		var y = iy * segment_height - height_half;

		for ( var ix = 0; ix < gridX1; ix ++ ) {

			var x = ix * segment_width - width_half;

			vertices[ offset ] = x;
			vertices[ offset + 1 ] = - y;

			normals[ offset + 2 ] = 1;

			uvs[ offset2 ] = ix / gridX;
			uvs[ offset2 + 1 ] = 1 - ( iy / gridY );

			offset += 3;
			offset2 += 2;

		}

	}

	offset = 0;

	var indices = new ( ( vertices.length / 3 ) > 65535 ? Uint32Array : Uint16Array )( gridX * gridY * 6 );

	for ( var iy = 0; iy < gridY; iy ++ ) {

		for ( var ix = 0; ix < gridX; ix ++ ) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * ( iy + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
			var d = ( ix + 1 ) + gridX1 * iy;

			indices[ offset ] = a;
			indices[ offset + 1 ] = b;
			indices[ offset + 2 ] = d;

			indices[ offset + 3 ] = b;
			indices[ offset + 4 ] = c;
			indices[ offset + 5 ] = d;

			offset += 6;

		}

	}

	this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
	this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

};

THREE.PlaneBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.PlaneBufferGeometry.prototype.constructor = THREE.PlaneBufferGeometry;

// File:src/extras/geometries/RingBufferGeometry.js

/**
 * @author Mugen87 / https://github.com/Mugen87
 */

THREE.RingBufferGeometry = function ( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'RingBufferGeometry';

	this.parameters = {
		innerRadius: innerRadius,
		outerRadius: outerRadius,
		thetaSegments: thetaSegments,
		phiSegments: phiSegments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	innerRadius = innerRadius || 20;
	outerRadius = outerRadius || 50;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
	phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 1;

	// these are used to calculate buffer length
	var vertexCount = ( thetaSegments + 1 ) * ( phiSegments + 1 );
	var indexCount = thetaSegments * phiSegments * 2 * 3;

	// buffers
	var indices = new THREE.BufferAttribute( new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount ) , 1 );
	var vertices = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var normals = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var uvs = new THREE.BufferAttribute( new Float32Array( vertexCount * 2 ), 2 );

	// some helper variables
	var index = 0, indexOffset = 0, segment;
	var radius = innerRadius;
	var radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
	var vertex = new THREE.Vector3();
	var uv = new THREE.Vector2();
	var j, i;

	// generate vertices, normals and uvs

	// values are generate from the inside of the ring to the outside

	for ( j = 0; j <= phiSegments; j ++ ) {

		for ( i = 0; i <= thetaSegments; i ++ ) {

			segment = thetaStart + i / thetaSegments * thetaLength;

			// vertex
			vertex.x = radius * Math.cos( segment );
			vertex.y = radius * Math.sin( segment );
			vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

			// normal
			normals.setXYZ( index, 0, 0, 1 );

			// uv
			uv.x = ( vertex.x / outerRadius + 1 ) / 2;
			uv.y = ( vertex.y / outerRadius + 1 ) / 2;
			uvs.setXY( index, uv.x, uv.y );

			// increase index
			index++;

		}

		// increase the radius for next row of vertices
		radius += radiusStep;

	}

	// generate indices

	for ( j = 0; j < phiSegments; j ++ ) {

		var thetaSegmentLevel = j * ( thetaSegments + 1 );

		for ( i = 0; i < thetaSegments; i ++ ) {

			segment = i + thetaSegmentLevel;

			// indices
			var a = segment;
			var b = segment + thetaSegments + 1;
			var c = segment + thetaSegments + 2;
			var d = segment + 1;

			// face one
			indices.setX( indexOffset, a ); indexOffset++;
			indices.setX( indexOffset, b ); indexOffset++;
			indices.setX( indexOffset, c ); indexOffset++;

			// face two
			indices.setX( indexOffset, a ); indexOffset++;
			indices.setX( indexOffset, c ); indexOffset++;
			indices.setX( indexOffset, d ); indexOffset++;

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', vertices );
	this.addAttribute( 'normal', normals );
	this.addAttribute( 'uv', uvs );

};

THREE.RingBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.RingBufferGeometry.prototype.constructor = THREE.RingBufferGeometry;

// File:src/extras/geometries/RingGeometry.js

/**
 * @author Kaleb Murphy
 */

THREE.RingGeometry = function ( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'RingGeometry';

	this.parameters = {
		innerRadius: innerRadius,
		outerRadius: outerRadius,
		thetaSegments: thetaSegments,
		phiSegments: phiSegments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new THREE.RingBufferGeometry( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) );

};

THREE.RingGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.RingGeometry.prototype.constructor = THREE.RingGeometry;

// File:src/extras/geometries/SphereGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.SphereGeometry = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'SphereGeometry';

	this.parameters = {
		radius: radius,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new THREE.SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) );

};

THREE.SphereGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry;

// File:src/extras/geometries/SphereBufferGeometry.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 * based on THREE.SphereGeometry
 */

THREE.SphereBufferGeometry = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'SphereBufferGeometry';

	this.parameters = {
		radius: radius,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;

	widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
	heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var thetaEnd = thetaStart + thetaLength;

	var vertexCount = ( ( widthSegments + 1 ) * ( heightSegments + 1 ) );

	var positions = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var normals = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var uvs = new THREE.BufferAttribute( new Float32Array( vertexCount * 2 ), 2 );

	var index = 0, vertices = [], normal = new THREE.Vector3();

	for ( var y = 0; y <= heightSegments; y ++ ) {

		var verticesRow = [];

		var v = y / heightSegments;

		for ( var x = 0; x <= widthSegments; x ++ ) {

			var u = x / widthSegments;

			var px = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			var py = radius * Math.cos( thetaStart + v * thetaLength );
			var pz = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			normal.set( px, py, pz ).normalize();

			positions.setXYZ( index, px, py, pz );
			normals.setXYZ( index, normal.x, normal.y, normal.z );
			uvs.setXY( index, u, 1 - v );

			verticesRow.push( index );

			index ++;

		}

		vertices.push( verticesRow );

	}

	var indices = [];

	for ( var y = 0; y < heightSegments; y ++ ) {

		for ( var x = 0; x < widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			if ( y !== 0 || thetaStart > 0 ) indices.push( v1, v2, v4 );
			if ( y !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( v2, v3, v4 );

		}

	}

	this.setIndex( new ( positions.count > 65535 ? THREE.Uint32Attribute : THREE.Uint16Attribute )( indices, 1 ) );
	this.addAttribute( 'position', positions );
	this.addAttribute( 'normal', normals );
	this.addAttribute( 'uv', uvs );

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.SphereBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.SphereBufferGeometry.prototype.constructor = THREE.SphereBufferGeometry;

// File:src/extras/geometries/TextGeometry.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float> // how far from text outline is bevel
 * }
 */

THREE.TextGeometry = function ( text, parameters ) {

	parameters = parameters || {};

	var font = parameters.font;

	if ( font instanceof THREE.Font === false ) {

		console.error( 'THREE.TextGeometry: font parameter is not an instance of THREE.Font.' );
		return new THREE.Geometry();

	}

	var shapes = font.generateShapes( text, parameters.size, parameters.curveSegments );

	// translate parameters to ExtrudeGeometry API

	parameters.amount = parameters.height !== undefined ? parameters.height : 50;

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;

	THREE.ExtrudeGeometry.call( this, shapes, parameters );

	this.type = 'TextGeometry';

};

THREE.TextGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;

// File:src/extras/geometries/TorusBufferGeometry.js

/**
 * @author Mugen87 / https://github.com/Mugen87
 */

THREE.TorusBufferGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

	THREE.BufferGeometry.call( this );

	this.type = 'TorusBufferGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		arc: arc
	};

	radius = radius || 100;
	tube = tube || 40;
	radialSegments = Math.floor( radialSegments ) || 8;
	tubularSegments = Math.floor( tubularSegments ) || 6;
	arc = arc || Math.PI * 2;

	// used to calculate buffer length
	var vertexCount = ( ( radialSegments + 1 ) * ( tubularSegments + 1 ) );
	var indexCount = radialSegments * tubularSegments * 2 * 3;

	// buffers
	var indices = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );
	var vertices = new Float32Array( vertexCount * 3 );
	var normals = new Float32Array( vertexCount * 3 );
	var uvs = new Float32Array( vertexCount * 2 );

	// offset variables
	var vertexBufferOffset = 0;
	var uvBufferOffset = 0;
	var indexBufferOffset = 0;

	// helper variables
	var center = new THREE.Vector3();
	var vertex = new THREE.Vector3();
	var normal = new THREE.Vector3();

	var j, i;

	// generate vertices, normals and uvs

	for ( j = 0; j <= radialSegments; j ++ ) {

		for ( i = 0; i <= tubularSegments; i ++ ) {

			var u = i / tubularSegments * arc;
			var v = j / radialSegments * Math.PI * 2;

			// vertex
			vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
			vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
			vertex.z = tube * Math.sin( v );

			vertices[ vertexBufferOffset ] = vertex.x;
			vertices[ vertexBufferOffset + 1 ] = vertex.y;
			vertices[ vertexBufferOffset + 2 ] = vertex.z;

			// this vector is used to calculate the normal
			center.x = radius * Math.cos( u );
			center.y = radius * Math.sin( u );

			// normal
			normal.subVectors( vertex, center ).normalize();

			normals[ vertexBufferOffset ] = normal.x;
			normals[ vertexBufferOffset + 1 ] = normal.y;
			normals[ vertexBufferOffset + 2 ] = normal.z;

			// uv
			uvs[ uvBufferOffset ] = i / tubularSegments;
			uvs[ uvBufferOffset + 1 ] = j / radialSegments;

			// update offsets
			vertexBufferOffset += 3;
			uvBufferOffset += 2;

		}

	}

	// generate indices

	for ( j = 1; j <= radialSegments; j ++ ) {

		for ( i = 1; i <= tubularSegments; i ++ ) {

			// indices
			var a = ( tubularSegments + 1 ) * j + i - 1;
			var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
			var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
			var d = ( tubularSegments + 1 ) * j + i;

			// face one
			indices[ indexBufferOffset ] = a;
			indices[ indexBufferOffset + 1 ] = b;
			indices[ indexBufferOffset + 2 ] = d;

			// face two
			indices[ indexBufferOffset + 3 ] = b;
			indices[ indexBufferOffset + 4 ] = c;
			indices[ indexBufferOffset + 5 ] = d;

			// update offset
			indexBufferOffset += 6;

		}

	}

	// build geometry
	this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
	this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

};

THREE.TorusBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.TorusBufferGeometry.prototype.constructor = THREE.TorusBufferGeometry;

// File:src/extras/geometries/TorusGeometry.js

/**
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */

THREE.TorusGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

	THREE.Geometry.call( this );

	this.type = 'TorusGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		arc: arc
	};

	this.fromBufferGeometry( new THREE.TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) );

};

THREE.TorusGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry;

// File:src/extras/geometries/TorusKnotBufferGeometry.js

/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 * see: http://www.blackpawn.com/texts/pqtorus/
 */
THREE.TorusKnotBufferGeometry = function ( radius, tube, tubularSegments, radialSegments, p, q ) {

	THREE.BufferGeometry.call( this );

	this.type = 'TorusKnotBufferGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		tubularSegments: tubularSegments,
		radialSegments: radialSegments,
		p: p,
		q: q
	};

	radius = radius || 100;
	tube = tube || 40;
	tubularSegments = Math.floor( tubularSegments ) || 64;
	radialSegments = Math.floor( radialSegments ) || 8;
	p = p || 2;
	q = q || 3;

	// used to calculate buffer length
	var vertexCount = ( ( radialSegments + 1 ) * ( tubularSegments + 1 ) );
	var indexCount = radialSegments * tubularSegments * 2 * 3;

	// buffers
	var indices = new THREE.BufferAttribute( new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount ) , 1 );
	var vertices = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var normals = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var uvs = new THREE.BufferAttribute( new Float32Array( vertexCount * 2 ), 2 );

	// helper variables
	var i, j, index = 0, indexOffset = 0;

	var vertex = new THREE.Vector3();
	var normal = new THREE.Vector3();
	var uv = new THREE.Vector2();

	var P1 = new THREE.Vector3();
	var P2 = new THREE.Vector3();

	var B = new THREE.Vector3();
	var T = new THREE.Vector3();
	var N = new THREE.Vector3();

	// generate vertices, normals and uvs

	for ( i = 0; i <= tubularSegments; ++ i ) {

		// the radian "u" is used to calculate the position on the torus curve of the current tubular segement

		var u = i / tubularSegments * p * Math.PI * 2;

		// now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
		// these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions

		calculatePositionOnCurve( u, p, q, radius, P1 );
		calculatePositionOnCurve( u + 0.01, p, q, radius, P2 );

		// calculate orthonormal basis

		T.subVectors( P2, P1 );
		N.addVectors( P2, P1 );
		B.crossVectors( T, N );
		N.crossVectors( B, T );

		// normalize B, N. T can be ignored, we don't use it

		B.normalize();
		N.normalize();

		for ( j = 0; j <= radialSegments; ++ j ) {

			// now calculate the vertices. they are nothing more than an extrusion of the torus curve.
			// because we extrude a shape in the xy-plane, there is no need to calculate a z-value.

			var v = j / radialSegments * Math.PI * 2;
			var cx = - tube * Math.cos( v );
			var cy = tube * Math.sin( v );

			// now calculate the final vertex position.
			// first we orient the extrusion with our basis vectos, then we add it to the current position on the curve

			vertex.x = P1.x + ( cx * N.x + cy * B.x );
			vertex.y = P1.y + ( cx * N.y + cy * B.y );
			vertex.z = P1.z + ( cx * N.z + cy * B.z );

			// vertex
			vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

			// normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)
			normal.subVectors( vertex, P1 ).normalize();
			normals.setXYZ( index, normal.x, normal.y, normal.z );

			// uv
			uv.x = i / tubularSegments;
			uv.y = j / radialSegments;
			uvs.setXY( index, uv.x, uv.y );

			// increase index
			index ++;

		}

	}

	// generate indices

	for ( j = 1; j <= tubularSegments; j ++ ) {

		for ( i = 1; i <= radialSegments; i ++ ) {

			// indices
			var a = ( radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
			var b = ( radialSegments + 1 ) * j + ( i - 1 );
			var c = ( radialSegments + 1 ) * j + i;
			var d = ( radialSegments + 1 ) * ( j - 1 ) + i;

			// face one
			indices.setX( indexOffset, a ); indexOffset++;
			indices.setX( indexOffset, b ); indexOffset++;
			indices.setX( indexOffset, d ); indexOffset++;

			// face two
			indices.setX( indexOffset, b ); indexOffset++;
			indices.setX( indexOffset, c ); indexOffset++;
			indices.setX( indexOffset, d ); indexOffset++;

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', vertices );
	this.addAttribute( 'normal', normals );
	this.addAttribute( 'uv', uvs );

	// this function calculates the current position on the torus curve

	function calculatePositionOnCurve( u, p, q, radius, position ) {

		var cu = Math.cos( u );
		var su = Math.sin( u );
		var quOverP = q / p * u;
		var cs = Math.cos( quOverP );

		position.x = radius * ( 2 + cs ) * 0.5 * cu;
		position.y = radius * ( 2 + cs ) * su * 0.5;
		position.z = radius * Math.sin( quOverP ) * 0.5;

	}

};

THREE.TorusKnotBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.TorusKnotBufferGeometry.prototype.constructor = THREE.TorusKnotBufferGeometry;

// File:src/extras/geometries/TorusKnotGeometry.js

/**
 * @author oosmoxiecode
 */

THREE.TorusKnotGeometry = function ( radius, tube, tubularSegments, radialSegments, p, q, heightScale ) {

	THREE.Geometry.call( this );

	this.type = 'TorusKnotGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		tubularSegments: tubularSegments,
		radialSegments: radialSegments,
		p: p,
		q: q
	};

	if( heightScale !== undefined ) console.warn( 'THREE.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.' );

	this.fromBufferGeometry( new THREE.TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q ) );
	this.mergeVertices();

};

THREE.TorusKnotGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry;

// File:src/extras/geometries/TubeGeometry.js

/**
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 * @author jonobr1 / https://github.com/jonobr1
 *
 * Modified from the TorusKnotGeometry by @oosmoxiecode
 *
 * Creates a tube which extrudes along a 3d spline
 *
 * Uses parallel transport frames as described in
 * http://www.cs.indiana.edu/pub/techreports/TR425.pdf
 */

THREE.TubeGeometry = function ( path, segments, radius, radialSegments, closed, taper ) {

	THREE.Geometry.call( this );

	this.type = 'TubeGeometry';

	this.parameters = {
		path: path,
		segments: segments,
		radius: radius,
		radialSegments: radialSegments,
		closed: closed,
		taper: taper
	};

	segments = segments || 64;
	radius = radius || 1;
	radialSegments = radialSegments || 8;
	closed = closed || false;
	taper = taper || THREE.TubeGeometry.NoTaper;

	var grid = [];

	var scope = this,

		tangent,
		normal,
		binormal,

		numpoints = segments + 1,

		u, v, r,

		cx, cy,
		pos, pos2 = new THREE.Vector3(),
		i, j,
		ip, jp,
		a, b, c, d,
		uva, uvb, uvc, uvd;

	var frames = new THREE.TubeGeometry.FrenetFrames( path, segments, closed ),
		tangents = frames.tangents,
		normals = frames.normals,
		binormals = frames.binormals;

	// proxy internals
	this.tangents = tangents;
	this.normals = normals;
	this.binormals = binormals;

	function vert( x, y, z ) {

		return scope.vertices.push( new THREE.Vector3( x, y, z ) ) - 1;

	}

	// construct the grid

	for ( i = 0; i < numpoints; i ++ ) {

		grid[ i ] = [];

		u = i / ( numpoints - 1 );

		pos = path.getPointAt( u );

		tangent = tangents[ i ];
		normal = normals[ i ];
		binormal = binormals[ i ];

		r = radius * taper( u );

		for ( j = 0; j < radialSegments; j ++ ) {

			v = j / radialSegments * 2 * Math.PI;

			cx = - r * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
			cy = r * Math.sin( v );

			pos2.copy( pos );
			pos2.x += cx * normal.x + cy * binormal.x;
			pos2.y += cx * normal.y + cy * binormal.y;
			pos2.z += cx * normal.z + cy * binormal.z;

			grid[ i ][ j ] = vert( pos2.x, pos2.y, pos2.z );

		}

	}


	// construct the mesh

	for ( i = 0; i < segments; i ++ ) {

		for ( j = 0; j < radialSegments; j ++ ) {

			ip = ( closed ) ? ( i + 1 ) % segments : i + 1;
			jp = ( j + 1 ) % radialSegments;

			a = grid[ i ][ j ];		// *** NOT NECESSARILY PLANAR ! ***
			b = grid[ ip ][ j ];
			c = grid[ ip ][ jp ];
			d = grid[ i ][ jp ];

			uva = new THREE.Vector2( i / segments, j / radialSegments );
			uvb = new THREE.Vector2( ( i + 1 ) / segments, j / radialSegments );
			uvc = new THREE.Vector2( ( i + 1 ) / segments, ( j + 1 ) / radialSegments );
			uvd = new THREE.Vector2( i / segments, ( j + 1 ) / radialSegments );

			this.faces.push( new THREE.Face3( a, b, d ) );
			this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

			this.faces.push( new THREE.Face3( b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

		}

	}

	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.TubeGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TubeGeometry.prototype.constructor = THREE.TubeGeometry;

THREE.TubeGeometry.NoTaper = function ( u ) {

	return 1;

};

THREE.TubeGeometry.SinusoidalTaper = function ( u ) {

	return Math.sin( Math.PI * u );

};

// For computing of Frenet frames, exposing the tangents, normals and binormals the spline
THREE.TubeGeometry.FrenetFrames = function ( path, segments, closed ) {

	var	normal = new THREE.Vector3(),

		tangents = [],
		normals = [],
		binormals = [],

		vec = new THREE.Vector3(),
		mat = new THREE.Matrix4(),

		numpoints = segments + 1,
		theta,
		smallest,

		tx, ty, tz,
		i, u;


	// expose internals
	this.tangents = tangents;
	this.normals = normals;
	this.binormals = binormals;

	// compute the tangent vectors for each segment on the path

	for ( i = 0; i < numpoints; i ++ ) {

		u = i / ( numpoints - 1 );

		tangents[ i ] = path.getTangentAt( u );
		tangents[ i ].normalize();

	}

	initialNormal3();

	/*
	function initialNormal1(lastBinormal) {
		// fixed start binormal. Has dangers of 0 vectors
		normals[ 0 ] = new THREE.Vector3();
		binormals[ 0 ] = new THREE.Vector3();
		if (lastBinormal===undefined) lastBinormal = new THREE.Vector3( 0, 0, 1 );
		normals[ 0 ].crossVectors( lastBinormal, tangents[ 0 ] ).normalize();
		binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();
	}

	function initialNormal2() {

		// This uses the Frenet-Serret formula for deriving binormal
		var t2 = path.getTangentAt( epsilon );

		normals[ 0 ] = new THREE.Vector3().subVectors( t2, tangents[ 0 ] ).normalize();
		binormals[ 0 ] = new THREE.Vector3().crossVectors( tangents[ 0 ], normals[ 0 ] );

		normals[ 0 ].crossVectors( binormals[ 0 ], tangents[ 0 ] ).normalize(); // last binormal x tangent
		binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();

	}
	*/

	function initialNormal3() {

		// select an initial normal vector perpendicular to the first tangent vector,
		// and in the direction of the smallest tangent xyz component

		normals[ 0 ] = new THREE.Vector3();
		binormals[ 0 ] = new THREE.Vector3();
		smallest = Number.MAX_VALUE;
		tx = Math.abs( tangents[ 0 ].x );
		ty = Math.abs( tangents[ 0 ].y );
		tz = Math.abs( tangents[ 0 ].z );

		if ( tx <= smallest ) {

			smallest = tx;
			normal.set( 1, 0, 0 );

		}

		if ( ty <= smallest ) {

			smallest = ty;
			normal.set( 0, 1, 0 );

		}

		if ( tz <= smallest ) {

			normal.set( 0, 0, 1 );

		}

		vec.crossVectors( tangents[ 0 ], normal ).normalize();

		normals[ 0 ].crossVectors( tangents[ 0 ], vec );
		binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] );

	}


	// compute the slowly-varying normal and binormal vectors for each segment on the path

	for ( i = 1; i < numpoints; i ++ ) {

		normals[ i ] = normals[ i - 1 ].clone();

		binormals[ i ] = binormals[ i - 1 ].clone();

		vec.crossVectors( tangents[ i - 1 ], tangents[ i ] );

		if ( vec.length() > Number.EPSILON ) {

			vec.normalize();

			theta = Math.acos( THREE.Math.clamp( tangents[ i - 1 ].dot( tangents[ i ] ), - 1, 1 ) ); // clamp for floating pt errors

			normals[ i ].applyMatrix4( mat.makeRotationAxis( vec, theta ) );

		}

		binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

	}


	// if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

	if ( closed ) {

		theta = Math.acos( THREE.Math.clamp( normals[ 0 ].dot( normals[ numpoints - 1 ] ), - 1, 1 ) );
		theta /= ( numpoints - 1 );

		if ( tangents[ 0 ].dot( vec.crossVectors( normals[ 0 ], normals[ numpoints - 1 ] ) ) > 0 ) {

			theta = - theta;

		}

		for ( i = 1; i < numpoints; i ++ ) {

			// twist a little...
			normals[ i ].applyMatrix4( mat.makeRotationAxis( tangents[ i ], theta * i ) );
			binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

		}

	}

};

// File:src/extras/geometries/PolyhedronGeometry.js

/**
 * @author clockworkgeek / https://github.com/clockworkgeek
 * @author timothypratley / https://github.com/timothypratley
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.PolyhedronGeometry = function ( vertices, indices, radius, detail ) {

	THREE.Geometry.call( this );

	this.type = 'PolyhedronGeometry';

	this.parameters = {
		vertices: vertices,
		indices: indices,
		radius: radius,
		detail: detail
	};

	radius = radius || 1;
	detail = detail || 0;

	var that = this;

	for ( var i = 0, l = vertices.length; i < l; i += 3 ) {

		prepare( new THREE.Vector3( vertices[ i ], vertices[ i + 1 ], vertices[ i + 2 ] ) );

	}

	var p = this.vertices;

	var faces = [];

	for ( var i = 0, j = 0, l = indices.length; i < l; i += 3, j ++ ) {

		var v1 = p[ indices[ i ] ];
		var v2 = p[ indices[ i + 1 ] ];
		var v3 = p[ indices[ i + 2 ] ];

		faces[ j ] = new THREE.Face3( v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ], undefined, j );

	}

	var centroid = new THREE.Vector3();

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		subdivide( faces[ i ], detail );

	}


	// Handle case when face straddles the seam

	for ( var i = 0, l = this.faceVertexUvs[ 0 ].length; i < l; i ++ ) {

		var uvs = this.faceVertexUvs[ 0 ][ i ];

		var x0 = uvs[ 0 ].x;
		var x1 = uvs[ 1 ].x;
		var x2 = uvs[ 2 ].x;

		var max = Math.max( x0, x1, x2 );
		var min = Math.min( x0, x1, x2 );

		if ( max > 0.9 && min < 0.1 ) {

			// 0.9 is somewhat arbitrary

			if ( x0 < 0.2 ) uvs[ 0 ].x += 1;
			if ( x1 < 0.2 ) uvs[ 1 ].x += 1;
			if ( x2 < 0.2 ) uvs[ 2 ].x += 1;

		}

	}


	// Apply radius

	for ( var i = 0, l = this.vertices.length; i < l; i ++ ) {

		this.vertices[ i ].multiplyScalar( radius );

	}


	// Merge vertices

	this.mergeVertices();

	this.computeFaceNormals();

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );


	// Project vector onto sphere's surface

	function prepare( vector ) {

		var vertex = vector.normalize().clone();
		vertex.index = that.vertices.push( vertex ) - 1;

		// Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.

		var u = azimuth( vector ) / 2 / Math.PI + 0.5;
		var v = inclination( vector ) / Math.PI + 0.5;
		vertex.uv = new THREE.Vector2( u, 1 - v );

		return vertex;

	}


	// Approximate a curved face with recursively sub-divided triangles.

	function make( v1, v2, v3, materialIndex ) {

		var face = new THREE.Face3( v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ], undefined, materialIndex );
		that.faces.push( face );

		centroid.copy( v1 ).add( v2 ).add( v3 ).divideScalar( 3 );

		var azi = azimuth( centroid );

		that.faceVertexUvs[ 0 ].push( [
			correctUV( v1.uv, v1, azi ),
			correctUV( v2.uv, v2, azi ),
			correctUV( v3.uv, v3, azi )
		] );

	}


	// Analytically subdivide a face to the required detail level.

	function subdivide( face, detail ) {

		var cols = Math.pow( 2, detail );
		var a = prepare( that.vertices[ face.a ] );
		var b = prepare( that.vertices[ face.b ] );
		var c = prepare( that.vertices[ face.c ] );
		var v = [];

		var materialIndex = face.materialIndex;

		// Construct all of the vertices for this subdivision.

		for ( var i = 0 ; i <= cols; i ++ ) {

			v[ i ] = [];

			var aj = prepare( a.clone().lerp( c, i / cols ) );
			var bj = prepare( b.clone().lerp( c, i / cols ) );
			var rows = cols - i;

			for ( var j = 0; j <= rows; j ++ ) {

				if ( j === 0 && i === cols ) {

					v[ i ][ j ] = aj;

				} else {

					v[ i ][ j ] = prepare( aj.clone().lerp( bj, j / rows ) );

				}

			}

		}

		// Construct all of the faces.

		for ( var i = 0; i < cols ; i ++ ) {

			for ( var j = 0; j < 2 * ( cols - i ) - 1; j ++ ) {

				var k = Math.floor( j / 2 );

				if ( j % 2 === 0 ) {

					make(
						v[ i ][ k + 1 ],
						v[ i + 1 ][ k ],
						v[ i ][ k ],
						materialIndex
					);

				} else {

					make(
						v[ i ][ k + 1 ],
						v[ i + 1 ][ k + 1 ],
						v[ i + 1 ][ k ],
						materialIndex
					);

				}

			}

		}

	}


	// Angle around the Y axis, counter-clockwise when looking from above.

	function azimuth( vector ) {

		return Math.atan2( vector.z, - vector.x );

	}


	// Angle above the XZ plane.

	function inclination( vector ) {

		return Math.atan2( - vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

	}


	// Texture fixing helper. Spheres have some odd behaviours.

	function correctUV( uv, vector, azimuth ) {

		if ( ( azimuth < 0 ) && ( uv.x === 1 ) ) uv = new THREE.Vector2( uv.x - 1, uv.y );
		if ( ( vector.x === 0 ) && ( vector.z === 0 ) ) uv = new THREE.Vector2( azimuth / 2 / Math.PI + 0.5, uv.y );
		return uv.clone();

	}


};

THREE.PolyhedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.PolyhedronGeometry.prototype.constructor = THREE.PolyhedronGeometry;

// File:src/extras/geometries/DodecahedronGeometry.js

/**
 * @author Abe Pazos / https://hamoid.com
 */

THREE.DodecahedronGeometry = function ( radius, detail ) {

	var t = ( 1 + Math.sqrt( 5 ) ) / 2;
	var r = 1 / t;

	var vertices = [

		// (±1, ±1, ±1)
		- 1, - 1, - 1,    - 1, - 1,  1,
		- 1,  1, - 1,    - 1,  1,  1,
		 1, - 1, - 1,     1, - 1,  1,
		 1,  1, - 1,     1,  1,  1,

		// (0, ±1/φ, ±φ)
		 0, - r, - t,     0, - r,  t,
		 0,  r, - t,     0,  r,  t,

		// (±1/φ, ±φ, 0)
		- r, - t,  0,    - r,  t,  0,
		 r, - t,  0,     r,  t,  0,

		// (±φ, 0, ±1/φ)
		- t,  0, - r,     t,  0, - r,
		- t,  0,  r,     t,  0,  r
	];

	var indices = [
		 3, 11,  7,      3,  7, 15,      3, 15, 13,
		 7, 19, 17,      7, 17,  6,      7,  6, 15,
		17,  4,  8,     17,  8, 10,     17, 10,  6,
		 8,  0, 16,      8, 16,  2,      8,  2, 10,
		 0, 12,  1,      0,  1, 18,      0, 18, 16,
		 6, 10,  2,      6,  2, 13,      6, 13, 15,
		 2, 16, 18,      2, 18,  3,      2,  3, 13,
		18,  1,  9,     18,  9, 11,     18, 11,  3,
		 4, 14, 12,      4, 12,  0,      4,  0,  8,
		11,  9,  5,     11,  5, 19,     11, 19,  7,
		19,  5, 14,     19, 14,  4,     19,  4, 17,
		 1, 12, 14,      1, 14,  5,      1,  5,  9
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'DodecahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

};

THREE.DodecahedronGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
THREE.DodecahedronGeometry.prototype.constructor = THREE.DodecahedronGeometry;

// File:src/extras/geometries/IcosahedronGeometry.js

/**
 * @author timothypratley / https://github.com/timothypratley
 */

THREE.IcosahedronGeometry = function ( radius, detail ) {

	var t = ( 1 + Math.sqrt( 5 ) ) / 2;

	var vertices = [
		- 1,  t,  0,    1,  t,  0,   - 1, - t,  0,    1, - t,  0,
		 0, - 1,  t,    0,  1,  t,    0, - 1, - t,    0,  1, - t,
		 t,  0, - 1,    t,  0,  1,   - t,  0, - 1,   - t,  0,  1
	];

	var indices = [
		 0, 11,  5,    0,  5,  1,    0,  1,  7,    0,  7, 10,    0, 10, 11,
		 1,  5,  9,    5, 11,  4,   11, 10,  2,   10,  7,  6,    7,  1,  8,
		 3,  9,  4,    3,  4,  2,    3,  2,  6,    3,  6,  8,    3,  8,  9,
		 4,  9,  5,    2,  4, 11,    6,  2, 10,    8,  6,  7,    9,  8,  1
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'IcosahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

};

THREE.IcosahedronGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;

// File:src/extras/geometries/OctahedronGeometry.js

/**
 * @author timothypratley / https://github.com/timothypratley
 */

THREE.OctahedronGeometry = function ( radius, detail ) {

	var vertices = [
		1, 0, 0,   - 1, 0, 0,    0, 1, 0,    0, - 1, 0,    0, 0, 1,    0, 0, - 1
	];

	var indices = [
		0, 2, 4,    0, 4, 3,    0, 3, 5,    0, 5, 2,    1, 2, 5,    1, 5, 3,    1, 3, 4,    1, 4, 2
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'OctahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

};

THREE.OctahedronGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
THREE.OctahedronGeometry.prototype.constructor = THREE.OctahedronGeometry;

// File:src/extras/geometries/TetrahedronGeometry.js

/**
 * @author timothypratley / https://github.com/timothypratley
 */

THREE.TetrahedronGeometry = function ( radius, detail ) {

	var vertices = [
		 1,  1,  1,   - 1, - 1,  1,   - 1,  1, - 1,    1, - 1, - 1
	];

	var indices = [
		 2,  1,  0,    0,  3,  2,    1,  3,  0,    2,  3,  1
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'TetrahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

};

THREE.TetrahedronGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
THREE.TetrahedronGeometry.prototype.constructor = THREE.TetrahedronGeometry;

// File:src/extras/geometries/ParametricGeometry.js

/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new THREE.ParametricGeometry( parametricFunction, uSegments, ySegements );
 *
 */

THREE.ParametricGeometry = function ( func, slices, stacks ) {

	THREE.Geometry.call( this );

	this.type = 'ParametricGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var i, j, p;
	var u, v;

	var sliceCount = slices + 1;

	for ( i = 0; i <= stacks; i ++ ) {

		v = i / stacks;

		for ( j = 0; j <= slices; j ++ ) {

			u = j / slices;

			p = func( u, v );
			verts.push( p );

		}

	}

	var a, b, c, d;
	var uva, uvb, uvc, uvd;

	for ( i = 0; i < stacks; i ++ ) {

		for ( j = 0; j < slices; j ++ ) {

			a = i * sliceCount + j;
			b = i * sliceCount + j + 1;
			c = ( i + 1 ) * sliceCount + j + 1;
			d = ( i + 1 ) * sliceCount + j;

			uva = new THREE.Vector2( j / slices, i / stacks );
			uvb = new THREE.Vector2( ( j + 1 ) / slices, i / stacks );
			uvc = new THREE.Vector2( ( j + 1 ) / slices, ( i + 1 ) / stacks );
			uvd = new THREE.Vector2( j / slices, ( i + 1 ) / stacks );

			faces.push( new THREE.Face3( a, b, d ) );
			uvs.push( [ uva, uvb, uvd ] );

			faces.push( new THREE.Face3( b, c, d ) );
			uvs.push( [ uvb.clone(), uvc, uvd.clone() ] );

		}

	}

	// console.log(this);

	// magic bullet
	// var diff = this.mergeVertices();
	// console.log('removed ', diff, ' vertices by merging');

	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.ParametricGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ParametricGeometry.prototype.constructor = THREE.ParametricGeometry;

// File:src/extras/geometries/WireframeGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.WireframeGeometry = function ( geometry ) {

	THREE.BufferGeometry.call( this );

	var edge = [ 0, 0 ], hash = {};

	function sortFunction( a, b ) {

		return a - b;

	}

	var keys = [ 'a', 'b', 'c' ];

	if ( geometry instanceof THREE.Geometry ) {

		var vertices = geometry.vertices;
		var faces = geometry.faces;
		var numEdges = 0;

		// allocate maximal size
		var edges = new Uint32Array( 6 * faces.length );

		for ( var i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			for ( var j = 0; j < 3; j ++ ) {

				edge[ 0 ] = face[ keys[ j ] ];
				edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
				edge.sort( sortFunction );

				var key = edge.toString();

				if ( hash[ key ] === undefined ) {

					edges[ 2 * numEdges ] = edge[ 0 ];
					edges[ 2 * numEdges + 1 ] = edge[ 1 ];
					hash[ key ] = true;
					numEdges ++;

				}

			}

		}

		var coords = new Float32Array( numEdges * 2 * 3 );

		for ( var i = 0, l = numEdges; i < l; i ++ ) {

			for ( var j = 0; j < 2; j ++ ) {

				var vertex = vertices[ edges [ 2 * i + j ] ];

				var index = 6 * i + 3 * j;
				coords[ index + 0 ] = vertex.x;
				coords[ index + 1 ] = vertex.y;
				coords[ index + 2 ] = vertex.z;

			}

		}

		this.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );

	} else if ( geometry instanceof THREE.BufferGeometry ) {

		if ( geometry.index !== null ) {

			// Indexed BufferGeometry

			var indices = geometry.index.array;
			var vertices = geometry.attributes.position;
			var groups = geometry.groups;
			var numEdges = 0;

			if ( groups.length === 0 ) {

				geometry.addGroup( 0, indices.length );

			}

			// allocate maximal size
			var edges = new Uint32Array( 2 * indices.length );

			for ( var o = 0, ol = groups.length; o < ol; ++ o ) {

				var group = groups[ o ];

				var start = group.start;
				var count = group.count;

				for ( var i = start, il = start + count; i < il; i += 3 ) {

					for ( var j = 0; j < 3; j ++ ) {

						edge[ 0 ] = indices[ i + j ];
						edge[ 1 ] = indices[ i + ( j + 1 ) % 3 ];
						edge.sort( sortFunction );

						var key = edge.toString();

						if ( hash[ key ] === undefined ) {

							edges[ 2 * numEdges ] = edge[ 0 ];
							edges[ 2 * numEdges + 1 ] = edge[ 1 ];
							hash[ key ] = true;
							numEdges ++;

						}

					}

				}

			}

			var coords = new Float32Array( numEdges * 2 * 3 );

			for ( var i = 0, l = numEdges; i < l; i ++ ) {

				for ( var j = 0; j < 2; j ++ ) {

					var index = 6 * i + 3 * j;
					var index2 = edges[ 2 * i + j ];

					coords[ index + 0 ] = vertices.getX( index2 );
					coords[ index + 1 ] = vertices.getY( index2 );
					coords[ index + 2 ] = vertices.getZ( index2 );

				}

			}

			this.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );

		} else {

			// non-indexed BufferGeometry

			var vertices = geometry.attributes.position.array;
			var numEdges = vertices.length / 3;
			var numTris = numEdges / 3;

			var coords = new Float32Array( numEdges * 2 * 3 );

			for ( var i = 0, l = numTris; i < l; i ++ ) {

				for ( var j = 0; j < 3; j ++ ) {

					var index = 18 * i + 6 * j;

					var index1 = 9 * i + 3 * j;
					coords[ index + 0 ] = vertices[ index1 ];
					coords[ index + 1 ] = vertices[ index1 + 1 ];
					coords[ index + 2 ] = vertices[ index1 + 2 ];

					var index2 = 9 * i + 3 * ( ( j + 1 ) % 3 );
					coords[ index + 3 ] = vertices[ index2 ];
					coords[ index + 4 ] = vertices[ index2 + 1 ];
					coords[ index + 5 ] = vertices[ index2 + 2 ];

				}

			}

			this.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );

		}

	}

};

THREE.WireframeGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.WireframeGeometry.prototype.constructor = THREE.WireframeGeometry;

// File:src/extras/helpers/AxisHelper.js

/**
 * @author sroucheray / http://sroucheray.org/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AxisHelper = function ( size ) {

	size = size || 1;

	var vertices = new Float32Array( [
		0, 0, 0,  size, 0, 0,
		0, 0, 0,  0, size, 0,
		0, 0, 0,  0, 0, size
	] );

	var colors = new Float32Array( [
		1, 0, 0,  1, 0.6, 0,
		0, 1, 0,  0.6, 1, 0,
		0, 0, 1,  0, 0.6, 1
	] );

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

	THREE.LineSegments.call( this, geometry, material );

};

THREE.AxisHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.AxisHelper.prototype.constructor = THREE.AxisHelper;

// File:src/extras/helpers/ArrowHelper.js

/**
 * @author WestLangley / http://github.com/WestLangley
 * @author zz85 / http://github.com/zz85
 * @author bhouston / http://clara.io
 *
 * Creates an arrow for visualizing directions
 *
 * Parameters:
 *  dir - Vector3
 *  origin - Vector3
 *  length - Number
 *  color - color in hex value
 *  headLength - Number
 *  headWidth - Number
 */

THREE.ArrowHelper = ( function () {

	var lineGeometry = new THREE.BufferGeometry();
	lineGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0, 0, 1, 0 ], 3 ) );

	var coneGeometry = new THREE.CylinderBufferGeometry( 0, 0.5, 1, 5, 1 );
	coneGeometry.translate( 0, - 0.5, 0 );

	return function ArrowHelper( dir, origin, length, color, headLength, headWidth ) {

		// dir is assumed to be normalized

		THREE.Object3D.call( this );

		if ( color === undefined ) color = 0xffff00;
		if ( length === undefined ) length = 1;
		if ( headLength === undefined ) headLength = 0.2 * length;
		if ( headWidth === undefined ) headWidth = 0.2 * headLength;

		this.position.copy( origin );

		this.line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color: color } ) );
		this.line.matrixAutoUpdate = false;
		this.add( this.line );

		this.cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color: color } ) );
		this.cone.matrixAutoUpdate = false;
		this.add( this.cone );

		this.setDirection( dir );
		this.setLength( length, headLength, headWidth );

	};

}() );

THREE.ArrowHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.ArrowHelper.prototype.constructor = THREE.ArrowHelper;

THREE.ArrowHelper.prototype.setDirection = ( function () {

	var axis = new THREE.Vector3();
	var radians;

	return function setDirection( dir ) {

		// dir is assumed to be normalized

		if ( dir.y > 0.99999 ) {

			this.quaternion.set( 0, 0, 0, 1 );

		} else if ( dir.y < - 0.99999 ) {

			this.quaternion.set( 1, 0, 0, 0 );

		} else {

			axis.set( dir.z, 0, - dir.x ).normalize();

			radians = Math.acos( dir.y );

			this.quaternion.setFromAxisAngle( axis, radians );

		}

	};

}() );

THREE.ArrowHelper.prototype.setLength = function ( length, headLength, headWidth ) {

	if ( headLength === undefined ) headLength = 0.2 * length;
	if ( headWidth === undefined ) headWidth = 0.2 * headLength;

	this.line.scale.set( 1, Math.max( 0, length - headLength ), 1 );
	this.line.updateMatrix();

	this.cone.scale.set( headWidth, headLength, headWidth );
	this.cone.position.y = length;
	this.cone.updateMatrix();

};

THREE.ArrowHelper.prototype.setColor = function ( color ) {

	this.line.material.color.copy( color );
	this.cone.material.color.copy( color );

};

// File:src/extras/helpers/BoxHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BoxHelper = function ( object ) {

	var indices = new Uint16Array( [ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ] );
	var positions = new Float32Array( 8 * 3 );

	var geometry = new THREE.BufferGeometry();
	geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

	THREE.LineSegments.call( this, geometry, new THREE.LineBasicMaterial( { color: 0xffff00 } ) );

	if ( object !== undefined ) {

		this.update( object );

	}

};

THREE.BoxHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.BoxHelper.prototype.constructor = THREE.BoxHelper;

THREE.BoxHelper.prototype.update = ( function () {

	var box = new THREE.Box3();

	return function ( object ) {

		if ( object instanceof THREE.Box3 ) {

			box.copy( object );

		} else {

			box.setFromObject( object );

		}

		if ( box.isEmpty() ) return;

		var min = box.min;
		var max = box.max;

		/*
		  5____4
		1/___0/|
		| 6__|_7
		2/___3/

		0: max.x, max.y, max.z
		1: min.x, max.y, max.z
		2: min.x, min.y, max.z
		3: max.x, min.y, max.z
		4: max.x, max.y, min.z
		5: min.x, max.y, min.z
		6: min.x, min.y, min.z
		7: max.x, min.y, min.z
		*/

		var position = this.geometry.attributes.position;
		var array = position.array;

		array[  0 ] = max.x; array[  1 ] = max.y; array[  2 ] = max.z;
		array[  3 ] = min.x; array[  4 ] = max.y; array[  5 ] = max.z;
		array[  6 ] = min.x; array[  7 ] = min.y; array[  8 ] = max.z;
		array[  9 ] = max.x; array[ 10 ] = min.y; array[ 11 ] = max.z;
		array[ 12 ] = max.x; array[ 13 ] = max.y; array[ 14 ] = min.z;
		array[ 15 ] = min.x; array[ 16 ] = max.y; array[ 17 ] = min.z;
		array[ 18 ] = min.x; array[ 19 ] = min.y; array[ 20 ] = min.z;
		array[ 21 ] = max.x; array[ 22 ] = min.y; array[ 23 ] = min.z;

		position.needsUpdate = true;

		this.geometry.computeBoundingSphere();

	};

} )();

// File:src/extras/helpers/BoundingBoxHelper.js

/**
 * @author WestLangley / http://github.com/WestLangley
 */

// a helper to show the world-axis-aligned bounding box for an object

THREE.BoundingBoxHelper = function ( object, hex ) {

	var color = ( hex !== undefined ) ? hex : 0x888888;

	this.object = object;

	this.box = new THREE.Box3();

	THREE.Mesh.call( this, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: color, wireframe: true } ) );

};

THREE.BoundingBoxHelper.prototype = Object.create( THREE.Mesh.prototype );
THREE.BoundingBoxHelper.prototype.constructor = THREE.BoundingBoxHelper;

THREE.BoundingBoxHelper.prototype.update = function () {

	this.box.setFromObject( this.object );

	this.box.size( this.scale );

	this.box.center( this.position );

};

// File:src/extras/helpers/CameraHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 *	- shows frustum, line of sight and up of the camera
 *	- suitable for fast updates
 * 	- based on frustum visualization in lightgl.js shadowmap example
 *		http://evanw.github.com/lightgl.js/tests/shadowmap.html
 */

THREE.CameraHelper = function ( camera ) {

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

	var pointMap = {};

	// colors

	var hexFrustum = 0xffaa00;
	var hexCone = 0xff0000;
	var hexUp = 0x00aaff;
	var hexTarget = 0xffffff;
	var hexCross = 0x333333;

	// near

	addLine( "n1", "n2", hexFrustum );
	addLine( "n2", "n4", hexFrustum );
	addLine( "n4", "n3", hexFrustum );
	addLine( "n3", "n1", hexFrustum );

	// far

	addLine( "f1", "f2", hexFrustum );
	addLine( "f2", "f4", hexFrustum );
	addLine( "f4", "f3", hexFrustum );
	addLine( "f3", "f1", hexFrustum );

	// sides

	addLine( "n1", "f1", hexFrustum );
	addLine( "n2", "f2", hexFrustum );
	addLine( "n3", "f3", hexFrustum );
	addLine( "n4", "f4", hexFrustum );

	// cone

	addLine( "p", "n1", hexCone );
	addLine( "p", "n2", hexCone );
	addLine( "p", "n3", hexCone );
	addLine( "p", "n4", hexCone );

	// up

	addLine( "u1", "u2", hexUp );
	addLine( "u2", "u3", hexUp );
	addLine( "u3", "u1", hexUp );

	// target

	addLine( "c", "t", hexTarget );
	addLine( "p", "c", hexCross );

	// cross

	addLine( "cn1", "cn2", hexCross );
	addLine( "cn3", "cn4", hexCross );

	addLine( "cf1", "cf2", hexCross );
	addLine( "cf3", "cf4", hexCross );

	function addLine( a, b, hex ) {

		addPoint( a, hex );
		addPoint( b, hex );

	}

	function addPoint( id, hex ) {

		geometry.vertices.push( new THREE.Vector3() );
		geometry.colors.push( new THREE.Color( hex ) );

		if ( pointMap[ id ] === undefined ) {

			pointMap[ id ] = [];

		}

		pointMap[ id ].push( geometry.vertices.length - 1 );

	}

	THREE.LineSegments.call( this, geometry, material );

	this.camera = camera;
	this.camera.updateProjectionMatrix();

	this.matrix = camera.matrixWorld;
	this.matrixAutoUpdate = false;

	this.pointMap = pointMap;

	this.update();

};

THREE.CameraHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.CameraHelper.prototype.constructor = THREE.CameraHelper;

THREE.CameraHelper.prototype.update = function () {

	var geometry, pointMap;

	var vector = new THREE.Vector3();
	var camera = new THREE.Camera();

	function setPoint( point, x, y, z ) {

		vector.set( x, y, z ).unproject( camera );

		var points = pointMap[ point ];

		if ( points !== undefined ) {

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				geometry.vertices[ points[ i ] ].copy( vector );

			}

		}

	}

	return function () {

		geometry = this.geometry;
		pointMap = this.pointMap;

		var w = 1, h = 1;

		// we need just camera projection matrix
		// world matrix must be identity

		camera.projectionMatrix.copy( this.camera.projectionMatrix );

		// center / target

		setPoint( "c", 0, 0, - 1 );
		setPoint( "t", 0, 0,  1 );

		// near

		setPoint( "n1", - w, - h, - 1 );
		setPoint( "n2",   w, - h, - 1 );
		setPoint( "n3", - w,   h, - 1 );
		setPoint( "n4",   w,   h, - 1 );

		// far

		setPoint( "f1", - w, - h, 1 );
		setPoint( "f2",   w, - h, 1 );
		setPoint( "f3", - w,   h, 1 );
		setPoint( "f4",   w,   h, 1 );

		// up

		setPoint( "u1",   w * 0.7, h * 1.1, - 1 );
		setPoint( "u2", - w * 0.7, h * 1.1, - 1 );
		setPoint( "u3",         0, h * 2,   - 1 );

		// cross

		setPoint( "cf1", - w,   0, 1 );
		setPoint( "cf2",   w,   0, 1 );
		setPoint( "cf3",   0, - h, 1 );
		setPoint( "cf4",   0,   h, 1 );

		setPoint( "cn1", - w,   0, - 1 );
		setPoint( "cn2",   w,   0, - 1 );
		setPoint( "cn3",   0, - h, - 1 );
		setPoint( "cn4",   0,   h, - 1 );

		geometry.verticesNeedUpdate = true;

	};

}();

// File:src/extras/helpers/DirectionalLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.DirectionalLightHelper = function ( light, size ) {

	THREE.Object3D.call( this );

	this.light = light;
	this.light.updateMatrixWorld();

	this.matrix = light.matrixWorld;
	this.matrixAutoUpdate = false;

	if ( size === undefined ) size = 1;

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.Float32Attribute( [
		- size,   size, 0,
		  size,   size, 0,
		  size, - size, 0,
		- size, - size, 0,
		- size,   size, 0
	], 3 ) );

	var material = new THREE.LineBasicMaterial( { fog: false } );

	this.add( new THREE.Line( geometry, material ) );

	geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0, 0, 0, 1 ], 3 ) );

	this.add( new THREE.Line( geometry, material ));

	this.update();

};

THREE.DirectionalLightHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.DirectionalLightHelper.prototype.constructor = THREE.DirectionalLightHelper;

THREE.DirectionalLightHelper.prototype.dispose = function () {

	var lightPlane = this.children[ 0 ];
	var targetLine = this.children[ 1 ];

	lightPlane.geometry.dispose();
	lightPlane.material.dispose();
	targetLine.geometry.dispose();
	targetLine.material.dispose();

};

THREE.DirectionalLightHelper.prototype.update = function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();
	var v3 = new THREE.Vector3();

	return function () {

		v1.setFromMatrixPosition( this.light.matrixWorld );
		v2.setFromMatrixPosition( this.light.target.matrixWorld );
		v3.subVectors( v2, v1 );

		var lightPlane = this.children[ 0 ];
		var targetLine = this.children[ 1 ];

		lightPlane.lookAt( v3 );
		lightPlane.material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

		targetLine.lookAt( v3 );
		targetLine.scale.z = v3.length();

	};

}();

// File:src/extras/helpers/EdgesHelper.js

/**
 * @author WestLangley / http://github.com/WestLangley
 * @param object THREE.Mesh whose geometry will be used
 * @param hex line color
 * @param thresholdAngle the minimum angle (in degrees),
 * between the face normals of adjacent faces,
 * that is required to render an edge. A value of 10 means
 * an edge is only rendered if the angle is at least 10 degrees.
 */

THREE.EdgesHelper = function ( object, hex, thresholdAngle ) {

	var color = ( hex !== undefined ) ? hex : 0xffffff;

	THREE.LineSegments.call( this, new THREE.EdgesGeometry( object.geometry, thresholdAngle ), new THREE.LineBasicMaterial( { color: color } ) );

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

};

THREE.EdgesHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.EdgesHelper.prototype.constructor = THREE.EdgesHelper;

// File:src/extras/helpers/FaceNormalsHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.FaceNormalsHelper = function ( object, size, hex, linewidth ) {

	// FaceNormalsHelper only supports THREE.Geometry

	this.object = object;

	this.size = ( size !== undefined ) ? size : 1;

	var color = ( hex !== undefined ) ? hex : 0xffff00;

	var width = ( linewidth !== undefined ) ? linewidth : 1;

	//

	var nNormals = 0;

	var objGeometry = this.object.geometry;

	if ( objGeometry instanceof THREE.Geometry ) {

		nNormals = objGeometry.faces.length;

	} else {

		console.warn( 'THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.' );

	}

	//

	var geometry = new THREE.BufferGeometry();

	var positions = new THREE.Float32Attribute( nNormals * 2 * 3, 3 );

	geometry.addAttribute( 'position', positions );

	THREE.LineSegments.call( this, geometry, new THREE.LineBasicMaterial( { color: color, linewidth: width } ) );

	//

	this.matrixAutoUpdate = false;
	this.update();

};

THREE.FaceNormalsHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.FaceNormalsHelper.prototype.constructor = THREE.FaceNormalsHelper;

THREE.FaceNormalsHelper.prototype.update = ( function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();
	var normalMatrix = new THREE.Matrix3();

	return function update() {

		this.object.updateMatrixWorld( true );

		normalMatrix.getNormalMatrix( this.object.matrixWorld );

		var matrixWorld = this.object.matrixWorld;

		var position = this.geometry.attributes.position;

		//

		var objGeometry = this.object.geometry;

		var vertices = objGeometry.vertices;

		var faces = objGeometry.faces;

		var idx = 0;

		for ( var i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			var normal = face.normal;

			v1.copy( vertices[ face.a ] )
				.add( vertices[ face.b ] )
				.add( vertices[ face.c ] )
				.divideScalar( 3 )
				.applyMatrix4( matrixWorld );

			v2.copy( normal ).applyMatrix3( normalMatrix ).normalize().multiplyScalar( this.size ).add( v1 );

			position.setXYZ( idx, v1.x, v1.y, v1.z );

			idx = idx + 1;

			position.setXYZ( idx, v2.x, v2.y, v2.z );

			idx = idx + 1;

		}

		position.needsUpdate = true;

		return this;

	};

}() );

// File:src/extras/helpers/GridHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.GridHelper = function ( size, step, color1, color2 ) {

	color1 = new THREE.Color( color1 !== undefined ? color1 : 0x444444 );
	color2 = new THREE.Color( color2 !== undefined ? color2 : 0x888888 );

	var vertices = [];
	var colors = [];

	for ( var i = - size, j = 0; i <= size; i += step ) {

		vertices.push( - size, 0, i, size, 0, i );
		vertices.push( i, 0, - size, i, 0, size );

		var color = i === 0 ? color1 : color2;

		color.toArray( colors, j ); j += 3;
		color.toArray( colors, j ); j += 3;
		color.toArray( colors, j ); j += 3;
		color.toArray( colors, j ); j += 3;

	}

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.Float32Attribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new THREE.Float32Attribute( colors, 3 ) );

	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

	THREE.LineSegments.call( this, geometry, material );

};

THREE.GridHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.GridHelper.prototype.constructor = THREE.GridHelper;

THREE.GridHelper.prototype.setColors = function () {

	console.error( 'THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.' );

};

// File:src/extras/helpers/HemisphereLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.HemisphereLightHelper = function ( light, sphereSize ) {

	THREE.Object3D.call( this );

	this.light = light;
	this.light.updateMatrixWorld();

	this.matrix = light.matrixWorld;
	this.matrixAutoUpdate = false;

	this.colors = [ new THREE.Color(), new THREE.Color() ];

	var geometry = new THREE.SphereGeometry( sphereSize, 4, 2 );
	geometry.rotateX( - Math.PI / 2 );

	for ( var i = 0, il = 8; i < il; i ++ ) {

		geometry.faces[ i ].color = this.colors[ i < 4 ? 0 : 1 ];

	}

	var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, wireframe: true } );

	this.lightSphere = new THREE.Mesh( geometry, material );
	this.add( this.lightSphere );

	this.update();

};

THREE.HemisphereLightHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.HemisphereLightHelper.prototype.constructor = THREE.HemisphereLightHelper;

THREE.HemisphereLightHelper.prototype.dispose = function () {

	this.lightSphere.geometry.dispose();
	this.lightSphere.material.dispose();

};

THREE.HemisphereLightHelper.prototype.update = function () {

	var vector = new THREE.Vector3();

	return function () {

		this.colors[ 0 ].copy( this.light.color ).multiplyScalar( this.light.intensity );
		this.colors[ 1 ].copy( this.light.groundColor ).multiplyScalar( this.light.intensity );

		this.lightSphere.lookAt( vector.setFromMatrixPosition( this.light.matrixWorld ).negate() );
		this.lightSphere.geometry.colorsNeedUpdate = true;

	};

}();

// File:src/extras/helpers/PointLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointLightHelper = function ( light, sphereSize ) {

	this.light = light;
	this.light.updateMatrixWorld();

	var geometry = new THREE.SphereBufferGeometry( sphereSize, 4, 2 );
	var material = new THREE.MeshBasicMaterial( { wireframe: true, fog: false } );
	material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	THREE.Mesh.call( this, geometry, material );

	this.matrix = this.light.matrixWorld;
	this.matrixAutoUpdate = false;

	/*
	var distanceGeometry = new THREE.IcosahedronGeometry( 1, 2 );
	var distanceMaterial = new THREE.MeshBasicMaterial( { color: hexColor, fog: false, wireframe: true, opacity: 0.1, transparent: true } );

	this.lightSphere = new THREE.Mesh( bulbGeometry, bulbMaterial );
	this.lightDistance = new THREE.Mesh( distanceGeometry, distanceMaterial );

	var d = light.distance;

	if ( d === 0.0 ) {

		this.lightDistance.visible = false;

	} else {

		this.lightDistance.scale.set( d, d, d );

	}

	this.add( this.lightDistance );
	*/

};

THREE.PointLightHelper.prototype = Object.create( THREE.Mesh.prototype );
THREE.PointLightHelper.prototype.constructor = THREE.PointLightHelper;

THREE.PointLightHelper.prototype.dispose = function () {

	this.geometry.dispose();
	this.material.dispose();

};

THREE.PointLightHelper.prototype.update = function () {

	this.material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	/*
	var d = this.light.distance;

	if ( d === 0.0 ) {

		this.lightDistance.visible = false;

	} else {

		this.lightDistance.visible = true;
		this.lightDistance.scale.set( d, d, d );

	}
	*/

};

// File:src/extras/helpers/SkeletonHelper.js

/**
 * @author Sean Griffin / http://twitter.com/sgrif
 * @author Michael Guerrero / http://realitymeltdown.com
 * @author mrdoob / http://mrdoob.com/
 * @author ikerr / http://verold.com
 */

THREE.SkeletonHelper = function ( object ) {

	this.bones = this.getBoneList( object );

	var geometry = new THREE.Geometry();

	for ( var i = 0; i < this.bones.length; i ++ ) {

		var bone = this.bones[ i ];

		if ( bone.parent instanceof THREE.Bone ) {

			geometry.vertices.push( new THREE.Vector3() );
			geometry.vertices.push( new THREE.Vector3() );
			geometry.colors.push( new THREE.Color( 0, 0, 1 ) );
			geometry.colors.push( new THREE.Color( 0, 1, 0 ) );

		}

	}

	geometry.dynamic = true;

	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, depthTest: false, depthWrite: false, transparent: true } );

	THREE.LineSegments.call( this, geometry, material );

	this.root = object;

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

	this.update();

};


THREE.SkeletonHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.SkeletonHelper.prototype.constructor = THREE.SkeletonHelper;

THREE.SkeletonHelper.prototype.getBoneList = function( object ) {

	var boneList = [];

	if ( object instanceof THREE.Bone ) {

		boneList.push( object );

	}

	for ( var i = 0; i < object.children.length; i ++ ) {

		boneList.push.apply( boneList, this.getBoneList( object.children[ i ] ) );

	}

	return boneList;

};

THREE.SkeletonHelper.prototype.update = function () {

	var geometry = this.geometry;

	var matrixWorldInv = new THREE.Matrix4().getInverse( this.root.matrixWorld );

	var boneMatrix = new THREE.Matrix4();

	var j = 0;

	for ( var i = 0; i < this.bones.length; i ++ ) {

		var bone = this.bones[ i ];

		if ( bone.parent instanceof THREE.Bone ) {

			boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
			geometry.vertices[ j ].setFromMatrixPosition( boneMatrix );

			boneMatrix.multiplyMatrices( matrixWorldInv, bone.parent.matrixWorld );
			geometry.vertices[ j + 1 ].setFromMatrixPosition( boneMatrix );

			j += 2;

		}

	}

	geometry.verticesNeedUpdate = true;

	geometry.computeBoundingSphere();

};

// File:src/extras/helpers/SpotLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.SpotLightHelper = function ( light ) {

	THREE.Object3D.call( this );

	this.light = light;
	this.light.updateMatrixWorld();

	this.matrix = light.matrixWorld;
	this.matrixAutoUpdate = false;

	var geometry = new THREE.BufferGeometry();

	var positions = [
		0, 0, 0,   0,   0,   1,
		0, 0, 0,   1,   0,   1,
		0, 0, 0, - 1,   0,   1,
		0, 0, 0,   0,   1,   1,
		0, 0, 0,   0, - 1,   1
	];

	for ( var i = 0, j = 1, l = 32; i < l; i ++, j ++ ) {

		var p1 = ( i / l ) * Math.PI * 2;
		var p2 = ( j / l ) * Math.PI * 2;

		positions.push(
			Math.cos( p1 ), Math.sin( p1 ), 1,
			Math.cos( p2 ), Math.sin( p2 ), 1
		);

	}

	geometry.addAttribute( 'position', new THREE.Float32Attribute( positions, 3 ) );

	var material = new THREE.LineBasicMaterial( { fog: false } );

	this.cone = new THREE.LineSegments( geometry, material );
	this.add( this.cone );

	this.update();

};

THREE.SpotLightHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.SpotLightHelper.prototype.constructor = THREE.SpotLightHelper;

THREE.SpotLightHelper.prototype.dispose = function () {

	this.cone.geometry.dispose();
	this.cone.material.dispose();

};

THREE.SpotLightHelper.prototype.update = function () {

	var vector = new THREE.Vector3();
	var vector2 = new THREE.Vector3();

	return function () {

		var coneLength = this.light.distance ? this.light.distance : 1000;
		var coneWidth = coneLength * Math.tan( this.light.angle );

		this.cone.scale.set( coneWidth, coneWidth, coneLength );

		vector.setFromMatrixPosition( this.light.matrixWorld );
		vector2.setFromMatrixPosition( this.light.target.matrixWorld );

		this.cone.lookAt( vector2.sub( vector ) );

		this.cone.material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	};

}();

// File:src/extras/helpers/VertexNormalsHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.VertexNormalsHelper = function ( object, size, hex, linewidth ) {

	this.object = object;

	this.size = ( size !== undefined ) ? size : 1;

	var color = ( hex !== undefined ) ? hex : 0xff0000;

	var width = ( linewidth !== undefined ) ? linewidth : 1;

	//

	var nNormals = 0;

	var objGeometry = this.object.geometry;

	if ( objGeometry instanceof THREE.Geometry ) {

		nNormals = objGeometry.faces.length * 3;

	} else if ( objGeometry instanceof THREE.BufferGeometry ) {

		nNormals = objGeometry.attributes.normal.count;

	}

	//

	var geometry = new THREE.BufferGeometry();

	var positions = new THREE.Float32Attribute( nNormals * 2 * 3, 3 );

	geometry.addAttribute( 'position', positions );

	THREE.LineSegments.call( this, geometry, new THREE.LineBasicMaterial( { color: color, linewidth: width } ) );

	//

	this.matrixAutoUpdate = false;

	this.update();

};

THREE.VertexNormalsHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.VertexNormalsHelper.prototype.constructor = THREE.VertexNormalsHelper;

THREE.VertexNormalsHelper.prototype.update = ( function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();
	var normalMatrix = new THREE.Matrix3();

	return function update() {

		var keys = [ 'a', 'b', 'c' ];

		this.object.updateMatrixWorld( true );

		normalMatrix.getNormalMatrix( this.object.matrixWorld );

		var matrixWorld = this.object.matrixWorld;

		var position = this.geometry.attributes.position;

		//

		var objGeometry = this.object.geometry;

		if ( objGeometry instanceof THREE.Geometry ) {

			var vertices = objGeometry.vertices;

			var faces = objGeometry.faces;

			var idx = 0;

			for ( var i = 0, l = faces.length; i < l; i ++ ) {

				var face = faces[ i ];

				for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

					var vertex = vertices[ face[ keys[ j ] ] ];

					var normal = face.vertexNormals[ j ];

					v1.copy( vertex ).applyMatrix4( matrixWorld );

					v2.copy( normal ).applyMatrix3( normalMatrix ).normalize().multiplyScalar( this.size ).add( v1 );

					position.setXYZ( idx, v1.x, v1.y, v1.z );

					idx = idx + 1;

					position.setXYZ( idx, v2.x, v2.y, v2.z );

					idx = idx + 1;

				}

			}

		} else if ( objGeometry instanceof THREE.BufferGeometry ) {

			var objPos = objGeometry.attributes.position;

			var objNorm = objGeometry.attributes.normal;

			var idx = 0;

			// for simplicity, ignore index and drawcalls, and render every normal

			for ( var j = 0, jl = objPos.count; j < jl; j ++ ) {

				v1.set( objPos.getX( j ), objPos.getY( j ), objPos.getZ( j ) ).applyMatrix4( matrixWorld );

				v2.set( objNorm.getX( j ), objNorm.getY( j ), objNorm.getZ( j ) );

				v2.applyMatrix3( normalMatrix ).normalize().multiplyScalar( this.size ).add( v1 );

				position.setXYZ( idx, v1.x, v1.y, v1.z );

				idx = idx + 1;

				position.setXYZ( idx, v2.x, v2.y, v2.z );

				idx = idx + 1;

			}

		}

		position.needsUpdate = true;

		return this;

	};

}() );

// File:src/extras/helpers/WireframeHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.WireframeHelper = function ( object, hex ) {

	var color = ( hex !== undefined ) ? hex : 0xffffff;

	THREE.LineSegments.call( this, new THREE.WireframeGeometry( object.geometry ), new THREE.LineBasicMaterial( { color: color } ) );

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

};

THREE.WireframeHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.WireframeHelper.prototype.constructor = THREE.WireframeHelper;

// File:src/extras/objects/ImmediateRenderObject.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ImmediateRenderObject = function ( material ) {

	THREE.Object3D.call( this );

	this.material = material;
	this.render = function ( renderCallback ) {};

};

THREE.ImmediateRenderObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.ImmediateRenderObject.prototype.constructor = THREE.ImmediateRenderObject;

// File:src/extras/objects/MorphBlendMesh.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MorphBlendMesh = function( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	this.animationsMap = {};
	this.animationsList = [];

	// prepare default animation
	// (all frames played together in 1 second)

	var numFrames = this.geometry.morphTargets.length;

	var name = "__default";

	var startFrame = 0;
	var endFrame = numFrames - 1;

	var fps = numFrames / 1;

	this.createAnimation( name, startFrame, endFrame, fps );
	this.setAnimationWeight( name, 1 );

};

THREE.MorphBlendMesh.prototype = Object.create( THREE.Mesh.prototype );
THREE.MorphBlendMesh.prototype.constructor = THREE.MorphBlendMesh;

THREE.MorphBlendMesh.prototype.createAnimation = function ( name, start, end, fps ) {

	var animation = {

		start: start,
		end: end,

		length: end - start + 1,

		fps: fps,
		duration: ( end - start ) / fps,

		lastFrame: 0,
		currentFrame: 0,

		active: false,

		time: 0,
		direction: 1,
		weight: 1,

		directionBackwards: false,
		mirroredLoop: false

	};

	this.animationsMap[ name ] = animation;
	this.animationsList.push( animation );

};

THREE.MorphBlendMesh.prototype.autoCreateAnimations = function ( fps ) {

	var pattern = /([a-z]+)_?(\d+)/i;

	var firstAnimation, frameRanges = {};

	var geometry = this.geometry;

	for ( var i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

		var morph = geometry.morphTargets[ i ];
		var chunks = morph.name.match( pattern );

		if ( chunks && chunks.length > 1 ) {

			var name = chunks[ 1 ];

			if ( ! frameRanges[ name ] ) frameRanges[ name ] = { start: Infinity, end: - Infinity };

			var range = frameRanges[ name ];

			if ( i < range.start ) range.start = i;
			if ( i > range.end ) range.end = i;

			if ( ! firstAnimation ) firstAnimation = name;

		}

	}

	for ( var name in frameRanges ) {

		var range = frameRanges[ name ];
		this.createAnimation( name, range.start, range.end, fps );

	}

	this.firstAnimation = firstAnimation;

};

THREE.MorphBlendMesh.prototype.setAnimationDirectionForward = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.direction = 1;
		animation.directionBackwards = false;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.direction = - 1;
		animation.directionBackwards = true;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationFPS = function ( name, fps ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.fps = fps;
		animation.duration = ( animation.end - animation.start ) / animation.fps;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationDuration = function ( name, duration ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.duration = duration;
		animation.fps = ( animation.end - animation.start ) / animation.duration;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationWeight = function ( name, weight ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.weight = weight;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationTime = function ( name, time ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.time = time;

	}

};

THREE.MorphBlendMesh.prototype.getAnimationTime = function ( name ) {

	var time = 0;

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		time = animation.time;

	}

	return time;

};

THREE.MorphBlendMesh.prototype.getAnimationDuration = function ( name ) {

	var duration = - 1;

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		duration = animation.duration;

	}

	return duration;

};

THREE.MorphBlendMesh.prototype.playAnimation = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.time = 0;
		animation.active = true;

	} else {

		console.warn( "THREE.MorphBlendMesh: animation[" + name + "] undefined in .playAnimation()" );

	}

};

THREE.MorphBlendMesh.prototype.stopAnimation = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.active = false;

	}

};

THREE.MorphBlendMesh.prototype.update = function ( delta ) {

	for ( var i = 0, il = this.animationsList.length; i < il; i ++ ) {

		var animation = this.animationsList[ i ];

		if ( ! animation.active ) continue;

		var frameTime = animation.duration / animation.length;

		animation.time += animation.direction * delta;

		if ( animation.mirroredLoop ) {

			if ( animation.time > animation.duration || animation.time < 0 ) {

				animation.direction *= - 1;

				if ( animation.time > animation.duration ) {

					animation.time = animation.duration;
					animation.directionBackwards = true;

				}

				if ( animation.time < 0 ) {

					animation.time = 0;
					animation.directionBackwards = false;

				}

			}

		} else {

			animation.time = animation.time % animation.duration;

			if ( animation.time < 0 ) animation.time += animation.duration;

		}

		var keyframe = animation.start + THREE.Math.clamp( Math.floor( animation.time / frameTime ), 0, animation.length - 1 );
		var weight = animation.weight;

		if ( keyframe !== animation.currentFrame ) {

			this.morphTargetInfluences[ animation.lastFrame ] = 0;
			this.morphTargetInfluences[ animation.currentFrame ] = 1 * weight;

			this.morphTargetInfluences[ keyframe ] = 0;

			animation.lastFrame = animation.currentFrame;
			animation.currentFrame = keyframe;

		}

		var mix = ( animation.time % frameTime ) / frameTime;

		if ( animation.directionBackwards ) mix = 1 - mix;

		if ( animation.currentFrame !== animation.lastFrame ) {

			this.morphTargetInfluences[ animation.currentFrame ] = mix * weight;
			this.morphTargetInfluences[ animation.lastFrame ] = ( 1 - mix ) * weight;

		} else {

			this.morphTargetInfluences[ animation.currentFrame ] = weight;

		}

	}

};


// Export the THREE object for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `_` as a global object via a string identifier,
// for Closure Compiler "advanced" mode.
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = THREE;
  }
  exports.THREE = THREE;
} else {
  this['THREE'] = THREE;
}

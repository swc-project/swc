import { Color } from '../math/Color.js';
import { Vector3 } from '../math/Vector3.js';
import { LightProbe } from './LightProbe.js';

function HemisphereLightProbe( skyColor, groundColor, intensity ) {

	LightProbe.call( this, undefined, intensity );

	const color1 = new Color().set( skyColor );
	const color2 = new Color().set( groundColor );

	const sky = new Vector3( color1.r, color1.g, color1.b );
	const ground = new Vector3( color2.r, color2.g, color2.b );

	// without extra factor of PI in the shader, should = 1 / Math.sqrt( Math.PI );
	const c0 = Math.sqrt( Math.PI );
	const c1 = c0 * Math.sqrt( 0.75 );

	this.sh.coefficients[ 0 ].copy( sky ).add( ground ).multiplyScalar( c0 );
	this.sh.coefficients[ 1 ].copy( sky ).sub( ground ).multiplyScalar( c1 );

}

HemisphereLightProbe.prototype = Object.assign( Object.create( LightProbe.prototype ), {

	constructor: HemisphereLightProbe,

	isHemisphereLightProbe: true,

	copy: function ( source ) { // modifying colors not currently supported

		LightProbe.prototype.copy.call( this, source );

		return this;

	},

	toJSON: function ( meta ) {

		const data = LightProbe.prototype.toJSON.call( this, meta );

		// data.sh = this.sh.toArray(); // todo

		return data;

	}

} );

export { HemisphereLightProbe };

import { Color } from '../math/Color.js';
import { LightProbe } from './LightProbe.js';

function AmbientLightProbe( color, intensity ) {

	LightProbe.call( this, undefined, intensity );

	const color1 = new Color().set( color );

	// without extra factor of PI in the shader, would be 2 / Math.sqrt( Math.PI );
	this.sh.coefficients[ 0 ].set( color1.r, color1.g, color1.b ).multiplyScalar( 2 * Math.sqrt( Math.PI ) );

}

AmbientLightProbe.prototype = Object.assign( Object.create( LightProbe.prototype ), {

	constructor: AmbientLightProbe,

	isAmbientLightProbe: true,

	copy: function ( source ) { // modifying color not currently supported

		LightProbe.prototype.copy.call( this, source );

		return this;

	},

	toJSON: function ( meta ) {

		const data = LightProbe.prototype.toJSON.call( this, meta );

		// data.sh = this.sh.toArray(); // todo

		return data;

	}

} );

export { AmbientLightProbe };

import { Material } from './Material.js';
import { Color } from '../math/Color.js';

/**
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round"
 * }
 */

function LineBasicMaterial( parameters ) {

	Material.call( this );

	this.type = 'LineBasicMaterial';

	this.color = new Color( 0xffffff );

	this.linewidth = 1;
	this.linecap = 'round';
	this.linejoin = 'round';

	this.morphTargets = false;

	this.setValues( parameters );

}

LineBasicMaterial.prototype = Object.create( Material.prototype );
LineBasicMaterial.prototype.constructor = LineBasicMaterial;

LineBasicMaterial.prototype.isLineBasicMaterial = true;

LineBasicMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.linewidth = source.linewidth;
	this.linecap = source.linecap;
	this.linejoin = source.linejoin;

	this.morphTargets = source.morphTargets;

	return this;

};


export { LineBasicMaterial };

import { Vector3 } from '../math/Vector3.js';
import { Color } from '../math/Color.js';
import { Object3D } from '../core/Object3D.js';
import { Mesh } from '../objects/Mesh.js';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial.js';
import { OctahedronBufferGeometry } from '../geometries/OctahedronGeometry.js';
import { BufferAttribute } from '../core/BufferAttribute.js';

const _vector = new Vector3();
const _color1 = new Color();
const _color2 = new Color();

class HemisphereLightHelper extends Object3D {

	constructor( light, size, color ) {

		super();
		this.light = light;
		this.light.updateMatrixWorld();

		this.matrix = light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.color = color;

		const geometry = new OctahedronBufferGeometry( size );
		geometry.rotateY( Math.PI * 0.5 );

		this.material = new MeshBasicMaterial( { wireframe: true, fog: false, toneMapped: false } );
		if ( this.color === undefined ) this.material.vertexColors = true;

		const position = geometry.getAttribute( 'position' );
		const colors = new Float32Array( position.count * 3 );

		geometry.setAttribute( 'color', new BufferAttribute( colors, 3 ) );

		this.add( new Mesh( geometry, this.material ) );

		this.update();

	}

	dispose() {

		this.children[ 0 ].geometry.dispose();
		this.children[ 0 ].material.dispose();

	}

	update() {

		const mesh = this.children[ 0 ];

		if ( this.color !== undefined ) {

			this.material.color.set( this.color );

		} else {

			const colors = mesh.geometry.getAttribute( 'color' );

			_color1.copy( this.light.color );
			_color2.copy( this.light.groundColor );

			for ( let i = 0, l = colors.count; i < l; i ++ ) {

				const color = ( i < ( l / 2 ) ) ? _color1 : _color2;

				colors.setXYZ( i, color.r, color.g, color.b );

			}

			colors.needsUpdate = true;

		}

		mesh.lookAt( _vector.setFromMatrixPosition( this.light.matrixWorld ).negate() );

	}

}


export { HemisphereLightHelper };

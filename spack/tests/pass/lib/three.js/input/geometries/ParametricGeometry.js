import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

/**
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout https://prideout.net/blog/old/blog/index.html@p=44.html
 */

// ParametricGeometry

function ParametricGeometry( func, slices, stacks ) {

	Geometry.call( this );

	this.type = 'ParametricGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	this.fromBufferGeometry( new ParametricBufferGeometry( func, slices, stacks ) );
	this.mergeVertices();

}

ParametricGeometry.prototype = Object.create( Geometry.prototype );
ParametricGeometry.prototype.constructor = ParametricGeometry;

// ParametricBufferGeometry

function ParametricBufferGeometry( func, slices, stacks ) {

	BufferGeometry.call( this );

	this.type = 'ParametricBufferGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	// buffers

	const indices = [];
	const vertices = [];
	const normals = [];
	const uvs = [];

	const EPS = 0.00001;

	const normal = new Vector3();

	const p0 = new Vector3(), p1 = new Vector3();
	const pu = new Vector3(), pv = new Vector3();

	if ( func.length < 3 ) {

		console.error( 'THREE.ParametricGeometry: Function must now modify a Vector3 as third parameter.' );

	}

	// generate vertices, normals and uvs

	const sliceCount = slices + 1;

	for ( let i = 0; i <= stacks; i ++ ) {

		const v = i / stacks;

		for ( let j = 0; j <= slices; j ++ ) {

			const u = j / slices;

			// vertex

			func( u, v, p0 );
			vertices.push( p0.x, p0.y, p0.z );

			// normal

			// approximate tangent vectors via finite differences

			if ( u - EPS >= 0 ) {

				func( u - EPS, v, p1 );
				pu.subVectors( p0, p1 );

			} else {

				func( u + EPS, v, p1 );
				pu.subVectors( p1, p0 );

			}

			if ( v - EPS >= 0 ) {

				func( u, v - EPS, p1 );
				pv.subVectors( p0, p1 );

			} else {

				func( u, v + EPS, p1 );
				pv.subVectors( p1, p0 );

			}

			// cross product of tangent vectors returns surface normal

			normal.crossVectors( pu, pv ).normalize();
			normals.push( normal.x, normal.y, normal.z );

			// uv

			uvs.push( u, v );

		}

	}

	// generate indices

	for ( let i = 0; i < stacks; i ++ ) {

		for ( let j = 0; j < slices; j ++ ) {

			const a = i * sliceCount + j;
			const b = i * sliceCount + j + 1;
			const c = ( i + 1 ) * sliceCount + j + 1;
			const d = ( i + 1 ) * sliceCount + j;

			// faces one and two

			indices.push( a, b, d );
			indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( indices );
	this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

}

ParametricBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
ParametricBufferGeometry.prototype.constructor = ParametricBufferGeometry;


export { ParametricGeometry, ParametricBufferGeometry };

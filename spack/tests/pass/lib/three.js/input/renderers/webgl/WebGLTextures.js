import { LinearFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, NearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, RGBFormat, RGBAFormat, DepthFormat, DepthStencilFormat, UnsignedShortType, UnsignedIntType, UnsignedInt248Type, FloatType, HalfFloatType, MirroredRepeatWrapping, ClampToEdgeWrapping, RepeatWrapping } from '../../constants.js';
import { MathUtils } from '../../math/MathUtils.js';

function WebGLTextures( _gl, extensions, state, properties, capabilities, utils, info ) {

	const isWebGL2 = capabilities.isWebGL2;
	const maxTextures = capabilities.maxTextures;
	const maxCubemapSize = capabilities.maxCubemapSize;
	const maxTextureSize = capabilities.maxTextureSize;
	const maxSamples = capabilities.maxSamples;

	const _videoTextures = new WeakMap();
	let _canvas;

	// cordova iOS (as of 5.0) still uses UIWebView, which provides OffscreenCanvas,
	// also OffscreenCanvas.getContext("webgl"), but not OffscreenCanvas.getContext("2d")!
	// Some implementations may only implement OffscreenCanvas partially (e.g. lacking 2d).

	let useOffscreenCanvas = false;

	try {

		useOffscreenCanvas = typeof OffscreenCanvas !== 'undefined'
			&& ( new OffscreenCanvas( 1, 1 ).getContext( "2d" ) ) !== null;

	} catch ( err ) {

		// Ignore any errors

	}

	function createCanvas( width, height ) {

		// Use OffscreenCanvas when available. Specially needed in web workers

		return useOffscreenCanvas ?
			new OffscreenCanvas( width, height ) :
			document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' );

	}

	function resizeImage( image, needsPowerOfTwo, needsNewCanvas, maxSize ) {

		let scale = 1;

		// handle case if texture exceeds max size

		if ( image.width > maxSize || image.height > maxSize ) {

			scale = maxSize / Math.max( image.width, image.height );

		}

		// only perform resize if necessary

		if ( scale < 1 || needsPowerOfTwo === true ) {

			// only perform resize for certain image types

			if ( ( typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement ) ||
				( typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement ) ||
				( typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap ) ) {

				const floor = needsPowerOfTwo ? MathUtils.floorPowerOfTwo : Math.floor;

				const width = floor( scale * image.width );
				const height = floor( scale * image.height );

				if ( _canvas === undefined ) _canvas = createCanvas( width, height );

				// cube textures can't reuse the same canvas

				const canvas = needsNewCanvas ? createCanvas( width, height ) : _canvas;

				canvas.width = width;
				canvas.height = height;

				const context = canvas.getContext( '2d' );
				context.drawImage( image, 0, 0, width, height );

				console.warn( 'THREE.WebGLRenderer: Texture has been resized from (' + image.width + 'x' + image.height + ') to (' + width + 'x' + height + ').' );

				return canvas;

			} else {

				if ( 'data' in image ) {

					console.warn( 'THREE.WebGLRenderer: Image in DataTexture is too big (' + image.width + 'x' + image.height + ').' );

				}

				return image;

			}

		}

		return image;

	}

	function isPowerOfTwo( image ) {

		return MathUtils.isPowerOfTwo( image.width ) && MathUtils.isPowerOfTwo( image.height );

	}

	function textureNeedsPowerOfTwo( texture ) {

		if ( isWebGL2 ) return false;

		return ( texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping ) ||
			( texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter );

	}

	function textureNeedsGenerateMipmaps( texture, supportsMips ) {

		return texture.generateMipmaps && supportsMips &&
			texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter;

	}

	function generateMipmap( target, texture, width, height ) {

		_gl.generateMipmap( target );

		const textureProperties = properties.get( texture );

		// Note: Math.log( x ) * Math.LOG2E used instead of Math.log2( x ) which is not supported by IE11
		textureProperties.__maxMipLevel = Math.log( Math.max( width, height ) ) * Math.LOG2E;

	}

	function getInternalFormat( internalFormatName, glFormat, glType ) {

		if ( isWebGL2 === false ) return glFormat;

		if ( internalFormatName !== null ) {

			if ( _gl[ internalFormatName ] !== undefined ) return _gl[ internalFormatName ];

			console.warn( 'THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format \'' + internalFormatName + '\'' );

		}

		let internalFormat = glFormat;

		if ( glFormat === _gl.RED ) {

			if ( glType === _gl.FLOAT ) internalFormat = _gl.R32F;
			if ( glType === _gl.HALF_FLOAT ) internalFormat = _gl.R16F;
			if ( glType === _gl.UNSIGNED_BYTE ) internalFormat = _gl.R8;

		}

		if ( glFormat === _gl.RGB ) {

			if ( glType === _gl.FLOAT ) internalFormat = _gl.RGB32F;
			if ( glType === _gl.HALF_FLOAT ) internalFormat = _gl.RGB16F;
			if ( glType === _gl.UNSIGNED_BYTE ) internalFormat = _gl.RGB8;

		}

		if ( glFormat === _gl.RGBA ) {

			if ( glType === _gl.FLOAT ) internalFormat = _gl.RGBA32F;
			if ( glType === _gl.HALF_FLOAT ) internalFormat = _gl.RGBA16F;
			if ( glType === _gl.UNSIGNED_BYTE ) internalFormat = _gl.RGBA8;

		}

		if ( internalFormat === _gl.R16F || internalFormat === _gl.R32F ||
			internalFormat === _gl.RGBA16F || internalFormat === _gl.RGBA32F ) {

			extensions.get( 'EXT_color_buffer_float' );

		}

		return internalFormat;

	}

	// Fallback filters for non-power-of-2 textures

	function filterFallback( f ) {

		if ( f === NearestFilter || f === NearestMipmapNearestFilter || f === NearestMipmapLinearFilter ) {

			return _gl.NEAREST;

		}

		return _gl.LINEAR;

	}

	//

	function onTextureDispose( event ) {

		const texture = event.target;

		texture.removeEventListener( 'dispose', onTextureDispose );

		deallocateTexture( texture );

		if ( texture.isVideoTexture ) {

			_videoTextures.delete( texture );

		}

		info.memory.textures --;

	}

	function onRenderTargetDispose( event ) {

		const renderTarget = event.target;

		renderTarget.removeEventListener( 'dispose', onRenderTargetDispose );

		deallocateRenderTarget( renderTarget );

		info.memory.textures --;

	}

	//

	function deallocateTexture( texture ) {

		const textureProperties = properties.get( texture );

		if ( textureProperties.__webglInit === undefined ) return;

		_gl.deleteTexture( textureProperties.__webglTexture );

		properties.remove( texture );

	}

	function deallocateRenderTarget( renderTarget ) {

		const renderTargetProperties = properties.get( renderTarget );
		const textureProperties = properties.get( renderTarget.texture );

		if ( ! renderTarget ) return;

		if ( textureProperties.__webglTexture !== undefined ) {

			_gl.deleteTexture( textureProperties.__webglTexture );

		}

		if ( renderTarget.depthTexture ) {

			renderTarget.depthTexture.dispose();

		}

		if ( renderTarget.isWebGLCubeRenderTarget ) {

			for ( let i = 0; i < 6; i ++ ) {

				_gl.deleteFramebuffer( renderTargetProperties.__webglFramebuffer[ i ] );
				if ( renderTargetProperties.__webglDepthbuffer ) _gl.deleteRenderbuffer( renderTargetProperties.__webglDepthbuffer[ i ] );

			}

		} else {

			_gl.deleteFramebuffer( renderTargetProperties.__webglFramebuffer );
			if ( renderTargetProperties.__webglDepthbuffer ) _gl.deleteRenderbuffer( renderTargetProperties.__webglDepthbuffer );
			if ( renderTargetProperties.__webglMultisampledFramebuffer ) _gl.deleteFramebuffer( renderTargetProperties.__webglMultisampledFramebuffer );
			if ( renderTargetProperties.__webglColorRenderbuffer ) _gl.deleteRenderbuffer( renderTargetProperties.__webglColorRenderbuffer );
			if ( renderTargetProperties.__webglDepthRenderbuffer ) _gl.deleteRenderbuffer( renderTargetProperties.__webglDepthRenderbuffer );

		}

		properties.remove( renderTarget.texture );
		properties.remove( renderTarget );

	}

	//

	let textureUnits = 0;

	function resetTextureUnits() {

		textureUnits = 0;

	}

	function allocateTextureUnit() {

		const textureUnit = textureUnits;

		if ( textureUnit >= maxTextures ) {

			console.warn( 'THREE.WebGLTextures: Trying to use ' + textureUnit + ' texture units while this GPU supports only ' + maxTextures );

		}

		textureUnits += 1;

		return textureUnit;

	}

	//

	function setTexture2D( texture, slot ) {

		const textureProperties = properties.get( texture );

		if ( texture.isVideoTexture ) updateVideoTexture( texture );

		if ( texture.version > 0 && textureProperties.__version !== texture.version ) {

			const image = texture.image;

			if ( image === undefined ) {

				console.warn( 'THREE.WebGLRenderer: Texture marked for update but image is undefined' );

			} else if ( image.complete === false ) {

				console.warn( 'THREE.WebGLRenderer: Texture marked for update but image is incomplete' );

			} else {

				uploadTexture( textureProperties, texture, slot );
				return;

			}

		}

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_2D, textureProperties.__webglTexture );

	}

	function setTexture2DArray( texture, slot ) {

		const textureProperties = properties.get( texture );

		if ( texture.version > 0 && textureProperties.__version !== texture.version ) {

			uploadTexture( textureProperties, texture, slot );
			return;

		}

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_2D_ARRAY, textureProperties.__webglTexture );

	}

	function setTexture3D( texture, slot ) {

		const textureProperties = properties.get( texture );

		if ( texture.version > 0 && textureProperties.__version !== texture.version ) {

			uploadTexture( textureProperties, texture, slot );
			return;

		}

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_3D, textureProperties.__webglTexture );

	}

	function setTextureCube( texture, slot ) {

		if ( texture.image.length !== 6 ) return;

		const textureProperties = properties.get( texture );

		if ( texture.version > 0 && textureProperties.__version !== texture.version ) {

			initTexture( textureProperties, texture );

			state.activeTexture( _gl.TEXTURE0 + slot );
			state.bindTexture( _gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture );

			_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );

			const isCompressed = ( texture && ( texture.isCompressedTexture || texture.image[ 0 ].isCompressedTexture ) );
			const isDataTexture = ( texture.image[ 0 ] && texture.image[ 0 ].isDataTexture );

			const cubeImage = [];

			for ( let i = 0; i < 6; i ++ ) {

				if ( ! isCompressed && ! isDataTexture ) {

					cubeImage[ i ] = resizeImage( texture.image[ i ], false, true, maxCubemapSize );

				} else {

					cubeImage[ i ] = isDataTexture ? texture.image[ i ].image : texture.image[ i ];

				}

			}

			const image = cubeImage[ 0 ],
				supportsMips = isPowerOfTwo( image ) || isWebGL2,
				glFormat = utils.convert( texture.format ),
				glType = utils.convert( texture.type ),
				glInternalFormat = getInternalFormat( texture.internalFormat, glFormat, glType );

			setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, supportsMips );

			let mipmaps;

			if ( isCompressed ) {

				for ( let i = 0; i < 6; i ++ ) {

					mipmaps = cubeImage[ i ].mipmaps;

					for ( let j = 0; j < mipmaps.length; j ++ ) {

						const mipmap = mipmaps[ j ];

						if ( texture.format !== RGBAFormat && texture.format !== RGBFormat ) {

							if ( glFormat !== null ) {

								state.compressedTexImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glInternalFormat, mipmap.width, mipmap.height, 0, mipmap.data );

							} else {

								console.warn( 'THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()' );

							}

						} else {

							state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glInternalFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

						}

					}

				}

				textureProperties.__maxMipLevel = mipmaps.length - 1;

			} else {

				mipmaps = texture.mipmaps;

				for ( let i = 0; i < 6; i ++ ) {

					if ( isDataTexture ) {

						state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glInternalFormat, cubeImage[ i ].width, cubeImage[ i ].height, 0, glFormat, glType, cubeImage[ i ].data );

						for ( let j = 0; j < mipmaps.length; j ++ ) {

							const mipmap = mipmaps[ j ];
							const mipmapImage = mipmap.image[ i ].image;

							state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j + 1, glInternalFormat, mipmapImage.width, mipmapImage.height, 0, glFormat, glType, mipmapImage.data );

						}

					} else {

						state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glInternalFormat, glFormat, glType, cubeImage[ i ] );

						for ( let j = 0; j < mipmaps.length; j ++ ) {

							const mipmap = mipmaps[ j ];

							state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j + 1, glInternalFormat, glFormat, glType, mipmap.image[ i ] );

						}

					}

				}

				textureProperties.__maxMipLevel = mipmaps.length;

			}

			if ( textureNeedsGenerateMipmaps( texture, supportsMips ) ) {

				// We assume images for cube map have the same size.
				generateMipmap( _gl.TEXTURE_CUBE_MAP, texture, image.width, image.height );

			}

			textureProperties.__version = texture.version;

			if ( texture.onUpdate ) texture.onUpdate( texture );

		} else {

			state.activeTexture( _gl.TEXTURE0 + slot );
			state.bindTexture( _gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture );

		}

	}

	function setTextureCubeDynamic( texture, slot ) {

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_CUBE_MAP, properties.get( texture ).__webglTexture );

	}

	const wrappingToGL = {
		[ RepeatWrapping ]: _gl.REPEAT,
		[ ClampToEdgeWrapping ]: _gl.CLAMP_TO_EDGE,
		[ MirroredRepeatWrapping ]: _gl.MIRRORED_REPEAT
	};

	const filterToGL = {
		[ NearestFilter ]: _gl.NEAREST,
		[ NearestMipmapNearestFilter ]: _gl.NEAREST_MIPMAP_NEAREST,
		[ NearestMipmapLinearFilter ]: _gl.NEAREST_MIPMAP_LINEAR,

		[ LinearFilter ]: _gl.LINEAR,
		[ LinearMipmapNearestFilter ]: _gl.LINEAR_MIPMAP_NEAREST,
		[ LinearMipmapLinearFilter ]: _gl.LINEAR_MIPMAP_LINEAR
	};

	function setTextureParameters( textureType, texture, supportsMips ) {

		if ( supportsMips ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, wrappingToGL[ texture.wrapS ] );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, wrappingToGL[ texture.wrapT ] );

			if ( textureType === _gl.TEXTURE_3D || textureType === _gl.TEXTURE_2D_ARRAY ) {

				_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_R, wrappingToGL[ texture.wrapR ] );

			}

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterToGL[ texture.magFilter ] );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterToGL[ texture.minFilter ] );

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			if ( textureType === _gl.TEXTURE_3D || textureType === _gl.TEXTURE_2D_ARRAY ) {

				_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_R, _gl.CLAMP_TO_EDGE );

			}

			if ( texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping ) {

				console.warn( 'THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.' );

			}

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

			if ( texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter ) {

				console.warn( 'THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.' );

			}

		}

		const extension = extensions.get( 'EXT_texture_filter_anisotropic' );

		if ( extension ) {

			if ( texture.type === FloatType && extensions.get( 'OES_texture_float_linear' ) === null ) return;
			if ( texture.type === HalfFloatType && ( isWebGL2 || extensions.get( 'OES_texture_half_float_linear' ) ) === null ) return;

			if ( texture.anisotropy > 1 || properties.get( texture ).__currentAnisotropy ) {

				_gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min( texture.anisotropy, capabilities.getMaxAnisotropy() ) );
				properties.get( texture ).__currentAnisotropy = texture.anisotropy;

			}

		}

	}

	function initTexture( textureProperties, texture ) {

		if ( textureProperties.__webglInit === undefined ) {

			textureProperties.__webglInit = true;

			texture.addEventListener( 'dispose', onTextureDispose );

			textureProperties.__webglTexture = _gl.createTexture();

			info.memory.textures ++;

		}

	}

	function uploadTexture( textureProperties, texture, slot ) {

		let textureType = _gl.TEXTURE_2D;

		if ( texture.isDataTexture2DArray ) textureType = _gl.TEXTURE_2D_ARRAY;
		if ( texture.isDataTexture3D ) textureType = _gl.TEXTURE_3D;

		initTexture( textureProperties, texture );

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( textureType, textureProperties.__webglTexture );

		_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
		_gl.pixelStorei( _gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha );
		_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, texture.unpackAlignment );

		const needsPowerOfTwo = textureNeedsPowerOfTwo( texture ) && isPowerOfTwo( texture.image ) === false;
		const image = resizeImage( texture.image, needsPowerOfTwo, false, maxTextureSize );

		const supportsMips = isPowerOfTwo( image ) || isWebGL2,
			glFormat = utils.convert( texture.format );

		let glType = utils.convert( texture.type ),
			glInternalFormat = getInternalFormat( texture.internalFormat, glFormat, glType );

		setTextureParameters( textureType, texture, supportsMips );

		let mipmap;
		const mipmaps = texture.mipmaps;

		if ( texture.isDepthTexture ) {

			// populate depth texture with dummy data

			glInternalFormat = _gl.DEPTH_COMPONENT;

			if ( isWebGL2 ) {

				if ( texture.type === FloatType ) {

					glInternalFormat = _gl.DEPTH_COMPONENT32F;

				} else if ( texture.type === UnsignedIntType ) {

					glInternalFormat = _gl.DEPTH_COMPONENT24;

				} else if ( texture.type === UnsignedInt248Type ) {

					glInternalFormat = _gl.DEPTH24_STENCIL8;

				} else {

					glInternalFormat = _gl.DEPTH_COMPONENT16; // WebGL2 requires sized internalformat for glTexImage2D

				}

			} else {

				if ( texture.type === FloatType ) {

					console.error( 'WebGLRenderer: Floating point depth texture requires WebGL2.' );

				}

			}

			// validation checks for WebGL 1

			if ( texture.format === DepthFormat && glInternalFormat === _gl.DEPTH_COMPONENT ) {

				// The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
				// DEPTH_COMPONENT and type is not UNSIGNED_SHORT or UNSIGNED_INT
				// (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
				if ( texture.type !== UnsignedShortType && texture.type !== UnsignedIntType ) {

					console.warn( 'THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture.' );

					texture.type = UnsignedShortType;
					glType = utils.convert( texture.type );

				}

			}

			if ( texture.format === DepthStencilFormat && glInternalFormat === _gl.DEPTH_COMPONENT ) {

				// Depth stencil textures need the DEPTH_STENCIL internal format
				// (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
				glInternalFormat = _gl.DEPTH_STENCIL;

				// The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
				// DEPTH_STENCIL and type is not UNSIGNED_INT_24_8_WEBGL.
				// (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
				if ( texture.type !== UnsignedInt248Type ) {

					console.warn( 'THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture.' );

					texture.type = UnsignedInt248Type;
					glType = utils.convert( texture.type );

				}

			}

			//

			state.texImage2D( _gl.TEXTURE_2D, 0, glInternalFormat, image.width, image.height, 0, glFormat, glType, null );

		} else if ( texture.isDataTexture ) {

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && supportsMips ) {

				for ( let i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					state.texImage2D( _gl.TEXTURE_2D, i, glInternalFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

				texture.generateMipmaps = false;
				textureProperties.__maxMipLevel = mipmaps.length - 1;

			} else {

				state.texImage2D( _gl.TEXTURE_2D, 0, glInternalFormat, image.width, image.height, 0, glFormat, glType, image.data );
				textureProperties.__maxMipLevel = 0;

			}

		} else if ( texture.isCompressedTexture ) {

			for ( let i = 0, il = mipmaps.length; i < il; i ++ ) {

				mipmap = mipmaps[ i ];

				if ( texture.format !== RGBAFormat && texture.format !== RGBFormat ) {

					if ( glFormat !== null ) {

						state.compressedTexImage2D( _gl.TEXTURE_2D, i, glInternalFormat, mipmap.width, mipmap.height, 0, mipmap.data );

					} else {

						console.warn( 'THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()' );

					}

				} else {

					state.texImage2D( _gl.TEXTURE_2D, i, glInternalFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

			}

			textureProperties.__maxMipLevel = mipmaps.length - 1;

		} else if ( texture.isDataTexture2DArray ) {

			state.texImage3D( _gl.TEXTURE_2D_ARRAY, 0, glInternalFormat, image.width, image.height, image.depth, 0, glFormat, glType, image.data );
			textureProperties.__maxMipLevel = 0;

		} else if ( texture.isDataTexture3D ) {

			state.texImage3D( _gl.TEXTURE_3D, 0, glInternalFormat, image.width, image.height, image.depth, 0, glFormat, glType, image.data );
			textureProperties.__maxMipLevel = 0;

		} else {

			// regular Texture (image, video, canvas)

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && supportsMips ) {

				for ( let i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					state.texImage2D( _gl.TEXTURE_2D, i, glInternalFormat, glFormat, glType, mipmap );

				}

				texture.generateMipmaps = false;
				textureProperties.__maxMipLevel = mipmaps.length - 1;

			} else {

				state.texImage2D( _gl.TEXTURE_2D, 0, glInternalFormat, glFormat, glType, image );
				textureProperties.__maxMipLevel = 0;

			}

		}

		if ( textureNeedsGenerateMipmaps( texture, supportsMips ) ) {

			generateMipmap( textureType, texture, image.width, image.height );

		}

		textureProperties.__version = texture.version;

		if ( texture.onUpdate ) texture.onUpdate( texture );

	}

	// Render targets

	// Setup storage for target texture and bind it to correct framebuffer
	function setupFrameBufferTexture( framebuffer, renderTarget, attachment, textureTarget ) {

		const glFormat = utils.convert( renderTarget.texture.format );
		const glType = utils.convert( renderTarget.texture.type );
		const glInternalFormat = getInternalFormat( renderTarget.texture.internalFormat, glFormat, glType );
		state.texImage2D( textureTarget, 0, glInternalFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );
		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, attachment, textureTarget, properties.get( renderTarget.texture ).__webglTexture, 0 );
		_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );

	}

	// Setup storage for internal depth/stencil buffers and bind to correct framebuffer
	function setupRenderBufferStorage( renderbuffer, renderTarget, isMultisample ) {

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

		if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

			let glInternalFormat = _gl.DEPTH_COMPONENT16;

			if ( isMultisample ) {

				const depthTexture = renderTarget.depthTexture;

				if ( depthTexture && depthTexture.isDepthTexture ) {

					if ( depthTexture.type === FloatType ) {

						glInternalFormat = _gl.DEPTH_COMPONENT32F;

					} else if ( depthTexture.type === UnsignedIntType ) {

						glInternalFormat = _gl.DEPTH_COMPONENT24;

					}

				}

				const samples = getRenderTargetSamples( renderTarget );

				_gl.renderbufferStorageMultisample( _gl.RENDERBUFFER, samples, glInternalFormat, renderTarget.width, renderTarget.height );

			} else {

				_gl.renderbufferStorage( _gl.RENDERBUFFER, glInternalFormat, renderTarget.width, renderTarget.height );

			}

			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			if ( isMultisample ) {

				const samples = getRenderTargetSamples( renderTarget );

				_gl.renderbufferStorageMultisample( _gl.RENDERBUFFER, samples, _gl.DEPTH24_STENCIL8, renderTarget.width, renderTarget.height );

			} else {

				_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );

			}


			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else {

			const glFormat = utils.convert( renderTarget.texture.format );
			const glType = utils.convert( renderTarget.texture.type );
			const glInternalFormat = getInternalFormat( renderTarget.texture.internalFormat, glFormat, glType );

			if ( isMultisample ) {

				const samples = getRenderTargetSamples( renderTarget );

				_gl.renderbufferStorageMultisample( _gl.RENDERBUFFER, samples, glInternalFormat, renderTarget.width, renderTarget.height );

			} else {

				_gl.renderbufferStorage( _gl.RENDERBUFFER, glInternalFormat, renderTarget.width, renderTarget.height );

			}

		}

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );

	}

	// Setup resources for a Depth Texture for a FBO (needs an extension)
	function setupDepthTexture( framebuffer, renderTarget ) {

		const isCube = ( renderTarget && renderTarget.isWebGLCubeRenderTarget );
		if ( isCube ) throw new Error( 'Depth Texture with cube render targets is not supported' );

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );

		if ( ! ( renderTarget.depthTexture && renderTarget.depthTexture.isDepthTexture ) ) {

			throw new Error( 'renderTarget.depthTexture must be an instance of THREE.DepthTexture' );

		}

		// upload an empty depth texture with framebuffer size
		if ( ! properties.get( renderTarget.depthTexture ).__webglTexture ||
				renderTarget.depthTexture.image.width !== renderTarget.width ||
				renderTarget.depthTexture.image.height !== renderTarget.height ) {

			renderTarget.depthTexture.image.width = renderTarget.width;
			renderTarget.depthTexture.image.height = renderTarget.height;
			renderTarget.depthTexture.needsUpdate = true;

		}

		setTexture2D( renderTarget.depthTexture, 0 );

		const webglDepthTexture = properties.get( renderTarget.depthTexture ).__webglTexture;

		if ( renderTarget.depthTexture.format === DepthFormat ) {

			_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D, webglDepthTexture, 0 );

		} else if ( renderTarget.depthTexture.format === DepthStencilFormat ) {

			_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.TEXTURE_2D, webglDepthTexture, 0 );

		} else {

			throw new Error( 'Unknown depthTexture format' );

		}

	}

	// Setup GL resources for a non-texture depth buffer
	function setupDepthRenderbuffer( renderTarget ) {

		const renderTargetProperties = properties.get( renderTarget );

		const isCube = ( renderTarget.isWebGLCubeRenderTarget === true );

		if ( renderTarget.depthTexture ) {

			if ( isCube ) throw new Error( 'target.depthTexture not supported in Cube render targets' );

			setupDepthTexture( renderTargetProperties.__webglFramebuffer, renderTarget );

		} else {

			if ( isCube ) {

				renderTargetProperties.__webglDepthbuffer = [];

				for ( let i = 0; i < 6; i ++ ) {

					_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer[ i ] );
					renderTargetProperties.__webglDepthbuffer[ i ] = _gl.createRenderbuffer();
					setupRenderBufferStorage( renderTargetProperties.__webglDepthbuffer[ i ], renderTarget, false );

				}

			} else {

				_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer );
				renderTargetProperties.__webglDepthbuffer = _gl.createRenderbuffer();
				setupRenderBufferStorage( renderTargetProperties.__webglDepthbuffer, renderTarget, false );

			}

		}

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );

	}

	// Set up GL resources for the render target
	function setupRenderTarget( renderTarget ) {

		const renderTargetProperties = properties.get( renderTarget );
		const textureProperties = properties.get( renderTarget.texture );

		renderTarget.addEventListener( 'dispose', onRenderTargetDispose );

		textureProperties.__webglTexture = _gl.createTexture();

		info.memory.textures ++;

		const isCube = ( renderTarget.isWebGLCubeRenderTarget === true );
		const isMultisample = ( renderTarget.isWebGLMultisampleRenderTarget === true );
		const supportsMips = isPowerOfTwo( renderTarget ) || isWebGL2;

		// Handles WebGL2 RGBFormat fallback - #18858

		if ( isWebGL2 && renderTarget.texture.format === RGBFormat && ( renderTarget.texture.type === FloatType || renderTarget.texture.type === HalfFloatType ) ) {

			renderTarget.texture.format = RGBAFormat;

			console.warn( 'THREE.WebGLRenderer: Rendering to textures with RGB format is not supported. Using RGBA format instead.' );

		}

		// Setup framebuffer

		if ( isCube ) {

			renderTargetProperties.__webglFramebuffer = [];

			for ( let i = 0; i < 6; i ++ ) {

				renderTargetProperties.__webglFramebuffer[ i ] = _gl.createFramebuffer();

			}

		} else {

			renderTargetProperties.__webglFramebuffer = _gl.createFramebuffer();

			if ( isMultisample ) {

				if ( isWebGL2 ) {

					renderTargetProperties.__webglMultisampledFramebuffer = _gl.createFramebuffer();
					renderTargetProperties.__webglColorRenderbuffer = _gl.createRenderbuffer();

					_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderTargetProperties.__webglColorRenderbuffer );

					const glFormat = utils.convert( renderTarget.texture.format );
					const glType = utils.convert( renderTarget.texture.type );
					const glInternalFormat = getInternalFormat( renderTarget.texture.internalFormat, glFormat, glType );
					const samples = getRenderTargetSamples( renderTarget );
					_gl.renderbufferStorageMultisample( _gl.RENDERBUFFER, samples, glInternalFormat, renderTarget.width, renderTarget.height );

					_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTargetProperties.__webglMultisampledFramebuffer );
					_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.RENDERBUFFER, renderTargetProperties.__webglColorRenderbuffer );
					_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );

					if ( renderTarget.depthBuffer ) {

						renderTargetProperties.__webglDepthRenderbuffer = _gl.createRenderbuffer();
						setupRenderBufferStorage( renderTargetProperties.__webglDepthRenderbuffer, renderTarget, true );

					}

					_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );


				} else {

					console.warn( 'THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.' );

				}

			}

		}

		// Setup color buffer

		if ( isCube ) {

			state.bindTexture( _gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture );
			setTextureParameters( _gl.TEXTURE_CUBE_MAP, renderTarget.texture, supportsMips );

			for ( let i = 0; i < 6; i ++ ) {

				setupFrameBufferTexture( renderTargetProperties.__webglFramebuffer[ i ], renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i );

			}

			if ( textureNeedsGenerateMipmaps( renderTarget.texture, supportsMips ) ) {

				generateMipmap( _gl.TEXTURE_CUBE_MAP, renderTarget.texture, renderTarget.width, renderTarget.height );

			}

			state.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

		} else {

			state.bindTexture( _gl.TEXTURE_2D, textureProperties.__webglTexture );
			setTextureParameters( _gl.TEXTURE_2D, renderTarget.texture, supportsMips );
			setupFrameBufferTexture( renderTargetProperties.__webglFramebuffer, renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D );

			if ( textureNeedsGenerateMipmaps( renderTarget.texture, supportsMips ) ) {

				generateMipmap( _gl.TEXTURE_2D, renderTarget.texture, renderTarget.width, renderTarget.height );

			}

			state.bindTexture( _gl.TEXTURE_2D, null );

		}

		// Setup depth and stencil buffers

		if ( renderTarget.depthBuffer ) {

			setupDepthRenderbuffer( renderTarget );

		}

	}

	function updateRenderTargetMipmap( renderTarget ) {

		const texture = renderTarget.texture;
		const supportsMips = isPowerOfTwo( renderTarget ) || isWebGL2;

		if ( textureNeedsGenerateMipmaps( texture, supportsMips ) ) {

			const target = renderTarget.isWebGLCubeRenderTarget ? _gl.TEXTURE_CUBE_MAP : _gl.TEXTURE_2D;
			const webglTexture = properties.get( texture ).__webglTexture;

			state.bindTexture( target, webglTexture );
			generateMipmap( target, texture, renderTarget.width, renderTarget.height );
			state.bindTexture( target, null );

		}

	}

	function updateMultisampleRenderTarget( renderTarget ) {

		if ( renderTarget.isWebGLMultisampleRenderTarget ) {

			if ( isWebGL2 ) {

				const renderTargetProperties = properties.get( renderTarget );

				_gl.bindFramebuffer( _gl.READ_FRAMEBUFFER, renderTargetProperties.__webglMultisampledFramebuffer );
				_gl.bindFramebuffer( _gl.DRAW_FRAMEBUFFER, renderTargetProperties.__webglFramebuffer );

				const width = renderTarget.width;
				const height = renderTarget.height;
				let mask = _gl.COLOR_BUFFER_BIT;

				if ( renderTarget.depthBuffer ) mask |= _gl.DEPTH_BUFFER_BIT;
				if ( renderTarget.stencilBuffer ) mask |= _gl.STENCIL_BUFFER_BIT;

				_gl.blitFramebuffer( 0, 0, width, height, 0, 0, width, height, mask, _gl.NEAREST );

				_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTargetProperties.__webglMultisampledFramebuffer ); // see #18905

			} else {

				console.warn( 'THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.' );

			}

		}

	}

	function getRenderTargetSamples( renderTarget ) {

		return ( isWebGL2 && renderTarget.isWebGLMultisampleRenderTarget ) ?
			Math.min( maxSamples, renderTarget.samples ) : 0;

	}

	function updateVideoTexture( texture ) {

		const frame = info.render.frame;

		// Check the last frame we updated the VideoTexture

		if ( _videoTextures.get( texture ) !== frame ) {

			_videoTextures.set( texture, frame );
			texture.update();

		}

	}

	// backwards compatibility

	let warnedTexture2D = false;
	let warnedTextureCube = false;

	function safeSetTexture2D( texture, slot ) {

		if ( texture && texture.isWebGLRenderTarget ) {

			if ( warnedTexture2D === false ) {

				console.warn( "THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead." );
				warnedTexture2D = true;

			}

			texture = texture.texture;

		}

		setTexture2D( texture, slot );

	}

	function safeSetTextureCube( texture, slot ) {

		if ( texture && texture.isWebGLCubeRenderTarget ) {

			if ( warnedTextureCube === false ) {

				console.warn( "THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead." );
				warnedTextureCube = true;

			}

			texture = texture.texture;

		}

		// currently relying on the fact that WebGLCubeRenderTarget.texture is a Texture and NOT a CubeTexture
		// TODO: unify these code paths
		if ( ( texture && texture.isCubeTexture ) ||
			( Array.isArray( texture.image ) && texture.image.length === 6 ) ) {

			// CompressedTexture can have Array in image :/

			// this function alone should take care of cube textures
			setTextureCube( texture, slot );

		} else {

			// assumed: texture property of THREE.WebGLCubeRenderTarget
			setTextureCubeDynamic( texture, slot );

		}

	}

	//

	this.allocateTextureUnit = allocateTextureUnit;
	this.resetTextureUnits = resetTextureUnits;

	this.setTexture2D = setTexture2D;
	this.setTexture2DArray = setTexture2DArray;
	this.setTexture3D = setTexture3D;
	this.setTextureCube = setTextureCube;
	this.setTextureCubeDynamic = setTextureCubeDynamic;
	this.setupRenderTarget = setupRenderTarget;
	this.updateRenderTargetMipmap = updateRenderTargetMipmap;
	this.updateMultisampleRenderTarget = updateMultisampleRenderTarget;

	this.safeSetTexture2D = safeSetTexture2D;
	this.safeSetTextureCube = safeSetTextureCube;

}

export { WebGLTextures };

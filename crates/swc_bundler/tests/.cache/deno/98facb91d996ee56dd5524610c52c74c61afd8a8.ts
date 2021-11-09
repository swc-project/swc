// Loaded from https://deno.land/x/deno_image@v0.0.3/lib/resize/resize.js


//JavaScript Image Resizer (c) 2012 - Grant Galitz

export class Resize {
	constructor(widthOriginal, heightOriginal, targetWidth, targetHeight, blendAlpha, interpolationPass, useWebWorker, resizeCallback) {
		this.widthOriginal = Math.abs(parseInt(widthOriginal) || 0);
		this.heightOriginal = Math.abs(parseInt(heightOriginal) || 0);
		this.targetWidth = Math.abs(parseInt(targetWidth) || 0);
		this.targetHeight = Math.abs(parseInt(targetHeight) || 0);
		this.colorChannels = (!!blendAlpha) ? 4 : 3;
		this.interpolationPass = !!interpolationPass;
		this.useWebWorker = !!useWebWorker;
		this.resizeCallback = (typeof resizeCallback == "function") ? resizeCallback : function (returnedArray) { };
		this.targetWidthMultipliedByChannels = this.targetWidth * this.colorChannels;
		this.originalWidthMultipliedByChannels = this.widthOriginal * this.colorChannels;
		this.originalHeightMultipliedByChannels = this.heightOriginal * this.colorChannels;
		this.widthPassResultSize = this.targetWidthMultipliedByChannels * this.heightOriginal;
		this.finalResultSize = this.targetWidthMultipliedByChannels * this.targetHeight;
		this.initialize();
	}
	initialize() {
		//Perform some checks:
		if (this.widthOriginal > 0 && this.heightOriginal > 0 && this.targetWidth > 0 && this.targetHeight > 0) {
			if (this.useWebWorker) {
				this.useWebWorker = (this.widthOriginal != this.targetWidth || this.heightOriginal != this.targetHeight);
				if (this.useWebWorker) {
					this.configureWorker();
				}
			}
			if (!this.useWebWorker) {
				this.configurePasses();
			}
		}
		else {
			throw (new Error("Invalid settings specified for the resizer."));
		}
	}
	configureWorker() {
		try {
			var parentObj = this;
			this.worker = new Worker('./resizeWorker.js');
			this.worker.onmessage = function (event) {
				parentObj.heightBuffer = event.data;
				parentObj.resizeCallback(parentObj.heightBuffer);
			};
			this.worker.postMessage(["setup", this.widthOriginal, this.heightOriginal, this.targetWidth, this.targetHeight, this.colorChannels, this.interpolationPass]);
		}
		catch (error) {
			this.useWebWorker = false;
		}
	}
	configurePasses() {
		if (this.widthOriginal == this.targetWidth) {
			//Bypass the width resizer pass:
			this.resizeWidth = this.bypassResizer;
		}
		else {
			//Setup the width resizer pass:
			this.ratioWeightWidthPass = this.widthOriginal / this.targetWidth;
			if (this.ratioWeightWidthPass < 1 && this.interpolationPass) {
				this.initializeFirstPassBuffers(true);
				this.resizeWidth = (this.colorChannels == 4) ? this.resizeWidthInterpolatedRGBA : this.resizeWidthInterpolatedRGB;
			}
			else {
				this.initializeFirstPassBuffers(false);
				this.resizeWidth = (this.colorChannels == 4) ? this.resizeWidthRGBA : this.resizeWidthRGB;
			}
		}
		if (this.heightOriginal == this.targetHeight) {
			//Bypass the height resizer pass:
			this.resizeHeight = this.bypassResizer;
		}
		else {
			//Setup the height resizer pass:
			this.ratioWeightHeightPass = this.heightOriginal / this.targetHeight;
			if (this.ratioWeightHeightPass < 1 && this.interpolationPass) {
				this.initializeSecondPassBuffers(true);
				this.resizeHeight = this.resizeHeightInterpolated;
			}
			else {
				this.initializeSecondPassBuffers(false);
				this.resizeHeight = (this.colorChannels == 4) ? this.resizeHeightRGBA : this.resizeHeightRGB;
			}
		}
	}
	resizeWidthRGB(buffer) {
		var ratioWeight = this.ratioWeightWidthPass;
		var ratioWeightDivisor = 1 / ratioWeight;
		var weight = 0;
		var amountToNext = 0;
		var actualPosition = 0;
		var currentPosition = 0;
		var line = 0;
		var pixelOffset = 0;
		var outputOffset = 0;
		var nextLineOffsetOriginalWidth = this.originalWidthMultipliedByChannels - 2;
		var nextLineOffsetTargetWidth = this.targetWidthMultipliedByChannels - 2;
		var output = this.outputWidthWorkBench;
		var outputBuffer = this.widthBuffer;
		do {
			for (line = 0; line < this.originalHeightMultipliedByChannels;) {
				output[line++] = 0;
				output[line++] = 0;
				output[line++] = 0;
			}
			weight = ratioWeight;
			do {
				amountToNext = 1 + actualPosition - currentPosition;
				if (weight >= amountToNext) {
					for (line = 0, pixelOffset = actualPosition; line < this.originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetOriginalWidth) {
						output[line++] += buffer[pixelOffset++] * amountToNext;
						output[line++] += buffer[pixelOffset++] * amountToNext;
						output[line++] += buffer[pixelOffset] * amountToNext;
					}
					currentPosition = actualPosition = actualPosition + 3;
					weight -= amountToNext;
				}
				else {
					for (line = 0, pixelOffset = actualPosition; line < this.originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetOriginalWidth) {
						output[line++] += buffer[pixelOffset++] * weight;
						output[line++] += buffer[pixelOffset++] * weight;
						output[line++] += buffer[pixelOffset] * weight;
					}
					currentPosition += weight;
					break;
				}
			} while (weight > 0 && actualPosition < this.originalWidthMultipliedByChannels);
			for (line = 0, pixelOffset = outputOffset; line < this.originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetTargetWidth) {
				outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor;
				outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor;
				outputBuffer[pixelOffset] = output[line++] * ratioWeightDivisor;
			}
			outputOffset += 3;
		} while (outputOffset < this.targetWidthMultipliedByChannels);
		return outputBuffer;
	}
	resizeWidthInterpolatedRGB(buffer) {
		var ratioWeight = this.ratioWeightWidthPass;
		var weight = 0;
		var finalOffset = 0;
		var pixelOffset = 0;
		var firstWeight = 0;
		var secondWeight = 0;
		var outputBuffer = this.widthBuffer;
		//Handle for only one interpolation input being valid for start calculation:
		for (var targetPosition = 0; weight < 0.25; targetPosition += 3, weight += ratioWeight) {
			for (finalOffset = targetPosition, pixelOffset = 0; finalOffset < this.widthPassResultSize; pixelOffset += this.originalWidthMultipliedByChannels, finalOffset += this.targetWidthMultipliedByChannels) {
				outputBuffer[finalOffset] = buffer[pixelOffset];
				outputBuffer[finalOffset + 1] = buffer[pixelOffset + 1];
				outputBuffer[finalOffset + 2] = buffer[pixelOffset + 2];
			}
		}
		weight -= 0.25;
		for (var interpolationWidthSourceReadStop = this.widthOriginal - 1; weight < interpolationWidthSourceReadStop; targetPosition += 3, weight += ratioWeight) {
			//Calculate weightings:
			secondWeight = weight % 1;
			firstWeight = 1 - secondWeight;
			//Interpolate:
			for (finalOffset = targetPosition, pixelOffset = Math.floor(weight) * 3; finalOffset < this.widthPassResultSize; pixelOffset += this.originalWidthMultipliedByChannels, finalOffset += this.targetWidthMultipliedByChannels) {
				outputBuffer[finalOffset] = (buffer[pixelOffset] * firstWeight) + (buffer[pixelOffset + 3] * secondWeight);
				outputBuffer[finalOffset + 1] = (buffer[pixelOffset + 1] * firstWeight) + (buffer[pixelOffset + 4] * secondWeight);
				outputBuffer[finalOffset + 2] = (buffer[pixelOffset + 2] * firstWeight) + (buffer[pixelOffset + 5] * secondWeight);
			}
		}
		//Handle for only one interpolation input being valid for end calculation:
		for (interpolationWidthSourceReadStop = this.originalWidthMultipliedByChannels - 3; targetPosition < this.targetWidthMultipliedByChannels; targetPosition += 3) {
			for (finalOffset = targetPosition, pixelOffset = interpolationWidthSourceReadStop; finalOffset < this.widthPassResultSize; pixelOffset += this.originalWidthMultipliedByChannels, finalOffset += this.targetWidthMultipliedByChannels) {
				outputBuffer[finalOffset] = buffer[pixelOffset];
				outputBuffer[finalOffset + 1] = buffer[pixelOffset + 1];
				outputBuffer[finalOffset + 2] = buffer[pixelOffset + 2];
			}
		}
		return outputBuffer;
	}
	resizeWidthRGBA(buffer) {
		var ratioWeight = this.ratioWeightWidthPass;
		var ratioWeightDivisor = 1 / ratioWeight;
		var weight = 0;
		var amountToNext = 0;
		var actualPosition = 0;
		var currentPosition = 0;
		var line = 0;
		var pixelOffset = 0;
		var outputOffset = 0;
		var nextLineOffsetOriginalWidth = this.originalWidthMultipliedByChannels - 3;
		var nextLineOffsetTargetWidth = this.targetWidthMultipliedByChannels - 3;
		var output = this.outputWidthWorkBench;
		var outputBuffer = this.widthBuffer;
		do {
			for (line = 0; line < this.originalHeightMultipliedByChannels;) {
				output[line++] = 0;
				output[line++] = 0;
				output[line++] = 0;
				output[line++] = 0;
			}
			weight = ratioWeight;
			do {
				amountToNext = 1 + actualPosition - currentPosition;
				if (weight >= amountToNext) {
					for (line = 0, pixelOffset = actualPosition; line < this.originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetOriginalWidth) {
						output[line++] += buffer[pixelOffset++] * amountToNext;
						output[line++] += buffer[pixelOffset++] * amountToNext;
						output[line++] += buffer[pixelOffset++] * amountToNext;
						output[line++] += buffer[pixelOffset] * amountToNext;
					}
					currentPosition = actualPosition = actualPosition + 4;
					weight -= amountToNext;
				}
				else {
					for (line = 0, pixelOffset = actualPosition; line < this.originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetOriginalWidth) {
						output[line++] += buffer[pixelOffset++] * weight;
						output[line++] += buffer[pixelOffset++] * weight;
						output[line++] += buffer[pixelOffset++] * weight;
						output[line++] += buffer[pixelOffset] * weight;
					}
					currentPosition += weight;
					break;
				}
			} while (weight > 0 && actualPosition < this.originalWidthMultipliedByChannels);
			for (line = 0, pixelOffset = outputOffset; line < this.originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetTargetWidth) {
				outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor;
				outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor;
				outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor;
				outputBuffer[pixelOffset] = output[line++] * ratioWeightDivisor;
			}
			outputOffset += 4;
		} while (outputOffset < this.targetWidthMultipliedByChannels);
		return outputBuffer;
	}
	resizeWidthInterpolatedRGBA(buffer) {
		var ratioWeight = this.ratioWeightWidthPass;
		var weight = 0;
		var finalOffset = 0;
		var pixelOffset = 0;
		var firstWeight = 0;
		var secondWeight = 0;
		var outputBuffer = this.widthBuffer;
		//Handle for only one interpolation input being valid for start calculation:
		for (var targetPosition = 0; weight < 0.25; targetPosition += 4, weight += ratioWeight) {
			for (finalOffset = targetPosition, pixelOffset = 0; finalOffset < this.widthPassResultSize; pixelOffset += this.originalWidthMultipliedByChannels, finalOffset += this.targetWidthMultipliedByChannels) {
				outputBuffer[finalOffset] = buffer[pixelOffset];
				outputBuffer[finalOffset + 1] = buffer[pixelOffset + 1];
				outputBuffer[finalOffset + 2] = buffer[pixelOffset + 2];
				outputBuffer[finalOffset + 3] = buffer[pixelOffset + 3];
			}
		}
		weight -= 0.25;
		for (var interpolationWidthSourceReadStop = this.widthOriginal - 1; weight < interpolationWidthSourceReadStop; targetPosition += 4, weight += ratioWeight) {
			//Calculate weightings:
			secondWeight = weight % 1;
			firstWeight = 1 - secondWeight;
			//Interpolate:
			for (finalOffset = targetPosition, pixelOffset = Math.floor(weight) * 4; finalOffset < this.widthPassResultSize; pixelOffset += this.originalWidthMultipliedByChannels, finalOffset += this.targetWidthMultipliedByChannels) {
				outputBuffer[finalOffset] = (buffer[pixelOffset] * firstWeight) + (buffer[pixelOffset + 4] * secondWeight);
				outputBuffer[finalOffset + 1] = (buffer[pixelOffset + 1] * firstWeight) + (buffer[pixelOffset + 5] * secondWeight);
				outputBuffer[finalOffset + 2] = (buffer[pixelOffset + 2] * firstWeight) + (buffer[pixelOffset + 6] * secondWeight);
				outputBuffer[finalOffset + 3] = (buffer[pixelOffset + 3] * firstWeight) + (buffer[pixelOffset + 7] * secondWeight);
			}
		}
		//Handle for only one interpolation input being valid for end calculation:
		for (interpolationWidthSourceReadStop = this.originalWidthMultipliedByChannels - 4; targetPosition < this.targetWidthMultipliedByChannels; targetPosition += 4) {
			for (finalOffset = targetPosition, pixelOffset = interpolationWidthSourceReadStop; finalOffset < this.widthPassResultSize; pixelOffset += this.originalWidthMultipliedByChannels, finalOffset += this.targetWidthMultipliedByChannels) {
				outputBuffer[finalOffset] = buffer[pixelOffset];
				outputBuffer[finalOffset + 1] = buffer[pixelOffset + 1];
				outputBuffer[finalOffset + 2] = buffer[pixelOffset + 2];
				outputBuffer[finalOffset + 3] = buffer[pixelOffset + 3];
			}
		}
		return outputBuffer;
	}
	resizeHeightRGB(buffer) {
		var ratioWeight = this.ratioWeightHeightPass;
		var ratioWeightDivisor = 1 / ratioWeight;
		var weight = 0;
		var amountToNext = 0;
		var actualPosition = 0;
		var currentPosition = 0;
		var pixelOffset = 0;
		var outputOffset = 0;
		var output = this.outputHeightWorkBench;
		var outputBuffer = this.heightBuffer;
		do {
			for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels;) {
				output[pixelOffset++] = 0;
				output[pixelOffset++] = 0;
				output[pixelOffset++] = 0;
			}
			weight = ratioWeight;
			do {
				amountToNext = 1 + actualPosition - currentPosition;
				if (weight >= amountToNext) {
					for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels;) {
						output[pixelOffset++] += buffer[actualPosition++] * amountToNext;
						output[pixelOffset++] += buffer[actualPosition++] * amountToNext;
						output[pixelOffset++] += buffer[actualPosition++] * amountToNext;
					}
					currentPosition = actualPosition;
					weight -= amountToNext;
				}
				else {
					for (pixelOffset = 0, amountToNext = actualPosition; pixelOffset < this.targetWidthMultipliedByChannels;) {
						output[pixelOffset++] += buffer[amountToNext++] * weight;
						output[pixelOffset++] += buffer[amountToNext++] * weight;
						output[pixelOffset++] += buffer[amountToNext++] * weight;
					}
					currentPosition += weight;
					break;
				}
			} while (weight > 0 && actualPosition < this.widthPassResultSize);
			for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels;) {
				outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor);
				outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor);
				outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor);
			}
		} while (outputOffset < this.finalResultSize);
		return outputBuffer;
	}
	resizeHeightInterpolated(buffer) {
		var ratioWeight = this.ratioWeightHeightPass;
		var weight = 0;
		var finalOffset = 0;
		var pixelOffset = 0;
		var pixelOffsetAccumulated = 0;
		var pixelOffsetAccumulated2 = 0;
		var firstWeight = 0;
		var secondWeight = 0;
		var outputBuffer = this.heightBuffer;
		//Handle for only one interpolation input being valid for start calculation:
		for (; weight < 0.25; weight += ratioWeight) {
			for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels;) {
				outputBuffer[finalOffset++] = buffer[pixelOffset++];
			}
		}
		weight -= 0.25;
		for (var interpolationHeightSourceReadStop = this.heightOriginal - 1; weight < interpolationHeightSourceReadStop; weight += ratioWeight) {
			//Calculate weightings:
			secondWeight = weight % 1;
			firstWeight = 1 - secondWeight;
			//Interpolate:
			pixelOffsetAccumulated = Math.floor(weight) * this.targetWidthMultipliedByChannels;
			pixelOffsetAccumulated2 = pixelOffsetAccumulated + this.targetWidthMultipliedByChannels;
			for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels; ++pixelOffset) {
				outputBuffer[finalOffset++] = (buffer[pixelOffsetAccumulated + pixelOffset] * firstWeight) + (buffer[pixelOffsetAccumulated2 + pixelOffset] * secondWeight);
			}
		}
		//Handle for only one interpolation input being valid for end calculation:
		while (finalOffset < this.finalResultSize) {
			for (pixelOffset = 0, pixelOffsetAccumulated = interpolationHeightSourceReadStop * this.targetWidthMultipliedByChannels; pixelOffset < this.targetWidthMultipliedByChannels; ++pixelOffset) {
				outputBuffer[finalOffset++] = buffer[pixelOffsetAccumulated++];
			}
		}
		return outputBuffer;
	}
	resizeHeightRGBA(buffer) {
		var ratioWeight = this.ratioWeightHeightPass;
		var ratioWeightDivisor = 1 / ratioWeight;
		var weight = 0;
		var amountToNext = 0;
		var actualPosition = 0;
		var currentPosition = 0;
		var pixelOffset = 0;
		var outputOffset = 0;
		var output = this.outputHeightWorkBench;
		var outputBuffer = this.heightBuffer;
		do {
			for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels;) {
				output[pixelOffset++] = 0;
				output[pixelOffset++] = 0;
				output[pixelOffset++] = 0;
				output[pixelOffset++] = 0;
			}
			weight = ratioWeight;
			do {
				amountToNext = 1 + actualPosition - currentPosition;
				if (weight >= amountToNext) {
					for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels;) {
						output[pixelOffset++] += buffer[actualPosition++] * amountToNext;
						output[pixelOffset++] += buffer[actualPosition++] * amountToNext;
						output[pixelOffset++] += buffer[actualPosition++] * amountToNext;
						output[pixelOffset++] += buffer[actualPosition++] * amountToNext;
					}
					currentPosition = actualPosition;
					weight -= amountToNext;
				}
				else {
					for (pixelOffset = 0, amountToNext = actualPosition; pixelOffset < this.targetWidthMultipliedByChannels;) {
						output[pixelOffset++] += buffer[amountToNext++] * weight;
						output[pixelOffset++] += buffer[amountToNext++] * weight;
						output[pixelOffset++] += buffer[amountToNext++] * weight;
						output[pixelOffset++] += buffer[amountToNext++] * weight;
					}
					currentPosition += weight;
					break;
				}
			} while (weight > 0 && actualPosition < this.widthPassResultSize);
			for (pixelOffset = 0; pixelOffset < this.targetWidthMultipliedByChannels;) {
				outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor);
				outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor);
				outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor);
				outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor);
			}
		} while (outputOffset < this.finalResultSize);
		return outputBuffer;
	}
	resize(buffer) {
		if (this.useWebWorker) {
			this.worker.postMessage(["resize", buffer]);
		}
		else {
			this.resizeCallback(this.resizeHeight(this.resizeWidth(buffer)));
		}
	}
	bypassResizer(buffer) {
		//Just return the buffer passsed:
		return buffer;
	}
	initializeFirstPassBuffers(BILINEARAlgo) {
		//Initialize the internal width pass buffers:
		this.widthBuffer = this.generateFloatBuffer(this.widthPassResultSize);
		if (!BILINEARAlgo) {
			this.outputWidthWorkBench = this.generateFloatBuffer(this.originalHeightMultipliedByChannels);
		}
	}
	initializeSecondPassBuffers(BILINEARAlgo) {
		//Initialize the internal height pass buffers:
		this.heightBuffer = this.generateUint8Buffer(this.finalResultSize);
		if (!BILINEARAlgo) {
			this.outputHeightWorkBench = this.generateFloatBuffer(this.targetWidthMultipliedByChannels);
		}
	}
	generateFloatBuffer(bufferLength) {
		//Generate a float32 typed array buffer:
		try {
			return new Float32Array(bufferLength);
		}
		catch (error) {
			return [];
		}
	}
	generateUint8Buffer(bufferLength) {
		//Generate a uint8 typed array buffer:
		try {
			return new Uint8Array(bufferLength);
		}
		catch (error) {
			return [];
		}
	}
}

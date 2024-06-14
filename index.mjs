export { ICU4XDataProvider, ICU4XGraphemeClusterSegmenter } from "./icu4x/lib/index.mjs";
import { ICU4XDataProvider, ICU4XGraphemeClusterSegmenter } from "./icu4x/lib/index.mjs";

// https://tc39.es/ecma402/#sec-getoption
function GetStringOption(options, property, values, defaultValue) {
	let value = options[property];
	if (value === undefined) {
		return defaultValue;
	}
	value = String(value);
	if (values.indexOf(value) === -1) {
		throw new RangeError(`Invalid string option: ${property}=${value}`);
	}
	return value;
}

export class SegmenterImplICU4X {
	constructor(_locales, options) {
		const granularity = GetStringOption(
			options,
			"granularity",
			["grapheme", "word", "sentence"],
			"grapheme"
		);
		if (granularity === "grapheme") {
			this.inner = ICU4XGraphemeClusterSegmenter.create(ICU4XDataProvider.create_compiled());
		} else {
			throw new RangeError(`Granularity not yet supported: ${granularity}`);
		}
	}

	segment(string) {
		string = String(string);
		return new SegmentsImplICU4X(this, string);
	}
}

export class SegmentsImplICU4X {
	constructor(segmenter, string) {
		this.segmenter = segmenter;
		this.string = string;
	}

	[Symbol.iterator]() {
		return new IntlSegmenterIteratorImplICU4X(this.segmenter, this.string);
	}
}

// https://tc39.es/ecma262/#sec-createiterresultobject
function CreateIterResultObject(value, done) {
	return { value, done };
}

// https://tc39.es/ecma402/#sec-createsegmentdataobject
function CreateSegmentDataObject(segmenter, string, startIndex, endIndex) {
	let segment = string.substr(startIndex, endIndex);
	// TODO: isWordLike
	return {
		segment,
		index: startIndex,
		input: string,
	};
}

export class IntlSegmenterIteratorImplICU4X {
	constructor(segmenter, string) {
		this.segmenter = segmenter;
		this.breakIterator = segmenter.inner.segment_utf16(string);
		this.startIndex = this.breakIterator.next();
		this.string = string;
	}

	next() {
		if (this.startIndex >= this.string.length) {
			return CreateIterResultObject(undefined, true);
		}
		let endIndex = this.breakIterator.next();
		let segmentData = CreateSegmentDataObject(this.segmenter, this.string, this.startIndex, endIndex);
		this.startIndex = endIndex;
		return CreateIterResultObject(segmentData, false);
	}
}

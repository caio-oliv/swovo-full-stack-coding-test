export type ProgressHandler = (bytes: number) => void;

interface Ref<T> {
	value: T;
}

function ref<T>(value: T): Ref<T> {
	return { value };
}

function createBytesReadStream(
	bytesRef: Ref<number>,
	handler: ProgressHandler | null = null
): TransformStream<ArrayBuffer, ArrayBuffer> {
	return new TransformStream<ArrayBuffer, ArrayBuffer>({
		transform(chunk: ArrayBuffer, controller): void {
			bytesRef.value += chunk.byteLength;
			handler?.(bytesRef.value);
			controller.enqueue(chunk);
		},
	});
}

export class BytesReadStream {
	public constructor(handler: ProgressHandler | null = null) {
		this.#bytesRef = ref<number>(0);
		this.#handler = handler;
		this.#stream = createBytesReadStream(this.#bytesRef, this.#handler);
	}

	public stream(): TransformStream<ArrayBuffer, ArrayBuffer> {
		return this.#stream;
	}

	public bytesRead(): number {
		return this.#bytesRef.value;
	}

	readonly #bytesRef: Ref<number>;
	readonly #handler: ProgressHandler | null;
	readonly #stream: TransformStream<ArrayBuffer, ArrayBuffer>;
}

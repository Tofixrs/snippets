export default class Option<T> {
	private constructor(private value: T | null) {}

	static some<T>(value: T) {
		if (!value) {
			throw new Error('Provided value must not be empty');
		}
		return new Option(value);
	}

	static none<T>() {
		return new Option<T>(null);
	}

	static fromValue<T>(value: T) {
		return value ? Option.some(value) : Option.none<T>();
	}

	getOrElse(defaultValue: T) {
		return this.value === null ? defaultValue : this.value;
	}
	map<U>(callback: (item: T) => U): Option<U> {
		if (this.value === null) {
			return Option.none<U>();
		}
		return Option.some<U>(callback(this.value));
	}
}

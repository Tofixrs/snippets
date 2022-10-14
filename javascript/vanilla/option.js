"use strict";
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>Option
});
class Option {
    constructor(value){
        this.value = value;
    }
    static some(value) {
        if (!value) {
            throw new Error("Provided value must not be empty");
        }
        return new Option(value);
    }
    static none() {
        return new Option(null);
    }
    static fromValue(value) {
        return value ? Option.some(value) : Option.none();
    }
    getOrElse(defaultValue) {
        return this.value === null ? defaultValue : this.value;
    }
    map(callback) {
        if (this.value === null) {
            return Option.none();
        }
        return Option.some(callback(this.value));
    }
}

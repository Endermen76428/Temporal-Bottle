export const apiNumbers = new class apiNumbers {
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
    isOutRange(value, min, max) { return value < min || value > max; }
    random(range) {
        return Math.random() * range;
    }
    randomBetween(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    distance(num1, num2) { return Math.sqrt((num1 - num2) ** 2 + (num1 - num2) ** 2); }
};

export const apiNumbers = new class ApiNumbers {
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
    isOutRange(value, min, max) { return value < min || value > max; }
    wrapRange(value, min, max) {
        const range = max - min + 1;
        return ((value - min) % range + range) % range + min;
    }
    random(range) {
        return Math.random() * range;
    }
    randomBetween(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    randomSeed(seed) {
        let num = stringToSeed(seed);
        let t = num += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
};
function stringToSeed(text) {
    let seed = 0;
    for (let i = 0; i < text.length; i++)
        seed = Math.imul(seed, 31) + text.charCodeAt(i) | 0;
    return seed;
}

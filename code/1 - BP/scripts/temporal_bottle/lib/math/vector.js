export const apiVec3 = new class apiVec3 {
    constructor() {
        this.directions4 = ["North", "East", "South", "West"];
        this.offsetDirection = {
            "East": { x: 1, y: 0, z: 0 },
            "West": { x: -1, y: 0, z: 0 },
            "Down": { x: 0, y: -1, z: 0 },
            "Up": { x: 0, y: 1, z: 0 },
            "North": { x: 0, y: 0, z: -1 },
            "South": { x: 0, y: 0, z: 1 }
        };
    }
    create(x = 0, y = 0, z = 0) { return { x: x, y: y, z: z }; }
    divide(vector, divider) {
        return {
            x: vector["x"] / divider,
            y: vector["y"] / divider,
            z: vector["z"] / divider
        };
    }
    multiply(vector, amount) {
        return {
            x: vector["x"] * amount,
            y: vector["y"] * amount,
            z: vector["z"] * amount
        };
    }
    offset(vector, offset) {
        return {
            x: vector["x"] + offset["x"],
            y: vector["y"] + offset["y"],
            z: vector["z"] + offset["z"]
        };
    }
    floor(vector) {
        return {
            x: Math.floor(vector["x"]),
            y: Math.floor(vector["y"]),
            z: Math.floor(vector["z"])
        };
    }
    reduce(vector, value, on) {
        const newVec = { x: vector["x"], y: vector["y"], z: vector["z"] };
        newVec[on] += value;
        return newVec;
    }
    compare(vector1, vector2, floor = true) {
        const vec1 = floor ? this.floor(vector1) : vector1, vec2 = floor ? this.floor(vector2) : vector2;
        if (vec1.x != vec2.x || vec1.y != vec2.y || vec1.z != vec2.z)
            return false;
        return true;
    }
    distance(vec1, vec2, negative = false) {
        if (negative)
            return (vec1.x - vec2.x) + (vec1.y - vec2.y) + (vec1.z - vec2.z);
        return Math.sqrt((vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2 + (vec1.z - vec2.z) ** 2);
    }
    distanceObj(vec1, vec2) { return { x: (vec2.x - vec1.x), y: (vec2.y - vec1.y), z: (vec2.z - vec1.z) }; }
    isValid(obj) {
        if (obj == undefined)
            return false;
        const keys = Object.keys(obj);
        return (keys.length === 3 && order.every(k => keys.includes(k))) && (order.every(k => typeof obj[k] === 'number'));
    }
    organize(vector) {
        const { x, y, z } = vector;
        return { x: x, y: y, z: z };
    }
    decompose(vector) { return Object.values(vector); }
    centerBlock(vector) { return this.offset(this.floor(vector), this.create(0.5, 0.5, 0.5)); }
    toString(vector) { return `${vector.x},${vector.y},${vector.z}`; }
    tobyte(x, y, z) { return (x << 20) ^ (y << 10) ^ z; }
};
const order = ['x', 'y', 'z'];

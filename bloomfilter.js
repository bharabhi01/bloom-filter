class BloomFilter {
    constructor(size = 1000, hashFunctions = 3) {
        this.murmur = require("murmurhash-js");

        // Create a bit array which will be used to store the presence of elements
        this.size = size;
        this.bitArray = new Array(size).fill(0); // Set the array to 0
        this.hashFunctionsCount = hashFunctions;
    }

    add(item) {
        const positions = this.getHashPositions(item);

        // Set the bit at the positions to 1
        positions.forEach(position => {
            this.bitArray[position] = 1;
        })
    }

    checkElement(item) {
        const positions = this.getHashPositions(item);

        /* 
            If the bit at the positions is 1, then the element may be present. 
            If the bit at the positions is 0, then the element is not present.
        */
        return positions.every(position => this.bitArray[position] === 1);
    }

    getHashPositions(item) {
        const positions = [];
        const stringItem = String(item);

        // Generate multiple hash values using different seeds
        const hash1 = this.murmur.murmur3(stringItem, 0);
        const hash2 = this.murmur.murmur3(stringItem, hash1);

        // Calculate multiple positions using different hash values
        for (let i = 0; i < this.hashFunctionsCount; i++) {
            const position = (hash1 + i * hash2) % this.size;
            positions.push(position);
        }

        return positions;
    }

    /*
        Bloom Filters can also give us false positives, but they will never give us false negatives.
        This means that if a Bloom Filter tells us that an element is present, it might be a false positive.
        But if a Bloom Filter tells us that an element is not present, then it is definitely not present.
    */

    getFalsePositiveRate(itemCount) {
        return Math.pow(1 - Math.exp(-(this.hashFunctionsCount * itemCount) / this.size), this.hashFunctionsCount);
    }

    /* 
        The performance of Bloom Filters is depenedant on the size of the bit array and the number of hash functions.
    */

    static getOptimalHashCount(size, expectedElements) {
        return Math.round((size / expectedElements) * Math.log(2));
    }

    static getOptimalSize(expectedElements, falsePositiveRate) {
        return Math.ceil(-(expectedElements * Math.log(falsePositiveRate)) / (Math.log(2) * Math.log(2)));
    }

    clear() {
        this.bitArray.fill(0);
    }
}

module.exports = BloomFilter;
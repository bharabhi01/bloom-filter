const BloomFilter = require("./bloomfilter");

function testBasicFunctionality() {
    console.log("=== Basic Functionality Test ===");

    const filter = new BloomFilter(100, 3);

    // Add some items
    filter.add("apple");
    filter.add("banana");
    filter.add("orange");

    // Test positive cases (should all return true)
    console.log("Contains 'apple':", filter.checkElement("apple"));
    console.log("Contains 'banana':", filter.checkElement("banana"));
    console.log("Contains 'orange':", filter.checkElement("orange"));

    // Test negative cases (should likely return false)
    console.log("Contains 'grape':", filter.checkElement("grape"));
    console.log("Contains 'mango':", filter.checkElement("mango"));

    // Clear the filter and test again
    filter.clear();
    console.log("After clearing, contains 'apple':", filter.checkElement("apple"));
}

function testFalsePositiveRate() {
    console.log("\n=== False Positive Rate Test ===");

    // Create a filter with specific parameters
    const expectedItems = 1000;
    const falsePositiveRate = 0.05; // 5% false positive rate

    const size = BloomFilter.getOptimalSize(expectedItems, falsePositiveRate);
    const hashCount = BloomFilter.getOptimalHashCount(size, expectedItems);

    console.log(`Optimal size: ${size} bits`);
    console.log(`Optimal hash count: ${hashCount}`);

    const filter = new BloomFilter(size, hashCount);

    // Add expectedItems unique items
    const addedItems = new Set();
    for (let i = 0; i < expectedItems; i++) {
        const item = `item-${i}`;
        filter.add(item);
        addedItems.add(item);
    }

    // Test with items not in the filter
    const testCount = 10000;
    let falsePositives = 0;

    for (let i = 0; i < testCount; i++) {
        const testItem = `test-item-${i}`;
        // Skip if we accidentally generated an item that was actually added
        if (addedItems.has(testItem)) continue;

        // Count false positives
        if (filter.checkElement(testItem)) {
            falsePositives++;
        }
    }

    const actualFalsePositiveRate = falsePositives / testCount;
    const theoreticalRate = filter.getFalsePositiveRate(expectedItems);

    console.log(`Theoretical false positive rate: ${theoreticalRate.toFixed(4)} (${(theoreticalRate * 100).toFixed(2)}%)`);
    console.log(`Actual false positive rate: ${actualFalsePositiveRate.toFixed(4)} (${(actualFalsePositiveRate * 100).toFixed(2)}%)`);
}

function testPerformance() {
    console.log("\n=== Performance Test ===");

    const itemCount = 100000;
    const lookupCount = 10000;

    // Create a filter with 1% false positive rate
    const size = BloomFilter.getOptimalSize(itemCount, 0.01);
    const hashCount = BloomFilter.getOptimalHashCount(size, itemCount);
    const filter = new BloomFilter(size, hashCount);

    console.log(`Testing with ${itemCount} items and ${lookupCount} lookups`);
    console.log(`Filter size: ${size} bits, hash functions: ${hashCount}`);

    // Measure insertion time
    console.time("Insertion time");
    for (let i = 0; i < itemCount; i++) {
        filter.add(`performance-item-${i}`);
    }
    console.timeEnd("Insertion time");

    // Measure lookup time for existing items
    console.time("Lookup time (existing items)");
    for (let i = 0; i < lookupCount; i++) {
        filter.checkElement(`performance-item-${i}`);
    }
    console.timeEnd("Lookup time (existing items)");

    // Measure lookup time for non-existing items
    console.time("Lookup time (non-existing items)");
    for (let i = 0; i < lookupCount; i++) {
        filter.checkElement(`non-existing-item-${i}`);
    }
    console.timeEnd("Lookup time (non-existing items)");

    // Memory usage
    const memorySizeMB = size / 8 / 1024 / 1024; // Convert bits to MB
    console.log(`Approximate memory usage: ${memorySizeMB.toFixed(2)} MB`);
}

function compareWithSet() {
    console.log("\n=== Comparison with Set ===");

    const itemCount = 100000;
    const lookupCount = 10000;

    // Create a bloom filter
    const size = BloomFilter.getOptimalSize(itemCount, 0.01);
    const hashCount = BloomFilter.getOptimalHashCount(size, itemCount);
    const filter = new BloomFilter(size, hashCount);

    // Create a regular Set
    const regularSet = new Set();

    // Add items to both
    console.time("Bloom filter insertion");
    for (let i = 0; i < itemCount; i++) {
        filter.add(`item-${i}`);
    }
    console.timeEnd("Bloom filter insertion");

    console.time("Set insertion");
    for (let i = 0; i < itemCount; i++) {
        regularSet.add(`item-${i}`);
    }
    console.timeEnd("Set insertion");

    // Test lookups
    console.time("Bloom filter lookup");
    for (let i = 0; i < lookupCount; i++) {
        filter.checkElement(`item-${i}`);
    }
    console.timeEnd("Bloom filter lookup");

    console.time("Set lookup");
    for (let i = 0; i < lookupCount; i++) {
        regularSet.has(`item-${i}`);
    }
    console.timeEnd("Set lookup");

    // Test non-existing lookups
    console.time("Bloom filter negative lookup");
    for (let i = 0; i < lookupCount; i++) {
        filter.checkElement(`non-existing-${i}`);
    }
    console.timeEnd("Bloom filter negative lookup");

    console.time("Set negative lookup");
    for (let i = 0; i < lookupCount; i++) {
        regularSet.has(`non-existing-${i}`);
    }
    console.timeEnd("Set negative lookup");
}

function testEdgeCases() {
    console.log("\n=== Edge Cases Test ===");

    // Test with very small filter
    const smallFilter = new BloomFilter(10, 3);
    for (let i = 0; i < 20; i++) {
        smallFilter.add(`small-${i}`);
    }

    let falsePositives = 0;
    for (let i = 100; i < 200; i++) {
        if (smallFilter.checkElement(`small-${i}`)) {
            falsePositives++;
        }
    }
    console.log(`Small filter false positives: ${falsePositives}/100 (${falsePositives}%)`);

    // Test with different data types
    const typeFilter = new BloomFilter(100, 3);
    typeFilter.add(123);
    typeFilter.add(true);
    typeFilter.add({ key: "value" });
    typeFilter.add([1, 2, 3]);

    console.log("Contains number 123:", typeFilter.checkElement(123));
    console.log("Contains boolean true:", typeFilter.checkElement(true));
    console.log("Contains object {key: 'value'}:", typeFilter.checkElement({ key: "value" }));
    console.log("Contains array [1,2,3]:", typeFilter.checkElement([1, 2, 3]));
}

function runAllTests() {
    testBasicFunctionality();
    testFalsePositiveRate();
    testPerformance();
    compareWithSet();
    testEdgeCases();
}

runAllTests();
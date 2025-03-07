# Bloom Filter Implementation in JavaScript

This repository contains a JavaScript implementation of a Bloom filter data structure, along with comprehensive test cases to demonstrate its functionality, performance characteristics, and practical applications.

## What is a Bloom Filter?

A Bloom filter is a space-efficient probabilistic data structure designed to test whether an element is a member of a set. It is characterized by:

- **Space Efficiency**: Uses significantly less memory than conventional data structures
- **Constant-time Operations**: Both insertions and lookups are O(1) operations
- **Probabilistic Nature**: Can produce false positives but never false negatives

In simpler terms, a Bloom filter can tell you with certainty when an element is **not** in the set, but it can only tell you with some probability when an element **is** in the set.

## Applications of Bloom Filters

Bloom filters are particularly useful in scenarios where:

- Memory usage is a concern
- Absolute certainty is not required
- The cost of a false positive is acceptable

Common applications include:

- **Web Browsers**: Checking if a URL is potentially malicious
- **Databases**: Avoiding disk lookups for non-existent keys
- **Network Routers**: Packet filtering and routing
- **Spell Checkers**: Quick verification of potentially valid words
- **Cache Systems**: Determining if an item might be in cache before performing expensive lookups
- **Cryptocurrency**: Efficient verification in Bitcoin's SPV (Simplified Payment Verification)
- **Distributed Systems**: Reducing network traffic by filtering requests

## Implementation Details

This implementation includes:

### Core Components

- **Bit Array**: A fixed-size array where each position is either 0 or 1
- **Hash Functions**: Multiple hash functions to map elements to positions in the bit array
- **MurmurHash**: Utilizes the murmurhash-js library for efficient hashing

### Key Methods

- `add(item)`: Adds an element to the Bloom filter
- `checkElement(item)`: Checks if an element might be in the set
- `clear()`: Resets the Bloom filter
- `getFalsePositiveRate(itemCount)`: Calculates the theoretical false positive rate
- `getOptimalHashCount(size, expectedElements)`: Static method to calculate the optimal number of hash functions
- `getOptimalSize(expectedElements, falsePositiveRate)`: Static method to calculate the optimal size of the bit array

### Internal Workings

1. **Initialization**: Creates a bit array of specified size and determines the number of hash functions
2. **Adding Elements**:
   - Converts the element to a string
   - Generates multiple hash values using MurmurHash with different seeds
   - Sets bits at calculated positions to 1
3. **Checking Elements**:
   - Calculates the same hash positions for the query element
   - Returns true only if all corresponding bits are set to 1
   - If any bit is 0, the element is definitely not in the set

## Test Cases

The repository includes comprehensive test cases that demonstrate:

### Basic Functionality

Tests the fundamental operations (add, check, clear) with simple string elements.

### False Positive Rate

Compares theoretical and actual false positive rates using optimal parameters.

### Performance Testing

Measures insertion and lookup times for large datasets, demonstrating the efficiency of Bloom filters.

### Comparison with JavaScript Set

Benchmarks the Bloom filter against JavaScript's native Set to highlight performance and memory differences.

### Edge Cases

Tests the behavior with:

- Very small filter sizes (high collision rate)
- Different data types (numbers, booleans, objects, arrays)

## Usage

```javascript
const BloomFilter = require("./bloomfilter");

// Create a new Bloom filter
const filter = new BloomFilter(1000, 3);  // size = 1000 bits, 3 hash functions

// Add elements
filter.add("apple");
filter.add("banana");

// Check if elements exist
console.log(filter.checkElement("apple"));  // true
console.log(filter.checkElement("grape"));  // false (most likely)

// Calculate optimal parameters
const expectedElements = 10000;
const desiredFalsePositiveRate = 0.01;  // 1%

const optimalSize = BloomFilter.getOptimalSize(expectedElements, desiredFalsePositiveRate);
const optimalHashCount = BloomFilter.getOptimalHashCount(optimalSize, expectedElements);

console.log(`Optimal size: ${optimalSize} bits`);
console.log(`Optimal hash count: ${optimalHashCount}`);
```

## Running the Tests

To run the test suite:

```bash
node bloomfilter.test.js
```

This will execute all test cases and display performance metrics and comparison results.

## Dependencies

- murmurhash-js: For efficient hash function implementation

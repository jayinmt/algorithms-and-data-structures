// Binary Search Tree
interface BSTNode<T> {
  value: T;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
}

class BinarySearchTree<T> {
  private root: BSTNode<T> | null = null;

  insert(value: T): void {
    const newNode: BSTNode<T> = { value, left: null, right: null };
    if (!this.root) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  private insertNode(node: BSTNode<T>, newNode: BSTNode<T>): void {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(value: T): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: BSTNode<T> | null, value: T): boolean {
    if (!node) {
      return false;
    }
    if (value === node.value) {
      return true;
    }
    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else {
      return this.searchNode(node.right, value);
    }
  }
}

// Dijkstra's Shortest Path Algorithm
interface Graph<T> {
  [key: string]: { [key: string]: number };
}

function dijkstra<T extends string>(graph: Graph<T>, start: T, end: T): number {
  const distances: { [key in T]: number } = {};
  const visited: { [key in T]: boolean } = {};
  const previous: { [key in T]: T | null } = {};

  // Initialize distances and visited objects
  for (const vertex in graph) {
    distances[vertex as T] = Infinity;
    visited[vertex as T] = false;
    previous[vertex as T] = null;
  }
  distances[start] = 0;

  // Find the shortest path
  while (true) {
    let currVertex: T | null = null;
    let currDistance = Infinity;

    // Find the vertex with the minimum distance
    for (const vertex in graph) {
      if (!visited[vertex as T] && distances[vertex as T] < currDistance) {
        currVertex = vertex as T;
        currDistance = distances[vertex as T];
      }
    }

    // If no unvisited vertex found, break the loop
    if (currVertex === null) {
      break;
    }

    // Mark the current vertex as visited
    visited[currVertex] = true;

    // If the current vertex is the end vertex, break the loop
    if (currVertex === end) {
      break;
    }

    // Update distances of the neighboring vertices
    for (const neighbor in graph[currVertex]) {
      const distance = currDistance + graph[currVertex][neighbor];
      if (distance < distances[neighbor as T]) {
        distances[neighbor as T] = distance;
        previous[neighbor as T] = currVertex;
      }
    }
  }

  // Build the path from start to end
  const path: T[] = [];
  let currVertex: T | null = end;
  while (currVertex !== null) {
    path.unshift(currVertex);
    currVertex = previous[currVertex];
  }

  // If no path found, return Infinity; otherwise, return the distance
  return path.length === 1 ? Infinity : distances[end];
}

// LRU Cache
interface CacheEntry<K, V> {
  key: K;
  value: V;
}

class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, CacheEntry<K, V>>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<K, CacheEntry<K, V>>();
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.cache.set(key, entry);
      return entry.value;
    }
    return undefined;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { key, value });
  }
}

// Trie (Prefix Tree)
interface TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = { children: {}, isEndOfWord: false };
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = { children: {}, isEndOfWord: false };
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return true;
  }
}

// Decorator Pattern
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result of ${propertyKey}:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Usage examples
const bst = new BinarySearchTree<number>();
bst.insert(5);
bst.insert(3);
bst.insert(7);
console.log(bst.search(3)); // true
console.log(bst.search(8)); // false

const graph: Graph<string> = {
  A: { B: 5, C: 2 },
  B: { A: 5, C: 1, D: 3 },
  C: { A: 2, B: 1, D: 6 },
  D: { B: 3, C: 6 },
};
console.log(dijkstra(graph, 'A', 'D')); // 6

const cache = new LRUCache<string, number>(2);
cache.put('key1', 1);
cache.put('key2', 2);
console.log(cache.get('key1')); // 1
cache.put('key3', 3);
console.log(cache.get('key2')); // undefined

const trie = new Trie();
trie.insert('apple');
trie.insert('app');
console.log(trie.search('apple')); // true
console.log(trie.search('app')); // true
console.log(trie.startsWith('ap')); // true

const calculator = new Calculator();
console.log(calculator.add(2, 3)); // logs and returns 5

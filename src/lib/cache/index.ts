class Cache {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get the value of a key in the cache, returns
   * undefined if the key does not exist.
   */
  get(key: string) {
    return this.cache.get(key);
  }

  /**
   * Set the value of a key in the cache.
   */
  set(key: string, value: string) {
    this.cache.set(key, value);
  }
}

export default Cache;

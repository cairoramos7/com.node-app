/**
 * @file container.js
 * @description Simple Dependency Injection Container.
 */

class Container {
  constructor() {
    this.dependencies = {};
    this.singletons = {};
  }

  /**
   * Registers a dependency as a factory function.
   * @param {string} name - The name of the dependency.
   * @param {Function} factory - The factory function that creates the dependency.
   */
  register(name, factory) {
    this.dependencies[name] = factory;
  }

  /**
   * Registers a dependency as a singleton.
   * @param {string} name - The name of the dependency.
   * @param {Function} factory - The factory function that creates the singleton instance.
   */
  registerSingleton(name, factory) {
    this.dependencies[name] = () => {
      if (!this.singletons[name]) {
        this.singletons[name] = factory(this);
      }
      return this.singletons[name];
    };
  }

  /**
   * Resolves a dependency.
   * @param {string} name - The name of the dependency to resolve.
   * @returns {*} The resolved dependency.
   * @throws {Error} If the dependency is not registered.
   */
  resolve(name) {
    if (!this.dependencies[name]) {
      throw new Error(`Dependency ${name} not registered.`);
    }
    return this.dependencies[name](this);
  }
}

module.exports = new Container();
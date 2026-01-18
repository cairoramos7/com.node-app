/**
 * @file container.ts
 * @description Simple Dependency Injection Container.
 */

type FactoryFunction<T> = (container: Container) => T;

class Container {
    private dependencies: Record<string, FactoryFunction<any>> = {};
    private singletons: Record<string, any> = {};

    /**
     * Registers a dependency as a factory function.
     * @param {string} name - The name of the dependency.
     * @param {Function} factory - The factory function that creates the dependency.
     */
    register<T>(name: string, factory: FactoryFunction<T>): void {
        this.dependencies[name] = factory;
    }

    /**
     * Registers a dependency as a singleton.
     * @param {string} name - The name of the dependency.
     * @param {Function} factory - The factory function that creates the singleton instance.
     */
    registerSingleton<T>(name: string, factory: FactoryFunction<T>): void {
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
    resolve<T>(name: string): T {
        if (!this.dependencies[name]) {
            throw new Error(`Dependency ${name} not registered.`);
        }
        return this.dependencies[name](this);
    }
}

export default new Container();

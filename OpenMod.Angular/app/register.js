'use strict';

/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for doing so.
 */
function register(appName) {

    var app = angular.module(appName);

    return {
        directive: directive,
        controller: controller,
        service: service,
        provider: provider,
        factory: factory
    };

    function directive(name, constructorFn) {

        constructorFn = _normalizeConstructor(constructorFn);

        if (!constructorFn.prototype.compile) {
            // create an empty compile function if none was defined.
            constructorFn.prototype.compile = function () {};
        }

        var originalCompileFn = _cloneFunction(constructorFn.prototype.compile);

        // Decorate the compile method to automatically return the link method (if it exists)
        // and bind it to the context of the constructor (so `this` works correctly).
        // This gets around the problem of a non-lexical "this" which occurs when the directive class itself
        // returns `this.link` from within the compile function.
        _override(constructorFn.prototype, 'compile', function () {
            return function () {
                originalCompileFn.apply(this, arguments);

                if (constructorFn.prototype.link) {
                    return constructorFn.prototype.link.bind(this);
                }
            };
        });
        var factoryArray = _createFactoryArray(constructorFn);
        app.directive(name, factoryArray);
        return this;
    }

    function controller(name, contructorFn) {
        app.controller(name, contructorFn);
        return this;
    }

    function service(name, contructorFn) {
        app.service(name, contructorFn);
        return this;
    }

    function provider(name, constructorFn) {
        app.provider(name, constructorFn);
        return this;
    }

    function factory(name, constructorFn) {
        constructorFn = _normalizeConstructor(constructorFn);
        var factoryArray = _createFactoryArray(constructorFn);
        app.factory(name, factoryArray);
        return this;
    }

    /**
     * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
     * we need to pull out the array of dependencies and add it as an $inject property of the
     * actual constructor function.
     * @param input
     * @returns {*}
     * @private
     */
    function _normalizeConstructor(input) {
        var constructorFn;

        if (input.constructor === Array) {
            //
            var injected = input.slice(0, input.length - 1);
            constructorFn = input[input.length - 1];
            constructorFn.$inject = injected;
        } else {
            constructorFn = input;
        }

        return constructorFn;
    }

    /**
     * Convert a constructor function into a factory function which returns a new instance of that
     * constructor, with the correct dependencies automatically injected as arguments.
     *
     * In order to inject the dependencies, they must be attached to the constructor function with the
     * `$inject` property annotation.
     *
     * @param constructorFn
     * @returns {Array.<T>}
     * @private
     */
    function _createFactoryArray(constructorFn) {
        // get the array of dependencies that are needed by this component (as contained in the `$inject` array)
        var args = constructorFn.$inject || [];
        var factoryArray = args.slice(); // create a copy of the array
        // The factoryArray uses Angular's array notation whereby each element of the array is the name of a
        // dependency, and the final item is the factory function itself.
        factoryArray.push(function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            //return new constructorFn(...args);
            var instance = new (Function.prototype.bind.apply(constructorFn, [null].concat(args)))();
            for (var key in instance) {
                instance[key] = instance[key];
            }
            return instance;
        });

        return factoryArray;
    }

    /**
     * Clone a function
     * @param original
     * @returns {Function}
     */
    function _cloneFunction(original) {
        return function () {
            return original.apply(this, arguments);
        };
    }

    /**
     * Override an object's method with a new one specified by `callback`.
     * @param object
     * @param methodName
     * @param callback
     */
    function _override(object, methodName, callback) {
        object[methodName] = callback(object[methodName]);
    }
}
//# sourceMappingURL=data:application/json;base64,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QTdCLEVBQTRDOztBQUV4QyxZQUFNLE9BQU8sY0FBYyxPQUFkLElBQXlCLEVBQXpCLENBRjJCO0FBR3hDLFlBQU0sZUFBZSxLQUFLLEtBQUwsRUFBZjs7O0FBSGtDLG9CQU14QyxDQUFhLElBQWIsQ0FBa0IsWUFBYTs4Q0FBVDs7YUFBUzs7O0FBRTNCLGdCQUFJLDhDQUFlLDZCQUFpQixTQUFoQyxDQUZ1QjtBQUczQixpQkFBSSxJQUFJLEdBQUosSUFBVyxRQUFmLEVBQXlCO0FBQ3JCLHlCQUFTLEdBQVQsSUFBZ0IsU0FBUyxHQUFULENBQWhCLENBRHFCO2FBQXpCO0FBR0EsbUJBQU8sUUFBUCxDQU4yQjtTQUFiLENBQWxCLENBTndDOztBQWV4QyxlQUFPLFlBQVAsQ0Fmd0M7S0FBNUM7Ozs7Ozs7QUFuR3VCLGFBMEhkLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0M7QUFDOUIsZUFBTyxZQUFXO0FBQ2QsbUJBQU8sU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixTQUFyQixDQUFQLENBRGM7U0FBWCxDQUR1QjtLQUFsQzs7Ozs7Ozs7QUExSHVCLGFBc0lkLFNBQVQsQ0FBbUIsTUFBbkIsRUFBMkIsVUFBM0IsRUFBdUMsUUFBdkMsRUFBaUQ7QUFDN0MsZUFBTyxVQUFQLElBQXFCLFNBQVMsT0FBTyxVQUFQLENBQVQsQ0FBckIsQ0FENkM7S0FBakQ7Q0F0SUoiLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQSBoZWxwZXIgY2xhc3MgdG8gc2ltcGxpZnkgcmVnaXN0ZXJpbmcgQW5ndWxhciBjb21wb25lbnRzIGFuZCBwcm92aWRlIGEgY29uc2lzdGVudCBzeW50YXggZm9yIGRvaW5nIHNvLlxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXIoYXBwTmFtZSkge1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShhcHBOYW1lKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRpcmVjdGl2ZTogZGlyZWN0aXZlLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXHJcbiAgICAgICAgc2VydmljZTogc2VydmljZSxcclxuICAgICAgICBwcm92aWRlcjogcHJvdmlkZXIsXHJcbiAgICAgICAgZmFjdG9yeTogZmFjdG9yeVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBkaXJlY3RpdmUobmFtZSwgY29uc3RydWN0b3JGbikge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvckZuID0gX25vcm1hbGl6ZUNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yRm4pO1xyXG5cclxuICAgICAgICBpZighY29uc3RydWN0b3JGbi5wcm90b3R5cGUuY29tcGlsZSkge1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgYW4gZW1wdHkgY29tcGlsZSBmdW5jdGlvbiBpZiBub25lIHdhcyBkZWZpbmVkLlxyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5jb21waWxlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG9yaWdpbmFsQ29tcGlsZUZuID0gX2Nsb25lRnVuY3Rpb24oY29uc3RydWN0b3JGbi5wcm90b3R5cGUuY29tcGlsZSk7XHJcblxyXG4gICAgICAgIC8vIERlY29yYXRlIHRoZSBjb21waWxlIG1ldGhvZCB0byBhdXRvbWF0aWNhbGx5IHJldHVybiB0aGUgbGluayBtZXRob2QgKGlmIGl0IGV4aXN0cylcclxuICAgICAgICAvLyBhbmQgYmluZCBpdCB0byB0aGUgY29udGV4dCBvZiB0aGUgY29uc3RydWN0b3IgKHNvIGB0aGlzYCB3b3JrcyBjb3JyZWN0bHkpLlxyXG4gICAgICAgIC8vIFRoaXMgZ2V0cyBhcm91bmQgdGhlIHByb2JsZW0gb2YgYSBub24tbGV4aWNhbCBcInRoaXNcIiB3aGljaCBvY2N1cnMgd2hlbiB0aGUgZGlyZWN0aXZlIGNsYXNzIGl0c2VsZlxyXG4gICAgICAgIC8vIHJldHVybnMgYHRoaXMubGlua2AgZnJvbSB3aXRoaW4gdGhlIGNvbXBpbGUgZnVuY3Rpb24uXHJcbiAgICAgICAgX292ZXJyaWRlKGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLCAnY29tcGlsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbENvbXBpbGVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmxpbmspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3JGbi5wcm90b3R5cGUubGluay5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGZhY3RvcnlBcnJheSA9IF9jcmVhdGVGYWN0b3J5QXJyYXkoY29uc3RydWN0b3JGbik7XHJcbiAgICAgICAgYXBwLmRpcmVjdGl2ZShuYW1lLCBmYWN0b3J5QXJyYXkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRyb2xsZXIobmFtZSwgY29udHJ1Y3RvckZuKSB7XHJcbiAgICAgICAgYXBwLmNvbnRyb2xsZXIobmFtZSwgY29udHJ1Y3RvckZuKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXJ2aWNlKG5hbWUsIGNvbnRydWN0b3JGbikge1xyXG4gICAgICAgIGFwcC5zZXJ2aWNlKG5hbWUsIGNvbnRydWN0b3JGbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJvdmlkZXIobmFtZSwgY29uc3RydWN0b3JGbikge1xyXG4gICAgICAgIGFwcC5wcm92aWRlcihuYW1lLCBjb25zdHJ1Y3RvckZuKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmYWN0b3J5KG5hbWUsIGNvbnN0cnVjdG9yRm4pIHtcclxuICAgICAgICBjb25zdHJ1Y3RvckZuID0gX25vcm1hbGl6ZUNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yRm4pO1xyXG4gICAgICAgIGNvbnN0IGZhY3RvcnlBcnJheSA9IF9jcmVhdGVGYWN0b3J5QXJyYXkoY29uc3RydWN0b3JGbik7XHJcbiAgICAgICAgYXBwLmZhY3RvcnkobmFtZSwgZmFjdG9yeUFycmF5KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSBjb25zdHJ1Y3RvckZuIGlzIGFuIGFycmF5IG9mIHR5cGUgWydkZXAxJywgJ2RlcDInLCAuLi4sIGNvbnN0cnVjdG9yKCkge31dXHJcbiAgICAgKiB3ZSBuZWVkIHRvIHB1bGwgb3V0IHRoZSBhcnJheSBvZiBkZXBlbmRlbmNpZXMgYW5kIGFkZCBpdCBhcyBhbiAkaW5qZWN0IHByb3BlcnR5IG9mIHRoZVxyXG4gICAgICogYWN0dWFsIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIGlucHV0XHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9ub3JtYWxpemVDb25zdHJ1Y3RvcihpbnB1dCkge1xyXG4gICAgICAgIHZhciBjb25zdHJ1Y3RvckZuO1xyXG5cclxuICAgICAgICBpZihpbnB1dC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgY29uc3QgaW5qZWN0ZWQgPSBpbnB1dC5zbGljZSgwLCBpbnB1dC5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgY29uc3RydWN0b3JGbiA9IGlucHV0W2lucHV0Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvckZuLiRpbmplY3QgPSBpbmplY3RlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yRm4gPSBpbnB1dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3RvckZuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGludG8gYSBmYWN0b3J5IGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhhdFxyXG4gICAgICogY29uc3RydWN0b3IsIHdpdGggdGhlIGNvcnJlY3QgZGVwZW5kZW5jaWVzIGF1dG9tYXRpY2FsbHkgaW5qZWN0ZWQgYXMgYXJndW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIEluIG9yZGVyIHRvIGluamVjdCB0aGUgZGVwZW5kZW5jaWVzLCB0aGV5IG11c3QgYmUgYXR0YWNoZWQgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHdpdGggdGhlXHJcbiAgICAgKiBgJGluamVjdGAgcHJvcGVydHkgYW5ub3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29uc3RydWN0b3JGblxyXG4gICAgICogQHJldHVybnMge0FycmF5LjxUPn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9jcmVhdGVGYWN0b3J5QXJyYXkoY29uc3RydWN0b3JGbikge1xyXG4gICAgICAgIC8vIGdldCB0aGUgYXJyYXkgb2YgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIG5lZWRlZCBieSB0aGlzIGNvbXBvbmVudCAoYXMgY29udGFpbmVkIGluIHRoZSBgJGluamVjdGAgYXJyYXkpXHJcbiAgICAgICAgY29uc3QgYXJncyA9IGNvbnN0cnVjdG9yRm4uJGluamVjdCB8fCBbXTtcclxuICAgICAgICBjb25zdCBmYWN0b3J5QXJyYXkgPSBhcmdzLnNsaWNlKCk7IC8vIGNyZWF0ZSBhIGNvcHkgb2YgdGhlIGFycmF5XHJcbiAgICAgICAgLy8gVGhlIGZhY3RvcnlBcnJheSB1c2VzIEFuZ3VsYXIncyBhcnJheSBub3RhdGlvbiB3aGVyZWJ5IGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXkgaXMgdGhlIG5hbWUgb2YgYVxyXG4gICAgICAgIC8vIGRlcGVuZGVuY3ksIGFuZCB0aGUgZmluYWwgaXRlbSBpcyB0aGUgZmFjdG9yeSBmdW5jdGlvbiBpdHNlbGYuXHJcbiAgICAgICAgZmFjdG9yeUFycmF5LnB1c2goKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgLy9yZXR1cm4gbmV3IGNvbnN0cnVjdG9yRm4oLi4uYXJncyk7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjb25zdHJ1Y3RvckZuKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGtleSBpbiBpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGluc3RhbmNlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmFjdG9yeUFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xvbmUgYSBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIG9yaWdpbmFsXHJcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9jbG9uZUZ1bmN0aW9uKG9yaWdpbmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgYW4gb2JqZWN0J3MgbWV0aG9kIHdpdGggYSBuZXcgb25lIHNwZWNpZmllZCBieSBgY2FsbGJhY2tgLlxyXG4gICAgICogQHBhcmFtIG9iamVjdFxyXG4gICAgICogQHBhcmFtIG1ldGhvZE5hbWVcclxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfb3ZlcnJpZGUob2JqZWN0LCBtZXRob2ROYW1lLCBjYWxsYmFjaykge1xyXG4gICAgICAgIG9iamVjdFttZXRob2ROYW1lXSA9IGNhbGxiYWNrKG9iamVjdFttZXRob2ROYW1lXSk7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

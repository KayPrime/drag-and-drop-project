// Autobind Decorator;
export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalFunction = descriptor.value;

  const modifiedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFunc = originalFunction.bind(this);
      return boundFunc;
    },
  };
  return modifiedDescriptor;
}

import { logQuery } from ".";

export type ProxyOptions = {
  methods: string[];
};

export function createProxy<T extends object>(
  client: T,
  options: ProxyOptions,
): T {
  return new Proxy(client, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      if (typeof original !== "function") {
        return original;
      }

      return function (...args: any[]) {
        if (typeof prop === "string" && options.methods.includes(prop)) {
          logQuery({ query: args[0], durationMs: 100 });
        }
        return original.apply(target, args);
      };
    },
  });
}

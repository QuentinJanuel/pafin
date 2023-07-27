type Unpromisify<T> = T extends Promise<infer U> ? U : T;

/**
 * Runs a function if the argument is not undefined.
 * The function can return a promise.
 * It will always return a promise.
 * @param fn The function to run.
 * @param arg The argument to pass to the function.
 * @returns The result of the function.
 */
export const runMaybe = <T, U> (
    fn: (arg: T) => U,
    arg: T | undefined,
): Promise<Unpromisify<U> | undefined> => {
    if (arg === undefined)
        return Promise.resolve(undefined);
    const res = fn(arg);
    if (res instanceof Promise)
        return res;
    return Promise.resolve(res as Unpromisify<U>);
};

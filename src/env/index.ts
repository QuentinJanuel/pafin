import dotenv from "dotenv";
dotenv.config();

/**
 * Gets the value of an environment variable.
 * @param key The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws An error if the environment variable is not defined.
 */
export const get = (key: string): string => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing environment variable: ${key}`);
    return value;
};

/**
 * Gets the value of an environment variable as a number.
 * @param key The name of the environment variable.
 * @returns The value of the environment variable as a number.
 * @throws An error if the environment variable is not defined
 * or is not a number.
 */
export const getNumber = (key: string): number => {
    const valueStr = get(key);
    const value = Number(valueStr);
    if (isNaN(value))
        throw new Error(`Environment variable is not a number: ${key}`);
    return value;
};

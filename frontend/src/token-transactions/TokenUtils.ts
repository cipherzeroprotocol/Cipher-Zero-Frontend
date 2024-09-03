// frontend/src/token-transaction/TokenUtils.ts

import { BigNumber } from 'bignumber.js';

/**
 * Converts a token amount from a human-readable format (e.g., "1.0") to the smallest unit (e.g., wei).
 * @param amount - The amount in human-readable format.
 * @param decimals - The number of decimals the token uses.
 * @returns The amount in the smallest unit as a string.
 */
export function toSmallestUnit(amount: string, decimals: number): string {
    const amountBN = new BigNumber(amount);
    const factor = new BigNumber(10).pow(decimals);
    return amountBN.times(factor).toFixed(0);
}

/**
 * Converts a token amount from the smallest unit (e.g., wei) to a human-readable format (e.g., "1.0").
 * @param amount - The amount in the smallest unit.
 * @param decimals - The number of decimals the token uses.
 * @returns The amount in human-readable format as a string.
 */
export function fromSmallestUnit(amount: string, decimals: number): string {
    const amountBN = new BigNumber(amount);
    const factor = new BigNumber(10).pow(decimals);
    return amountBN.dividedBy(factor).toFixed(decimals);
}

/**
 * Validates if a given string is a valid Ethereum address.
 * @param address - The address to validate.
 * @returns True if the address is valid, false otherwise.
 */
export function isValidEthereumAddress(address: string): boolean {
    // Simple check for length and hex format; use a library for full validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Formats a token amount for display, rounding it to the specified number of decimals.
 * @param amount - The amount to format.
 * @param decimals - The number of decimals to round to.
 * @returns The formatted amount as a string.
 */
export function formatTokenAmount(amount: string, decimals: number): string {
    const amountBN = new BigNumber(amount);
    return amountBN.toFormat(decimals);
}

/**
 * Parses a token amount from a string with formatting (e.g., "1,000.00") to its smallest unit.
 * @param formattedAmount - The formatted amount to parse.
 * @param decimals - The number of decimals the token uses.
 * @returns The amount in the smallest unit as a string.
 */
export function parseTokenAmount(formattedAmount: string, decimals: number): string {
    const amountBN = new BigNumber(formattedAmount.replace(/,/g, ''));
    return toSmallestUnit(amountBN.toString(), decimals);
}

/**
 * Calculates the total supply of a token, ensuring it's a non-negative value.
 * @param supply - The total supply as a string.
 * @returns The total supply as a BigNumber instance.
 */
export function calculateTotalSupply(supply: string): BigNumber {
    const supplyBN = new BigNumber(supply);
    if (supplyBN.isNegative()) {
        throw new Error('Total supply cannot be negative');
    }
    return supplyBN;
}

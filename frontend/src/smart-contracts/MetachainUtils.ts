// frontend/src/meta-chain/MetaChainUtils.ts

import { BigNumber } from 'bignumber.js';

/**
 * Utility functions for MetaChain integration.
 */
export class MetaChainUtils {
    private static readonly DECIMALS = 18; // Adjust if MetaChain uses a different decimal system

    /**
     * Validates if a given address is valid.
     * @param address The address to validate
     * @returns True if the address is valid, false otherwise
     */
    static isValidAddress(address: string): boolean {
        // Example validation for Ethereum-like addresses
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    /**
     * Converts Wei to Ether.
     * @param value The value in Wei
     * @returns The value in Ether as a string
     */
    static weiToEther(value: string | BigNumber): string {
        return new BigNumber(value).shiftedBy(-MetaChainUtils.DECIMALS).toString();
    }

    /**
     * Converts Ether to Wei.
     * @param value The value in Ether
     * @returns The value in Wei as a string
     */
    static etherToWei(value: string | BigNumber): string {
        return new BigNumber(value).shiftedBy(MetaChainUtils.DECIMALS).toString();
    }

    /**
     * Formats a value in Ether to a human-readable string with specified decimal places.
     * @param value The value in Ether
     * @param decimalPlaces The number of decimal places to display
     * @returns The formatted string
     */
    static formatEther(value: string | BigNumber, decimalPlaces: number = 6): string {
        return new BigNumber(value).toFixed(decimalPlaces);
    }

    /**
     * Converts a value to a fixed-point decimal representation.
     * @param value The value to convert
     * @param decimalPlaces The number of decimal places
     * @returns The fixed-point representation as a string
     */
    static toFixedDecimal(value: string | number | BigNumber, decimalPlaces: number): string {
        return new BigNumber(value).toFixed(decimalPlaces);
    }

    /**
     * Parses a formatted string to a BigNumber.
     * @param value The formatted string
     * @returns The parsed BigNumber
     */
    static parseToBigNumber(value: string): BigNumber {
        return new BigNumber(value);
    }

    /**
     * Checks if a value is a valid number.
     * @param value The value to check
     * @returns True if the value is a valid number, false otherwise
     */
    static isValidNumber(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}

// Example usage
const weiValue = '1000000000000000000'; // 1 Ether in Wei
const etherValue = MetaChainUtils.weiToEther(weiValue);
console.log(`Wei to Ether: ${etherValue}`); // Should output: 1

const formattedEther = MetaChainUtils.formatEther(etherValue);
console.log(`Formatted Ether: ${formattedEther}`); // Should output: 1.000000

const isValid = MetaChainUtils.isValidAddress('0x1234567890abcdef1234567890abcdef12345678');
console.log(`Is valid address: ${isValid}`); // Should output: true

const fixedDecimal = MetaChainUtils.toFixedDecimal('123.4567', 2);
console.log(`Fixed decimal: ${fixedDecimal}`); // Should output: 123.46

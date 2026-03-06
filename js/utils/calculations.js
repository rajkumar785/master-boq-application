/**
 * Centralized Calculation Utilities
 * Eliminates duplicate calculation functions across the application
 */

export const Calculations = {
  /**
   * Reinforcement Weight Calculation
   * Formula: (Diameter² ÷ 162) × Length
   * @param {number} diameter - Bar diameter in mm
   * @param {number} length - Bar length in meters
   * @returns {number} Weight in kg
   */
  reinforcementWeight(diameter, length) {
    return (Math.pow(diameter, 2) / 162) * length;
  },

  /**
   * Concrete Volume Calculation
   * Formula: Length × Width × Height
   * @param {number} length - Length in meters
   * @param {number} width - Width in meters  
   * @param {number} height - Height in meters
   * @returns {number} Volume in cubic meters
   */
  concreteVolume(length, width, height) {
    return length * width * height;
  },

  /**
   * Area Calculation
   * Formula: Length × Width
   * @param {number} length - Length in meters
   * @param {number} width - Width in meters
   * @returns {number} Area in square meters
   */
  area(length, width) {
    return length * width;
  },

  /**
   * Material Wastage Calculation
   * Formula: Quantity × (1 + Wastage%)
   * @param {number} quantity - Base quantity
   * @param {number} wastagePercent - Wastage percentage (e.g., 5 for 5%)
   * @returns {number} Quantity with wastage
   */
  materialWastage(quantity, wastagePercent) {
    return quantity * (1 + (wastagePercent / 100));
  },

  /**
   * Rate Buildup Calculation
   * @param {object} components - {materials, labour, equipment}
   * @param {number} wastePercent - Waste percentage
   * @param {number} overheadPercent - Overhead percentage
   * @param {number} profitPercent - Profit percentage
   * @returns {object} Complete rate breakdown
   */
  rateBuildup(components, wastePercent = 0, overheadPercent = 12, profitPercent = 10) {
    const direct = (components.materials || 0) + (components.labour || 0) + (components.equipment || 0);
    const waste = direct * (wastePercent / 100);
    const subTotal = direct + waste;
    const overhead = subTotal * (overheadPercent / 100);
    const profit = (subTotal + overhead) * (profitPercent / 100);
    const finalRate = subTotal + overhead + profit;

    return {
      materials: components.materials || 0,
      labour: components.labour || 0,
      equipment: components.equipment || 0,
      direct,
      waste,
      subTotal,
      overhead,
      profit,
      finalRate
    };
  },

  /**
   * BOQ Amount Calculation
   * Formula: Quantity × Rate
   * @param {number} quantity - Item quantity
   * @param {number} rate - Unit rate
   * @returns {number} Total amount
   */
  boqAmount(quantity, rate) {
    return quantity * rate;
  },

  /**
   * Format Currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Round to Decimal Places
   * @param {number} value - Value to round
   * @param {number} decimals - Decimal places
   * @returns {number} Rounded value
   */
  round(value, decimals = 2) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};

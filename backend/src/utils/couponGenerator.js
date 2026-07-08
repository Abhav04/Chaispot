/**
 * Generates a random, unique, readable coupon code.
 * Example format: CHAI-X7K2P9
 */
const generateCouponCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codeSuffix = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    codeSuffix += chars.charAt(randomIndex);
  }
  return `CHAI-${codeSuffix}`;
};

module.exports = {
  generateCouponCode
};

const otpCache = new Map();

const EXPIRE_MIN = 5;

const generateOTP = (key) => {
  const min = 100000;
  const max = 999999;
  const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(OTP);
  otpCache.set(key, OTP);
  setTimeout(() => {
    otpCache.delete(key);
    console.log(`Cache for key ${key} has been expired and removed.`);
  }, EXPIRE_MIN * 60 * 1000);
  return OTP;
};

const validateOTP = (key, OTP) => {
  const cacheOTP = getOPTByKey(key);

  if (cacheOTP == OTP) {
    clearOTPFromCache(key);
    return true;
  }
  return false;
};

const getOPTByKey = (key) => {
  return otpCache.get(key);
};

const clearOTPFromCache = (key) => {
  otpCache.delete(key);
};

module.exports = { generateOTP, validateOTP };

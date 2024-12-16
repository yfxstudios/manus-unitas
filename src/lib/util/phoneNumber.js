const phoneNumberFormatter = (e) => {
  const input = e.target.value;
  const formatted = formatPhoneNumber(input);
  return formatted;
}

export const formatPhoneNumber = (input) => {
  if (!input) return input;
  const phoneNumber = input.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export default phoneNumberFormatter
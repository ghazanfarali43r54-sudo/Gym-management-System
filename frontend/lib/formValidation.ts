export const isValidEmail = (value: string) =>
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(value.trim());

export const isValidPersonName = (value: string) =>
  /^(?=.{2,80}$)[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(value.trim());

export const phoneError = (value: string, required = true) => {
  const digits = value.replace(/\D/g, "");
  if (!digits && !required) return "";
  if (!digits) return "Phone number is required.";
  if (digits.length > 11) return "Phone number cannot contain more than 11 digits.";
  if (digits.length < 11) return "Enter an 11-digit phone number.";
  if (!/^[+\d()\s.-]+$/.test(value)) return "Phone number can contain only digits and common separators.";
  return "";
};

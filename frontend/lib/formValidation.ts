export function isValidEmail(value: string): boolean {
  const email = value.trim();
  const atPosition = email.indexOf("@");

  // An email must have one @, with text before and after it.
  if (atPosition <= 0 || atPosition !== email.lastIndexOf("@")) {
    return false;
  }

  const name = email.slice(0, atPosition);
  const domain = email.slice(atPosition + 1);

  if (name.length > 64 || email.length > 254 || !domain.includes(".")) {
    return false;
  }

  // Keep the allowed characters check simple and readable.
  const allowedNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!#$%&'*+/=?^_`{|}~-";
  for (const character of name) {
    if (!allowedNameCharacters.includes(character)) {
      return false;
    }
  }

  const domainParts = domain.split(".");
  for (const part of domainParts) {
    if (part.length === 0 || part.length > 63 || part.startsWith("-") || part.endsWith("-")) {
      return false;
    }

    for (const character of part) {
      const isLetterOrNumber =
        (character >= "a" && character <= "z") ||
        (character >= "A" && character <= "Z") ||
        (character >= "0" && character <= "9");

      if (!isLetterOrNumber && character !== "-") {
        return false;
      }
    }
  }

  return true;
}

export function isValidPersonName(value: string): boolean {
  const name = value.trim();

  if (name.length < 2 || name.length > 80) {
    return false;
  }

  const words = name.split(/[ '\u2019-]/u);
  for (const word of words) {
    if (word.length === 0) {
      return false;
    }

    for (const character of word) {
      if (!/^\p{L}$/u.test(character)) {
        return false;
      }
    }
  }

  return true;
}

export function phoneError(value: string, required = true): string {
  let digitCount = 0;
  const allowedSeparators = "+() .-";

  for (const character of value) {
    if (character >= "0" && character <= "9") {
      digitCount += 1;
    } else if (!allowedSeparators.includes(character)) {
      return "Phone number can contain only digits and common separators.";
    }
  }

  if (digitCount === 0 && !required) {
    return "";
  }
  if (digitCount === 0) {
    return "Phone number is required.";
  }
  if (digitCount > 15) {
    return "Phone number cannot contain more than 15 digits.";
  }
  if (digitCount < 7) {
    return "Enter a phone number with at least 7 digits.";
  }

  return "";
}

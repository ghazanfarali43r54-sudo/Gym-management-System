const OBJECT_ID = /^[a-f\d]{24}$/i;

const NAME_PATTERN = /^(?=.{2,80}$)[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u;
const EMAIL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const PHONE_PATTERN = /^[+\d()\s.-]+$/;

function validateAdminMember(body, { partial = false } = {}) {
  const errors = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
  const text = (value) => (typeof value === "string" ? value.trim() : "");

  if (!partial || has("name")) {
    const name = text(body.name);
    if (!NAME_PATTERN.test(name)) {
      errors.name = "Enter a valid name using letters, spaces, apostrophes, or hyphens.";
    }
  }

  if (!partial || has("email")) {
    const email = text(body.email).toLowerCase();
    if (!EMAIL_PATTERN.test(email) || email.length > 100) {
      errors.email = "Enter a valid email address.";
    }
  }

  if (!partial || has("phone")) {
    const phone = text(body.phone);
    const digitCount = phone.replace(/\D/g, "").length;
    if (!PHONE_PATTERN.test(phone) || digitCount < 7 || digitCount > 15) {
      errors.phone = "Enter a phone number with 7 to 15 digits.";
    }
  }

  if (!partial || has("password")) {
    const password = body.password;
    if ((!partial && typeof password !== "string") ||
      (password !== undefined && password !== "" &&
        (typeof password !== "string" || password.length < 6 || password.length > 72))) {
      errors.password = "Password must be between 6 and 72 characters.";
    }
  }

  if (has("gender") && body.gender &&
    !["male", "female", "other"].includes(String(body.gender).toLowerCase())) {
    errors.gender = "Select a valid gender.";
  }

  if (has("dateOfBirth") && body.dateOfBirth) {
    const dateOfBirth = new Date(body.dateOfBirth);
    if (Number.isNaN(dateOfBirth.getTime()) || dateOfBirth > new Date()) {
      errors.dateOfBirth = "Enter a valid date of birth.";
    }
  }

  if (has("membershipPlanIds")) {
    const ids = body.membershipPlanIds;
    if (!Array.isArray(ids) || ids.length > 20 ||
      ids.some((id) => typeof id !== "string" || !OBJECT_ID.test(id)) ||
      new Set(ids).size !== ids.length) {
      errors.membershipPlanIds = "Select valid membership plans.";
    }
  }

  if (has("assignedTrainerId") && body.assignedTrainerId &&
    !OBJECT_ID.test(String(body.assignedTrainerId))) {
    errors.assignedTrainerId = "Select a valid trainer.";
  }

  const allowedStatuses = partial
    ? ["pending", "active", "inactive", "rejected"]
    : ["pending", "active", "inactive"];
  if (has("status") && !allowedStatuses
    .includes(String(body.status).toLowerCase())) {
    errors.status = "Select a valid member status.";
  }

  for (const [key, max] of [["street", 150], ["city", 100], ["country", 100]]) {
    if (body.address && Object.prototype.hasOwnProperty.call(body.address, key) &&
      text(body.address[key]).length > max) {
      errors[`address.${key}`] = `${key[0].toUpperCase()}${key.slice(1)} cannot exceed ${max} characters.`;
    }
  }

  if (body.emergencyContact && typeof body.emergencyContact === "object") {
    const contact = body.emergencyContact;
    const hasAny = ["name", "relationship", "phone"].some((key) => text(contact[key]));
    if (hasAny) {
      for (const key of ["name", "relationship", "phone"]) {
        if (!text(contact[key])) errors[`emergencyContact.${key}`] = "Complete all emergency contact information.";
      }
      if (text(contact.name).length > 60) errors["emergencyContact.name"] = "Emergency contact name cannot exceed 60 characters.";
      if (text(contact.relationship).length > 50) errors["emergencyContact.relationship"] = "Emergency contact relationship cannot exceed 50 characters.";
      if (contact.phone && !/^\+?[\d\s-]{10,15}$/.test(text(contact.phone))) {
        errors["emergencyContact.phone"] = "Enter a valid emergency contact phone number.";
      }
    }
  }

  return errors;
}

module.exports = { validateAdminMember };

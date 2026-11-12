const OBJECT_ID = /^[a-f\d]{24}$/i;
const { REQUEST_ROLES } = require("./roles");

function validateRegistration(body) {
  const errors = [];

  const text = (value) => (typeof value === "string" ? value.trim() : "");
  const role = text(body.role) || "member";

  const address = {
    street: text(body.address?.street),
    city: text(body.address?.city),
    country: text(body.address?.country),
  };

  const emergencyContact = {
    name: text(body.emergencyContact?.name),
    relationship: text(body.emergencyContact?.relationship),
    phone: text(body.emergencyContact?.phone),
  };

  const data = {
    role,
    name: text(body.name),
    email: text(body.email).toLowerCase(),
    phone: text(body.phone),
    password: typeof body.password === "string" ? body.password : "",

    photo: typeof body.photo === "string" ? body.photo : "",
    membershipPlanIds: Array.isArray(body.membershipPlanIds) ? body.membershipPlanIds : [],

    message: text(body.message),

    specialization: text(body.specialization),
    bio: text(body.bio),

    experience: body.experience,

    // Member personal information
    gender: text(body.gender).toLowerCase(),

    dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,

    address,
    emergencyContact,
  };

  // =====================================
  // COMMON VALIDATION
  // =====================================

  if (!/^(?=.{2,80}$)[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(data.name)) {
    errors.push("Enter a valid name using letters, spaces, apostrophes, or hyphens.");
  }

  if (!/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(data.email) || data.email.length > 100) {
    errors.push("Enter a valid email");
  }

  if (!/^[+\d()\s.-]+$/.test(data.phone) || data.phone.replace(/\D/g, "").length !== 11) {
    errors.push("Enter an 11-digit phone number.");
  }

  if (data.password.length < 6 || data.password.length > 72) {
    errors.push("Password must be 6 to 72 characters");
  }

  if (!REQUEST_ROLES.includes(data.role)) {
    errors.push("Select member or trainer");
  }

  if (data.role === "member" && (
    data.membershipPlanIds.length > 20 ||
    data.membershipPlanIds.some((id) => typeof id !== "string" || !OBJECT_ID.test(id)) ||
    new Set(data.membershipPlanIds).size !== data.membershipPlanIds.length
  )) {
    errors.push("Select valid membership plans.");
  }

  if (data.message.length > 300) {
    errors.push("Message cannot exceed 300 characters");
  }

  // =====================================
  // MEMBER VALIDATION
  // =====================================

  if (data.role === "member") {
    // Gender
    if (data.gender && !["male", "female", "other"].includes(data.gender)) {
      errors.push("Select a valid gender");
    }

    // Date of Birth
    if (body.dateOfBirth) {
      if (
        Number.isNaN(data.dateOfBirth.getTime()) ||
        data.dateOfBirth > new Date()
      ) {
        errors.push("Enter a valid date of birth");
      }
    }

    // Address
    if (
      address.street.length > 150 ||
      address.city.length > 100 ||
      address.country.length > 100
    ) {
      errors.push("Address information is too long");
    }

    // Emergency Contact
    const hasEmergencyContact = Object.values(emergencyContact).some(Boolean);

    if (hasEmergencyContact) {
      if (
        !emergencyContact.name ||
        !emergencyContact.relationship ||
        !emergencyContact.phone
      ) {
        errors.push("Complete all emergency contact information");
      }

      if (emergencyContact.name.length > 60) {
        errors.push("Emergency contact name is too long");
      }

      if (emergencyContact.relationship.length > 50) {
        errors.push("Emergency contact relationship is too long");
      }

      if (
        emergencyContact.phone &&
        !/^\+?[\d\s-]{10,15}$/.test(emergencyContact.phone)
      ) {
        errors.push("Enter a valid emergency contact phone");
      }
    }
  }

  // =====================================
  // TRAINER VALIDATION
  // =====================================

  if (data.role === "trainer") {
    if (!data.experience) {
      errors.push("Enter valid trainer experience");
    }

    if (!data.specialization || data.specialization.length > 100) {
      errors.push("Enter valid trainer specialization");
    }

    if (!data.bio) {
      errors.push("Trainer bio is required");
    }

    if (data.bio.length > 500) {
      errors.push("Bio cannot exceed 500 characters");
    }
  }

  // =====================================
  // PHOTO VALIDATION
  // =====================================

  if (data.photo) {
    if (!data.photo.startsWith("data:image/jpeg;base64,")) {
      errors.push("Photo must be a JPEG image");
    } else if (data.photo.length > 150000) {
      errors.push("Photo is too large");
    }
  }

  return {
    errors,
    data,
  };
}

module.exports = { validateRegistration };

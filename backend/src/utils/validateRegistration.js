const OBJECT_ID = /^[a-f\d]{24}$/i;
const { REQUEST_ROLES } = require("./roles");

function validateRegistration(body) {
  const errors = [];

  const text = (value) => (typeof value === "string" ? value.trim() : "");

  const role = text(body.role) || "member";

  const data = {
    role,
    name: text(body.name),
    email: text(body.email).toLowerCase(),
    phone: text(body.phone),
    password: typeof body.password === "string" ? body.password : "",

     

    photo: typeof body.photo === "string" ? body.photo : "",

    message: text(body.message),

    specialization: text(body.specialization),
    bio: text(body.bio),

    experience: body.experience,
  };

  // =====================================
  // COMMON VALIDATION
  // =====================================

  if (data.name.length < 2 || data.name.length > 60) {
    errors.push("Name must be 2 to 60 characters");
  }

  if (!/^\S+@\S+\.\S+$/.test(data.email) || data.email.length > 100) {
    errors.push("Enter a valid email");
  }

  if (!/^\+?[\d\s-]{10,15}$/.test(data.phone)) {
    errors.push("Enter a valid phone number");
  }

  if (data.password.length < 6 || data.password.length > 72) {
    errors.push("Password must be 6 to 72 characters");
  }

  

  if (!REQUEST_ROLES.includes(data.role)) {
    errors.push("Select member or trainer");
  }

  if (data.message.length > 300) {
    errors.push("Message cannot exceed 300 characters");
  }

  // =====================================
  // MEMBER VALIDATION
  // =====================================

 

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

    // data.experience = experience;
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

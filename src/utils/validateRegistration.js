// Registration form ki jaanch. Sab kuch yahin ek jagah hai.
const OBJECT_ID = /^[a-f\d]{24}$/i;
const { REQUEST_ROLES } = require("./roles");

function validateRegistration(body) {
  const errors = [];
  const text = (v) => (typeof v === "string" ? v.trim() : "");

  const data = {
        role: text(body.role) || "member",
    name: text(body.name),
    email: text(body.email).toLowerCase(),
    phone: text(body.phone),
    password: typeof body.password === "string" ? body.password : "",
    branchId: text(body.branchId),
    planId: text(body.planId),
    message: text(body.message),
    photo: typeof body.photo === "string" ? body.photo : "",
  };

  if (data.name.length < 2 || data.name.length > 60) errors.push("Name must be 2 to 60 characters");
  if (!/^\S+@\S+\.\S+$/.test(data.email) || data.email.length > 100) errors.push("Enter a valid email");
  if (!/^\+?[\d\s-]{10,15}$/.test(data.phone)) errors.push("Enter a valid phone number");
  if (data.password.length < 6 || data.password.length > 72) errors.push("Password must be 6 to 72 characters");
  if (!OBJECT_ID.test(data.branchId)) errors.push("Select a branch");
    if (!REQUEST_ROLES.includes(data.role)) errors.push("Select member or trainer");
  // Plan sirf member ke liye zaroori hai
  if (data.role === "member" && !OBJECT_ID.test(data.planId)) errors.push("Select a plan");
  if (data.message.length > 300) errors.push("Message is too long");

  if (data.photo) {
    if (!data.photo.startsWith("data:image/jpeg;base64,")) errors.push("Photo must be a JPEG image");
    else if (data.photo.length > 150000) errors.push("Photo is too large");
  }

  return { errors, data };
}

module.exports = { validateRegistration };
// Jin roles ki "join request" aa sakti hai (admin sirf seed se banta hai)
exports.REQUEST_ROLES = ["member", "trainer"];

// Backend tay karta hai ke login ke baad kaun kis dashboard par jayega
exports.DASHBOARD_PATH = {
  admin: "/admin/dashboard",
  trainer: "/trainer/dashboard",
  member: "/member/dashboard",
};
// Branch aur Plan dono ke liye ek hi CRUD (list, create, update, delete).
// fields  = jo fields admin badal sakta hai (baqi sab ignore)
// inUse   = delete se pehle check: kya koi member/request isay use kar raha hai?
const OBJECT_ID = /^[a-f\d]{24}$/i;

function sendError(res, err, label) {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: `A ${label.toLowerCase()} with this name already exists` });
  }
  console.log(`${label} error:`, err.message);
  res.status(500).json({ message: "Server error" });
}

module.exports = function crud(Model, fields, inUse, label) {
  // body me se sirf allowed fields uthao
  const pick = (body) => {
    const src = body && typeof body === "object" ? body : {};
    return Object.fromEntries(fields.filter((f) => f in src).map((f) => [f, src[f]]));
  };

  return {
    // GET /  -> sab (inactive bhi, admin ko dikhne chahiye)
    list: async (req, res) => {
      try {
        res.json({ items: await Model.find().sort("name") });
      } catch (err) {
        sendError(res, err, label);
      }
    },

    // POST /
    create: async (req, res) => {
      try {
        const item = await Model.create(pick(req.body));
        res.status(201).json({ message: `${label} created`, item });
      } catch (err) {
        sendError(res, err, label);
      }
    },

    // PUT /:id
    update: async (req, res) => {
      try {
        if (!OBJECT_ID.test(req.params.id)) return res.status(404).json({ message: `${label} not found` });
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: `${label} not found` });

        item.set(pick(req.body));
        await item.save(); // yahan rules (required, min, unique) check hote hain
        res.json({ message: `${label} updated`, item });
      } catch (err) {
        sendError(res, err, label);
      }
    },

    // DELETE /:id
    remove: async (req, res) => {
      try {
        if (!OBJECT_ID.test(req.params.id)) return res.status(404).json({ message: `${label} not found` });
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: `${label} not found` });

        // Agar members use kar rahe hain to delete nahi, sirf Inactive karne do
        if (await inUse(item._id)) {
          return res.status(409).json({
            message: `This ${label.toLowerCase()} is used by members or requests. Set it to Inactive instead of deleting.`,
          });
        }
        await Model.deleteOne({ _id: item._id });
        res.json({ message: `${label} deleted` });
      } catch (err) {
        sendError(res, err, label);
      }
    },
  };
};
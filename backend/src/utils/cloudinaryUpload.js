
const cloudinary = require("../config/cloudinary");

// Upload an image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gym-management/profiles",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Delete an existing Cloudinary image
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};

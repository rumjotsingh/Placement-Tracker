import cloudinary from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

export const uploadToCloudinary = (buffer, folder, resourceType = 'auto') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `placetrack/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(new ApiError(500, 'File upload failed'));
        resolve(result);
      }
    );
    stream.end(buffer);
  });

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

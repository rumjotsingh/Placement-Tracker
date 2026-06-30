import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    return cb(new ApiError(400, 'Only PDF files are allowed for resumes'), false);
  }

  if (file.fieldname === 'profileImage' || file.fieldname === 'logo') {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new ApiError(400, 'Only image files are allowed'), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

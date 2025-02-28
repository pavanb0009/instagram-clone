import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import Media from "../models/mediaModel.js"
import { ErrorHandler } from '../utils/ErrorHandler.js';

export const uploadMedia = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler('No file uploaded', 400));
  }

  const { caption } = req.body;
  const mediaUrl = req.file.path;
  const mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';

  const media = await Media.create({
    user: req.user._id,
    mediaUrl,
    mediaType,
    caption
  });

  res.status(201).json({
    success: true,
    media
  });
});
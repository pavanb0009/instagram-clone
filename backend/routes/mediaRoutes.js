import express from 'express';
import { isAuthenticatedUser } from '../middlewares/authUser.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import { uploadMedia } from '../controllers/mediaController.js';


const router = express.Router();
const upload = multer({ storage: storage });

router.use(isAuthenticatedUser);

router.post('/upload', isAuthenticatedUser, upload.single('file'), uploadMedia);

export default router;

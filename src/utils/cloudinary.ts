import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const cloudinaryUploadImage = async (fileToUpload: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUpload,
      { resource_type: 'auto' },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
          });
        } else {
          reject(new Error('Cloudinary upload returned undefined result.'));
        }
      },
    );
  });
};

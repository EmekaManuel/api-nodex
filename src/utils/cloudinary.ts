import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export const cloudinaryUploadImage = async (fileToUpload: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUpload, (error: any, result: any) => {
      if (error) {
        console.error('Error uploading image to Cloudinary:', error);
        reject(error);
      } else {
        if (result.secure_url) {
          resolve({
            url: result.secure_url,
            resource_type: 'auto',
          });
        } else {
          const errorMessage = 'Secure URL not found in Cloudinary upload result';
          console.error(errorMessage);
          reject(new Error(errorMessage));
        }
      }
    });
  });
};

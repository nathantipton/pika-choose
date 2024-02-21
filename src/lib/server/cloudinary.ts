import { PRIVATE_CLOUDINARY_API_KEY, PRIVATE_CLOUDINARY_API_SECRET, PRIVATE_CLOUDINARY_CLOUD_NAME } from '$env/static/private';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: PRIVATE_CLOUDINARY_CLOUD_NAME,
    api_key: PRIVATE_CLOUDINARY_API_KEY,
    api_secret: PRIVATE_CLOUDINARY_API_SECRET
});

export default cloudinary;

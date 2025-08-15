import { UploadApiErrorResponse, UploadApiResponse, type UploadApiOptions } from "cloudinary";
import cloudinary from "./cloudinary";

/**
 * Uploads a file buffer to Cloudinary.
 * @param fileBuffer Buffer - file data
 * @param folder Optional folder name in Cloudinary
 * @returns Cloudinary upload result
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  resource_type: UploadApiOptions["resource_type"],
  folder?: string
) {
  return new Promise<UploadApiResponse | UploadApiErrorResponse | undefined>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type, folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
}

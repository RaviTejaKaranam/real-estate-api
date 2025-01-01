import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { nanoid } from "nanoid";

const client = new S3Client({
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
});
const resizeImage = async (buffer) => {
  return sharp(buffer)
    .resize(1600, 900, { fit: "inside" }, { withoutEnlargement: true })
    .toBuffer();
};

const uploadToS3 = async (buffer, mimetype, uploadedBy) => {
  const metadata = await sharp(buffer).metadata();
  const fileExtension = metadata.format || "jpg";
  const Key = `${nanoid()}.${fileExtension}`;
  const Location = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
    Body: buffer,
    ContentType: mimetype,
  };
  try {
    const command = new PutObjectCommand(params);
    await client.send(command);
    return {
      Key,
      Location,
      uploadedBy,
    };
  } catch (err) {
    console.log(err);
    return res.json({
      err: "Error while uploading image",
    });
  }
};

export const uploadImageToS3 = async (files, uploadedBy) => {
  const uploadPromises = files.map(async (file) => {
    const resizedBuffer = await resizeImage(file.buffer);
    return uploadToS3(resizedBuffer, file.mimetype, uploadedBy);
  });

  return Promise.all(uploadPromises);
};

export const deleteImageFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await client.send(command);
  } catch (err) {
    console.log(err);
    throw new Error("Error while deleting image");
  }
};

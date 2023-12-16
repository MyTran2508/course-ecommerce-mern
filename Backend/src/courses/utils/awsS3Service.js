const S3 = require("aws-sdk/clients/s3");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_KEY;
const region = process.env.REGION;
const bucket = process.env.BUCKET;
// Cấu hình AWS SDK
const s3 = new S3({
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

const uploadFile = async (filePath, file) => {
  const fileStream = fs.createReadStream(file.path);
  const timestamp = new Date().getTime();
  const pathFile = `${filePath}${timestamp}_${file.originalname}`;
  const uploadParams = {
    Bucket: bucket,
    Body: fileStream,
    Key: pathFile,
  };
  // console.log(pathFile);
  await s3.upload(uploadParams).promise();
  return pathFile;
};

const getFileStream = async (filePath) => {
  const downloadParams = {
    Key: filePath,
    Bucket: bucket,
  };

  let isFileExists;
  try {
    await s3.headObject(downloadParams).promise();
    isFileExists = true;
  } catch (error) {}
  if (!isFileExists) return isFileExists;

  const stream = s3.getObject(downloadParams).createReadStream();
  const chunks = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString("base64");
      resolve(base64);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = { uploadFile, getFileStream };

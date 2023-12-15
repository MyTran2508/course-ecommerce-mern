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
  const pathFile = `${
    filePath === "" ? file.destination : filePath
  }${timestamp}_${file.originalname}`;
  const uploadParams = {
    Bucket: bucket,
    Body: fileStream,
    Key: pathFile,
  };
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
  return await s3.getObject(downloadParams).createReadStream();
};

module.exports = { uploadFile, getFileStream };

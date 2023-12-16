async function isDocument(file) {
  const documentExtensions = ["pdf", "docx", "doc", "txt"];
  return checkExtension(file, documentExtensions);
}

async function isVideo(file) {
  const videoExtensions = ["avi", "mp4", "mov"];
  return checkExtension(file, videoExtensions);
}

async function checkExtension(file, allowedExtensions) {
  const fileExtension = file.originalname.split(".").pop().toLowerCase();
  return allowedExtensions.includes(fileExtension);
}

module.exports = { isDocument, isVideo };

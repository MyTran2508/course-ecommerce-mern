async function isDocument(file) {
    const documentExtensions = ["pdf", "docx", "doc", "txt"];
    return await checkExtension(file, documentExtensions);
}
  
async function isVideo(file) {
    const videoExtensions = ["avi", "mp4", "mov"];
    return await checkExtension(file, videoExtensions);
}
  
async function checkExtension(file, allowedExtensions) {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    console.log(fileExtension);
    return await allowedExtensions.includes(fileExtension);
}

module.exports = {isDocument, isVideo};
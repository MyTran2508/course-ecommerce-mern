const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const User = require('../../users/model/userModel');

class StorageService {
    constructor() {
        this.FOLDER_PATH = path.join(__dirname, 'data-app', 'user', 'photos');
        this.validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    }
    isFileImage(file) {
        if (!file || file.length === 0) {
            return false;
        }
        const originalFilename = file.originalname;
        const extension = path.extname(originalFilename).toLowerCase();
        return this.validExtensions.includes(extension);
    }
    async uploadImageToFileSystem(file) {
        const filePath = path.join(this.FOLDER_PATH, file.originalname);
        try {
            if (!this.isFileImage(file)) {
                return new DataResponse(400, 'Invalid file format.', null);
            }
            await fs.mkdir(this.FOLDER_PATH, { recursive: true });
            await fs.writeFile(filePath, file.buffer);
            user.photos = filePath;
            await user.save();
            return filePath;
        } catch (error) {
            console.error(error);
            return new DataResponse(500, 'Internal server error.', null);
        }
    }
    async loadImageFromFileSystem(username) {
        const user = await User.findOne({ username });
        if (!user || !user.photos || user.photos.length === 0) {
            return null;
        }
        const filePath = user.photos;
        try {
            return await fs.readFile(filePath);
        } catch (error) {
            console.error(error);
            return Buffer.from('Not Found');
        }
    }

}
module.exports = {StorageService};


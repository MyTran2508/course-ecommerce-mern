const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'doaapjibz',
    api_key: '852255256533734',
    api_secret: '***************************'
});

module.exports = { cloudinary };
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
    cloud_name: 'dhiggdlws',
    api_key: '646541625879212',
    api_secret: '1TtVz97YAaV2jQ6ITkD6_SqZaxU' // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary
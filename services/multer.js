const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
folder: "mernBlogImages",
allowedFormats: ["jpg", "png"],
transformation: [{
width: 500,
height: 500,
crop: "limit"
}],
cloudinary: cloudinary
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'mernBlogImages',
//       format: async (req, file) => 'png', // supports promises as well
//     },
//   });
module.exports = multer({storage: storage});
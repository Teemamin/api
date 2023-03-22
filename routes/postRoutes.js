const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController')
require("../services/cloudinary.config");
const upload = require("../services/multer");
const authMiddleware = require('../middleware/auth')



router.get('/', postsController.getAllPosts)
router.get('/get-post/:postId', postsController.getPost)
router.get('/get-comments/:postId', postsController.getComments)
router.post('/add-post', authMiddleware,upload.single("image"), postsController.addPost)
router.post('/add-comment/:commentId',authMiddleware, postsController.commentPost)
router.patch('/edit-comment/:commentId',authMiddleware, postsController.editComment)
router.patch('/edit-post/:id', authMiddleware,postsController.editPost)
router.delete('/delete-post/:id', authMiddleware,postsController.deletePost)
router.delete('/delete-comment/:commentId',authMiddleware, postsController.deleteComment)

module.exports = router
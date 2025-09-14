const express = require('express');
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  generateCaption,
  getAnalytics
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/', createPost);
router.get('/', getPosts);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/generate-caption', generateCaption);
router.get('/analytics', getAnalytics);

module.exports = router;
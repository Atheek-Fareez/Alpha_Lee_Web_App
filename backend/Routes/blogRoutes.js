import express from 'express';
import { getAllBlogs, getBlogBySlug, createBlog, deleteBlog, updateBlog } from "../Controllers/blogController.js";

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Controller implicitly checks req.user and req.user.role === 'admin' natively
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;

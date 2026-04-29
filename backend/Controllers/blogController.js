import Blog from "../Models/Blog.js";

export const getAllBlogs = async (req, res) => {
    try {
        // Find all blogs but do not populate the massive 'content' block to save bandwidth on the Main Grid
        const blogs = await Blog.find({}).select('-content').sort({ publishedAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Alpha Servers Offline", error: error.message });
    }
};

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) {
            return res.status(404).json({ message: "Article Not Found in the Archives." });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server connection failed.", error: error.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        // Security gate check (Ensured by router middleware, but a final safety here)
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized Command Access." });
        }

        const { title, slug, category, author, thumbnailImage, content } = req.body;

        const existingSlug = await Blog.findOne({ slug });
        if (existingSlug) {
            return res.status(400).json({ message: "Slug URL must be unique. Update the URL identifier." });
        }

        const blog = new Blog({
            title, slug, category, author, thumbnailImage, content
        });

        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        console.error("CMS Publishing Error: ", error);
        res.status(500).json({ message: "Failed to publish Protocol Data.", error: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found." });
        res.json({ message: "Article terminated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete article.", error: error.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized Command Access." });
        }

        const { title, slug, category, author, thumbnailImage, content } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id, 
            { title, slug, category, author, thumbnailImage, content },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Article Not Found." });
        }
        res.json(updatedBlog);
    } catch (error) {
        console.error("CMS Updating Error: ", error);
        res.status(500).json({ message: "Failed to overwrite Protocol Data.", error: error.message });
    }
};

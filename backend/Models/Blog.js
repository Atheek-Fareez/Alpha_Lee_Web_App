import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    author: { type: String, default: 'Alpha Protocol' },
    thumbnailImage: { type: String, default: '' },
    content: [{
        type: {
            type: String,
            enum: ['heading', 'paragraph', 'warning', 'video', 'list'],
            required: true
        },
        text: { type: String, default: '' },
        listItems: [{ type: String }] // Only used if type === 'list'
    }],
    publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);

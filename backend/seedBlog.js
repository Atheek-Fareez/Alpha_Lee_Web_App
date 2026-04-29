import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./Models/Blog.js";

dotenv.config();

const seedArticle = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url);
        console.log("Connected to MongoDB -> Commencing Data Injection");

        // Clear for clean seed
        await Blog.deleteMany({ slug: 'stop-buying-these-5-gym-supplements' });

        const article = new Blog({
            title: "Stop! Don’t Buy These 5 Gym Supplements",
            slug: "stop-buying-these-5-gym-supplements",
            category: "Supplements",
            author: "Alpha Protocol",
            thumbnailImage: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
            content: [
                {
                    type: "paragraph",
                    text: "The supplement industry is a multi-billion dollar machine designed to convince you that the missing link to your dream physique is hidden inside a plastic tub. While some compounds are backed by decades of rigorous scientific literature, the vast majority are nothing more than clever marketing disguising cheap proprietary blends. Before you empty your wallet, here are 5 supplements you need to stop buying."
                },
                {
                    type: "heading",
                    text: "1. Mass Gainers"
                },
                {
                    type: "paragraph",
                    text: "Marketed as the ultimate cheat code for hard-gainers, mass gainers are essentially bags of cheap maltodextrin (highly processed sugar) blended with a sprinkle of low-quality protein. Spiking your insulin with 1,200 empty calories daily will indeed cause the scale to move—but it will almost entirely be visceral fat. You are paying a premium for sugar."
                },
                {
                    type: "list",
                    text: "",
                    listItems: [
                        "Instead: Blend whole foods.",
                        "Add 2 scoops of whey.",
                        "Add 1 cup of oats, a banana, and peanut butter.",
                        "You get the exact same calories, but loaded with micronutrients and fiber."
                    ]
                },
                {
                    type: "warning",
                    text: "STEROIDS & PRO-HORMONES: Be extremely cautious when buying 'underground' test boosters or legal pro-hormones. These compounds often suppress your natural endocrine system without providing the actual benefits of anabolics, leaving you crashed out with zero gains and damaged blood work. Stick to the basics: creatine and high-quality protein."
                },
                {
                    type: "heading",
                    text: "2. BCAA's (Branched-Chain Amino Acids)"
                },
                {
                    type: "paragraph",
                    text: "They taste great, but if you are consuming adequate protein throughout the day (which contains all essential amino acids), dropping $40 on isolated BCAAs is essentially buying expensive flavored water. Your muscle protein synthesis is already maxed out."
                }
            ]
        });

        await article.save();
        console.log("Successfully injected the Modular CMS article: 'Stop! Don't Buy These 5 Gym Supplements'");
        
        process.exit();
    } catch (err) {
        console.error("Injection Failed:", err);
        process.exit(1);
    }
};

seedArticle();

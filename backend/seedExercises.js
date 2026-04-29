import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Exercise from './Models/Exercise.js';

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const csvFilePath = 'C:\\Users\\chamodya\\.gemini\\antigravity\\brain\\55aa0b3b-c496-4169-b922-35345c48a986\\.system_generated\\steps\\365\\content.md';
const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

// Regex logic explicitly targeting multi-line cells wrapped in generic quotes embedding standard HTTP payloads
const regex = /"([^"]+https?:\/\/[^"]+)"/g;
let match;
const parsedData = [];

while ((match = regex.exec(fileContent)) !== null) {
    const rawBlock = match[1];
    const lines = rawBlock.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    let name = '';
    let videoUrl = '';
    
    for (let line of lines) {
        if (line.startsWith('http')) {
            videoUrl = line;
        } else if (!line.startsWith('+') && !line.includes('tempo') && name === '') {
            name = line;
        }
    }
    
    if (name) {
        let muscleGroup = 'Full Body';
        let equipment = 'Other';
        const n = name.toLowerCase();
        
        // Logical string evaluating mapped Muscle structures natively
        if (n.includes('chest') || n.includes('press') || n.includes('fly') || n.includes('pec')) muscleGroup = 'Chest';
        if (n.includes('lat') || n.includes('row') || n.includes('pull') || n.includes('chin') || n.includes('shrug')) muscleGroup = 'Back';
        if (n.includes('squat') || n.includes('leg') || n.includes('calf') || n.includes('lunges') || n.includes('thrust')) muscleGroup = 'Legs';
        if (n.includes('shoulder') || n.includes('lateral') || n.includes('delt')) muscleGroup = 'Shoulders';
        if (n.includes('curl') || n.includes('tricep') || n.includes('extension') || n.includes('push down')) muscleGroup = 'Arms';
        if (n.includes('core') || n.includes('ab') || n.includes('crawl')) muscleGroup = 'Core';
        
        // Logical string evaluating mapped equipment natively
        if (n.includes('barbell') || n.includes('barbbell') || n.includes('ez bar') || n.includes('straight bar')) equipment = 'Barbell';
        else if (n.includes('db') || n.includes('dumbbell') || n.includes('dumbell')) equipment = 'Dumbbell';
        else if (n.includes('cable')) equipment = 'Cable';
        else if (n.includes('machine')) equipment = 'Machine';
        else if (n.includes('bodyweight') || n.includes('chin') || n.includes('pull') || n.includes('crawl') || n.includes('inverted')) equipment = 'Bodyweight';
        else if (n.includes('pull down') || n.includes('extension') || n.includes('press')) equipment = 'Machine'; 

        parsedData.push({ name, videoUrl, muscleGroup, equipment });
    }
}

// Enforce unique objects blocking re-seed failures
const uniqueData = [];
const seen = new Set();
for (let item of parsedData) {
    if (!seen.has(item.name)) {
        seen.add(item.name);
        uniqueData.push(item);
    }
}

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url);
        console.log(">>> Mongoose Authenticated: Initiating Global Library Seed Block...");
        
        let addedCount = 0;
        for (let item of uniqueData) {
            // Block duplication logic parsing db level directly
            const exists = await Exercise.findOne({ name: item.name });
            if (!exists) {
                await Exercise.create(item);
                addedCount++;
            }
        }
        console.log(`[ SYSTEM OFFLINE ]: Successfully ingested ${addedCount} distinct exercises securely bypassing duplicates.`);
        process.exit();
    } catch (e) {
        console.error("CRITICAL FAILURE:", e);
        process.exit(1);
    }
};

runSeeder();

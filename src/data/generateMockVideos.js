// Simple script to generate placeholder video files or ensure directory exists
import fs from 'fs';
import path from 'path';

const mockDir = './public/mock/videos';
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

// Write mock video placeholder files
const dummyContent = Buffer.from('MOCK_VIDEO_STREAM_DATA_PLACEHOLDER');
fs.writeFileSync(path.join(mockDir, 'motion-study.mp4'), dummyContent);
fs.writeFileSync(path.join(mockDir, 'after-effects-01.mp4'), dummyContent);
console.log('Mock video placeholders created.');

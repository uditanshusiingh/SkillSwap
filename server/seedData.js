const Gig = require('./models/Gig');

// Demo gigs so the marketplace is never empty for a first-time visitor.
const sampleGigs = [
  { creatorName: 'Aarav Sharma', title: 'YouTube Thumbnail Design', category: 'Graphic Design', rate: 800,
    description: 'Eye-catching, high-CTR thumbnails for your videos. You get 3 concept options, 2 free revisions and the source PSD, delivered within 48 hours.' },
  { creatorName: 'Meera Nair', title: 'Reels & Shorts Video Editing', category: 'Video Editing', rate: 1500,
    description: 'Fast-paced edits for Instagram Reels and YouTube Shorts with captions, transitions, music sync and colour grading. Up to 60 seconds of final video.' },
  { creatorName: 'Rohan Verma', title: 'Portfolio Website in React', category: 'Web Development', rate: 5000,
    description: 'A responsive, single-page portfolio site built with React and deployed on Vercel. Includes about, projects and contact sections.' },
  { creatorName: 'Ananya Iyer', title: 'SEO Blog Posts (1000 words)', category: 'Content Writing', rate: 1200,
    description: 'Well-researched, plagiarism-free blog posts written for your niche with keyword research, headings and meta description included.' },
  { creatorName: 'Kabir Singh', title: 'Instagram Content Calendar', category: 'Social Media', rate: 2000,
    description: 'A 30-day content plan with post ideas, captions, hashtags and best posting times to grow your creator account.' },
  { creatorName: 'Isha Kapoor', title: 'Mobile App UI Design in Figma', category: 'UI/UX Design', rate: 3500,
    description: 'Clean, modern app screens (up to 5) with a small design system and clickable prototype, delivered as a Figma file.' }
];

// Inserts the sample gigs only when there are no gigs yet (or when force=true).
async function seedIfEmpty({ force = false } = {}) {
  if (!force && (await Gig.countDocuments()) > 0) return 0;
  const created = await Gig.insertMany(sampleGigs);
  return created.length;
}

module.exports = { sampleGigs, seedIfEmpty };

const Gig = require('./models/Gig');

const sampleGigs = [
  { creatorName: 'Aarav Sharma', title: 'YouTube Thumbnail Design', category: 'Graphic Design', rate: 800, description: 'Eye-catching YouTube thumbnails with 3 concepts, 2 revisions and source file delivery within 48 hours.' },
  { creatorName: 'Meera Nair', title: 'Reels & Shorts Video Editing', category: 'Video Editing', rate: 1500, description: 'Professional short-form video editing with captions, transitions, music sync and colour grading for Reels and Shorts.' },
  { creatorName: 'Rohan Verma', title: 'Portfolio Website in React', category: 'Web Development', rate: 5000, description: 'Responsive React portfolio website with modern UI, projects section, contact form and Vercel deployment.' },
  { creatorName: 'Ananya Iyer', title: 'SEO Blog Writing', category: 'Content Writing', rate: 1200, description: 'SEO-friendly 1000-word articles with keyword research, structured headings, meta description and original content.' },
  { creatorName: 'Kabir Singh', title: 'Instagram Content Calendar', category: 'Social Media', rate: 2000, description: '30-day Instagram content strategy with post ideas, captions, hashtags and recommended posting schedule.' },
  { creatorName: 'Isha Kapoor', title: 'Mobile App UI Design in Figma', category: 'UI/UX Design', rate: 3500, description: 'Modern mobile app UI design with up to 5 screens, reusable components and clickable Figma prototype.' },
  { creatorName: 'Vivaan Malhotra', title: 'Google & Instagram Ads Setup', category: 'Digital Marketing', rate: 2500, description: 'Campaign setup for Google or Instagram Ads including audience targeting, ad structure, creative guidance and tracking basics.' },
  { creatorName: 'Sana Khan', title: 'Professional Product Photography', category: 'Photography', rate: 1800, description: 'Clean product photography for websites and social media with basic editing and background cleanup.' },
  { creatorName: 'Aditya Raj', title: '2D Logo Animation', category: 'Animation', rate: 2200, description: 'Short 2D logo animation for YouTube, websites and social media, delivered in high-quality MP4 format.' },
  { creatorName: 'Neha Joshi', title: 'Custom Background Music', category: 'Music & Audio', rate: 3000, description: 'Original background music for YouTube videos, podcasts, advertisements and short films with commercial-use delivery.' },
  { creatorName: 'Arjun Mehta', title: 'Business Logo & Brand Kit', category: 'Graphic Design', rate: 2500, description: 'Professional logo with colour palette, typography and basic brand guidelines for startups and small businesses.' },
  { creatorName: 'Priya Sethi', title: 'Podcast Video Editing', category: 'Video Editing', rate: 2800, description: 'Clean podcast editing with cuts, audio enhancement, captions, intro and outro for YouTube or social platforms.' },
  { creatorName: 'Dev Patel', title: 'Landing Page Development', category: 'Web Development', rate: 3500, description: 'Fast, responsive landing page using modern HTML, CSS and JavaScript with mobile-first design.' },
  { creatorName: 'Simran Kaur', title: 'LinkedIn Article Writing', category: 'Content Writing', rate: 1000, description: 'Professional LinkedIn articles designed to communicate expertise clearly and build a strong personal brand.' },
  { creatorName: 'Yash Thakur', title: 'Social Media Profile Setup', category: 'Social Media', rate: 1800, description: 'Complete profile optimisation for Instagram, LinkedIn or YouTube including bio, profile structure and content direction.' },
  { creatorName: 'Nidhi Agarwal', title: 'Website UX Audit', category: 'UI/UX Design', rate: 3000, description: 'Detailed UX review of your website with usability issues, screenshots and actionable improvement recommendations.' },
  { creatorName: 'Kunal Bansal', title: 'SEO Website Audit', category: 'Digital Marketing', rate: 2200, description: 'Technical and on-page SEO audit covering metadata, headings, performance, indexing and keyword opportunities.' },
  { creatorName: 'Riya Sharma', title: 'Portrait Photo Retouching', category: 'Photography', rate: 700, description: 'Natural professional retouching for portraits with skin cleanup, colour correction and light enhancement.' },
  { creatorName: 'Manav Gupta', title: 'Animated Instagram Story Pack', category: 'Animation', rate: 1800, description: 'Five engaging animated Instagram story templates suitable for promotions, announcements and creator content.' },
  { creatorName: 'Tanya Roy', title: 'Voiceover for Short Videos', category: 'Music & Audio', rate: 1200, description: 'Clear Hindi or English voiceover for reels, ads, explainers and short-form videos with clean audio delivery.' }
];

async function seedIfEmpty({ force = false } = {}) {
  if (!force && (await Gig.countDocuments()) > 0) return 0;
  const created = await Gig.insertMany(sampleGigs);
  return created.length;
}

async function seedMissing() {
  const existing = await Gig.find({}, 'creatorName title').lean();
  const have = new Set(existing.map((g) => `${g.creatorName}|${g.title}`));
  const toAdd = sampleGigs.filter((g) => !have.has(`${g.creatorName}|${g.title}`));
  if (toAdd.length) await Gig.insertMany(toAdd);
  return toAdd.length;
}

module.exports = { sampleGigs, seedIfEmpty, seedMissing };

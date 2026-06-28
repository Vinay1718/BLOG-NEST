const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blogdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error(err); process.exit(1); });

// Mirror same slugify as server.js
const slugify = (text) =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: String, bio: String, avatar: String
});
const PostSchema = new mongoose.Schema({
  title: String, slug: String, content: String, excerpt: String,
  image: String, category: String, tags: [String],
  author: mongoose.Schema.Types.ObjectId, likes: [], views: Number,
  published: Boolean, createdAt: Date
});
const CommentSchema = new mongoose.Schema({
  post: mongoose.Schema.Types.ObjectId,
  author: mongoose.Schema.Types.ObjectId,
  content: String, createdAt: Date
});
const NewsletterSchema = new mongoose.Schema({ email: String });

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

async function seed() {
  // Clear ALL collections cleanly
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    Newsletter.deleteMany({})
  ]);
  console.log('🗑  Cleared all collections');

  const adminPass = await bcrypt.hash('admin123', 12);
  const userPass  = await bcrypt.hash('user123', 12);

  const admin = await User.create({
    name: 'Admin User', email: 'admin@blog.com', password: adminPass,
    role: 'admin', bio: 'Platform administrator and chief editor.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  });
  const jane = await User.create({
    name: 'Jane Doe', email: 'jane@blog.com', password: userPass,
    role: 'user', bio: 'Tech writer & coffee enthusiast.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
  });

  const posts = [
    {
      title: 'How AI Will Change the Future',
      category: 'Technology', tags: ['AI', 'Future', 'Tech'],
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
      author: admin._id,
      content: `Artificial Intelligence is no longer science fiction — it is reshaping every industry. From healthcare diagnostics to autonomous vehicles, AI systems are performing tasks that were once thought to require human intelligence.

In healthcare, AI can now detect cancers in radiology scans with accuracy that rivals experienced physicians. In finance, algorithmic trading systems process millions of data points per second. In creative fields, generative AI is producing art, music, and writing that challenges our very definition of creativity.

The economic impact will be profound. McKinsey estimates AI could contribute up to $13 trillion to the global economy by 2030. Yet alongside opportunity comes disruption — many routine jobs will be automated, requiring societies to rethink education, social safety nets, and the very meaning of work.

The key challenge ahead is ensuring AI development remains aligned with human values. As these systems become more capable, establishing ethical guidelines, transparency standards, and governance frameworks becomes not just important — but essential for our collective future.`
    },
    {
      title: 'The Rise of Remote Work',
      category: 'Lifestyle', tags: ['Remote Work', 'Productivity', 'Career'],
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
      author: jane._id,
      content: `The COVID-19 pandemic forced an unprecedented global experiment in remote work. What began as a crisis response has transformed into a fundamental shift in how we think about work, productivity, and office culture.

Companies that once insisted on in-person presence have discovered that many roles can be performed effectively from home. Employees, freed from long commutes and rigid schedules, have often reported higher satisfaction and, in many cases, increased productivity.

However, remote work is not without its challenges. Collaboration can suffer when teams are distributed. Younger employees miss out on informal mentorship. The boundary between work and personal life blurs dangerously.

The emerging consensus is a hybrid model: structured office time for collaboration and culture-building, combined with remote flexibility for focused individual work. Organizations that get this balance right will have a significant competitive advantage in attracting and retaining talent.`
    },
    {
      title: 'Mindfulness in the Digital Age',
      category: 'Wellness', tags: ['Mindfulness', 'Mental Health', 'Wellness'],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      author: admin._id,
      content: `We live in an age of unprecedented connectivity and, paradoxically, unprecedented distraction. The average person checks their phone 96 times a day. Notifications fragment our attention into increasingly smaller pieces. Anxiety and burnout are at epidemic levels.

Mindfulness — the practice of paying deliberate attention to the present moment without judgment — offers a powerful antidote. Rooted in ancient meditation traditions but validated extensively by modern neuroscience, mindfulness reduces stress, improves focus, and enhances overall well-being.

Practicing mindfulness does not require hours of meditation. It can begin with five minutes of focused breathing each morning. It means putting your phone away during meals. It means taking a genuine lunch break instead of eating while scrolling.

The irony is that many tech companies now build mindfulness apps — yet the most powerful practice is simply putting your device down and being fully present in the moment in front of you.`
    },
    {
      title: '5 Tips for a Healthy Morning Routine',
      category: 'Health', tags: ['Health', 'Morning', 'Productivity'],
      image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800',
      author: jane._id,
      content: `How you begin your morning often determines how your entire day unfolds. A rushed, chaotic start tends to create a rushed, chaotic day. A calm, intentional morning creates a foundation for focus and achievement.

1. Hydrate first. Your body loses significant water overnight. Before coffee, before your phone — drink a large glass of water. This simple act jumpstarts your metabolism and cognitive function.

2. Move your body. Even 10 minutes of light exercise — stretching, yoga, or a short walk — releases endorphins and increases blood flow to the brain, dramatically improving mood and alertness.

3. Avoid your phone for the first 30 minutes. Starting your day by consuming news and social media immediately puts you in a reactive mindset. Use this time for yourself instead.

4. Eat a protein-rich breakfast. Protein stabilizes blood sugar and provides sustained energy. Skip the sugary cereals and reach for eggs, Greek yogurt, or nuts.

5. Set three priorities for the day. Not twenty tasks — just three. This clarity prevents the overwhelm that derails so many well-intentioned mornings.`
    },
    {
      title: 'The Power of Networking in a Digital World',
      category: 'Career', tags: ['Networking', 'Career', 'LinkedIn'],
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
      author: admin._id,
      content: `Your network is your net worth — this adage has never been more true, yet the nature of networking has fundamentally changed. The handshake at a conference has been supplemented by the LinkedIn connection, the Twitter reply, and the Discord community.

Digital networking offers incredible reach. You can connect with industry leaders, potential collaborators, and mentors anywhere in the world without leaving your desk. Online communities centered around specific interests or industries have become powerful incubators for professional opportunities.

But quality still trumps quantity. A network of 5,000 connections who barely know your name is far less valuable than 50 genuine relationships with people who respect your work and would advocate for you.

The most effective networkers focus on giving before taking. Share useful content. Offer help before asking for it. Celebrate others genuinely. These small investments in relationships compound into a network that opens doors when you need it most.`
    },
    {
      title: 'Journaling for Mental Clarity',
      category: 'Wellness', tags: ['Journaling', 'Mental Health', 'Self-improvement'],
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
      author: jane._id,
      content: `In a world that demands constant output, journaling is a rare act of input — a chance to process, reflect, and understand ourselves more deeply. What begins as a simple habit of writing a few sentences each day can evolve into one of the most powerful tools for mental clarity and personal growth.

Writing externalizes our thoughts. Problems that seem overwhelming inside our heads often shrink to manageable size when written on a page. We can examine them objectively, identify patterns, and begin to solve them.

Journaling also serves as an emotional pressure valve. Expressing difficult feelings through writing reduces their intensity and helps process them constructively — something researchers have linked to improved immune function and reduced symptoms of anxiety and depression.

There is no right way to journal. Some prefer structured prompts: What am I grateful for? What challenged me today? What do I want tomorrow to look like? Others prefer a free-flowing stream of consciousness. The best method is simply the one you will actually do consistently.`
    }
  ];

  for (const p of posts) {
    const slug = slugify(p.title);
    await Post.create({
      ...p, slug,
      excerpt: p.content.substring(0, 200) + '...',
      views: Math.floor(Math.random() * 500),
      published: true,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('  Admin account: admin@blog.com / admin123');
  console.log('  User account:  jane@blog.com  / user123');
  console.log('');
  console.log('  Posts created: ' + posts.length);
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });

// Default helpful channels for new users
export const DEFAULT_CHANNELS = [
  {
    id: 'default-1',
    name: 'welcome-home',
    description: 'Welcome to CPUT StudentHub! Start here for general information and community guidelines.',
    category: 'Information',
    isDefault: true,
    defaultContent: [
      {
        type: 'system',
        content: `🏠 **Welcome to CPUT StudentHub!** 

This is your home base for connecting with fellow students, collaborating on projects, and sharing knowledge.

**📋 Getting Started:**
• Check out #how-to-navigate for platform basics
• Visit #channel-settings for customization help
• Read #about-studenthub to understand our community

**🎯 Community Guidelines:**
• Be respectful and inclusive
• Keep discussions relevant to channels
• Help fellow students succeed
• Report any issues to moderators

Let's build an amazing academic community together! 🚀`
      }
    ]
  },
  {
    id: 'default-2', 
    name: 'how-to-navigate',
    description: 'Learn how to use CPUT StudentHub effectively - tips, tricks, and navigation help.',
    category: 'Information',
    isDefault: true,
    defaultContent: [
      {
        type: 'system',
        content: `🧭 **How to Navigate CPUT StudentHub**

**📢 Channels & Categories:**
• Channels are organized by topics (General, Study Groups, Projects, etc.)
• Click channel names to join conversations
• Use the three dots (⋯) menu for channel options

**🔍 Search Features:**
• Search bar at the top finds channels, users, and messages
• Use @username to mention someone
• Use #channel-name to reference other channels

**💬 Messaging:**
• Type messages in the input box at bottom
• Press Enter to send, Shift+Enter for new lines
• Edit messages by clicking the edit button
• React with emojis by hovering over messages

**👥 User Features:**
• See online users in the sidebar
• Click user profiles for more info
• Set your status and availability

**⚙️ Channel Management:**
• Create new channels with the + button
• Join public channels by clicking them
• Leave channels via the three dots menu

Need help? Just ask in any channel - our community is here to help! 🤝`
      }
    ]
  },
  {
    id: 'default-3',
    name: 'channel-settings',
    description: 'Learn about channel settings, permissions, and customization options.',
    category: 'Information', 
    isDefault: true,
    defaultContent: [
      {
        type: 'system',
        content: `⚙️ **Channel Settings & Customization**

**🏗️ Creating Channels:**
• Click the + button next to "Channels"
• Choose a descriptive name (no spaces, use hyphens)
• Set appropriate permissions (Public/Private)
• Add a clear description

**🔧 Channel Options (Three Dots Menu):**
• **Edit Channel** - Update name, description, settings
• **Invite Users** - Share channel with specific people
• **Channel Info** - View description and member list
• **Notification Settings** - Manage alerts
• **Leave Channel** - Remove yourself from the channel

**📋 Best Practices:**
• Use clear, descriptive channel names
• Set appropriate channel topics
• Keep channels focused on specific subjects
• Archive inactive channels to reduce clutter

**🔒 Privacy Options:**
• **Public Channels** - Anyone can join and see messages
• **Private Channels** - Invite-only access
• **Study Groups** - Great for course-specific discussions

**👨‍💼 Admin Features:**
• Channel creators have management rights
• Admins can modify settings and membership
• Moderators help maintain channel quality

Questions about channel settings? Ask here! 📝`
      }
    ]
  },
  {
    id: 'default-4',
    name: 'about-studenthub',
    description: 'Learn about CPUT StudentHub - our mission, features, and academic focus.',
    category: 'Information',
    isDefault: true,
    defaultContent: [
      {
        type: 'system',
        content: `ℹ️ **About CPUT StudentHub**

**🎓 Our Mission:**
CPUT StudentHub is designed to connect Cape Peninsula University of Technology students, fostering collaboration, knowledge sharing, and academic success.

**✨ Key Features:**
• **Real-time Communication** - Instant messaging and notifications
• **Study Groups** - Course-specific channels for collaboration
• **Project Collaboration** - Team up on assignments and projects
• **Resource Sharing** - Share notes, links, and study materials
• **Peer Support** - Get help from fellow students
• **Academic Networking** - Connect across different programs

**🏫 Academic Focus:**
• Organized by faculties and departments
• Course-specific discussion channels
• Study group formation and management
• Assignment collaboration spaces
• Exam preparation support

**🔐 Privacy & Security:**
• Student verification required
• Secure messaging platform
• Academic integrity respected
• Data privacy protected

**👥 Community Values:**
• Mutual respect and support
• Academic integrity and honesty
• Inclusive and welcoming environment
• Collaborative learning mindset

**🚀 Built for Students, by Students:**
This platform is developed with direct input from CPUT students to meet your academic and social needs.

Ready to start your StudentHub journey? Jump into any channel and introduce yourself! 🎉`
      }
    ]
  }
];

export const getDefaultChannelContent = (channelName: string) => {
  const channel = DEFAULT_CHANNELS.find(ch => ch.name === channelName);
  return channel?.defaultContent || [];
};

export const isDefaultChannel = (channelId: string | number) => {
  return DEFAULT_CHANNELS.some(ch => ch.id === channelId || ch.id === String(channelId));
};

# CommentFlow – YouTube & Instagram Comments Downloader

A modern, **100% FREE** application that allows users to extract and download YouTube and Instagram comments in CSV or Excel format.

## 🎉 100% Free Forever

- ✅ **Unlimited Downloads** - No daily limits or restrictions
- ✅ **Multi-Platform Support** - YouTube & Instagram
- ✅ **All Features** - CSV & Excel export, search, filter, sort
- ✅ **No Credit Card** - Just sign up and start using
- ✅ **Open Source** - Free to use and modify

## 🚀 Features

### Platform Support
- **YouTube**: Videos, Shorts, Live streams
- **Instagram**: Posts, Reels, IGTV

### Core Features
- **Fast Comment Extraction**: Extract thousands of comments in seconds
- **Multiple Export Formats**: Download as CSV or Excel (XLSX)
- **Advanced Filtering**: Search and filter comments by keywords, likes, or date
- **User Dashboard**: Track your download statistics
- **Admin Panel**: Manage users and view statistics
- **Mobile Responsive**: Works perfectly on all devices
- **Dark Mode Support**: Automatic theme detection

## 📋 Prerequisites

- Node.js 18+ or Bun

## 🔧 Quick Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Initialize Database

```bash
bun run db:push
bun run db:seed  # Creates admin user
```

### 3. Start Development Server

```bash
bun run dev
```

That's it! The app works in **Demo Mode** without any API keys, showing sample comments.

## 🔑 Optional: Add API Keys for Real Data

### YouTube API (for real YouTube comments)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create API credentials (API Key)
5. Add to your `.env` file:

```env
YOUTUBE_API_KEY="your-api-key-here"
```

### Instagram API (for real Instagram comments)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Graph API
4. Generate access token
5. Add to your `.env` file:

```env
INSTAGRAM_ACCESS_TOKEN="your-access-token-here"
```

## 👤 Admin Access

After running the seed script:

- **Email**: `admin@commentflow.com`
- **Password**: `admin123`

⚠️ Change the admin password in production!

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Admin user seeder
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main application
│   ├── components/        # React components
│   ├── lib/               # Utility functions
│   └── store/             # Zustand stores
└── .env                   # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### YouTube
- `POST /api/youtube/fetch` - Fetch comments from YouTube video
- `POST /api/youtube/download` - Download comments as CSV/Excel

### Instagram
- `POST /api/instagram/fetch` - Fetch comments from Instagram post
- `POST /api/instagram/download` - Download comments as CSV/Excel

### User
- `GET /api/user/stats` - Get user statistics

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `PATCH /api/admin/users/[id]` - Update user role

## 💳 Pricing

**FREE FOREVER** - No premium plans, no hidden fees!

- ✅ Unlimited downloads
- ✅ YouTube & Instagram support
- ✅ CSV & Excel export
- ✅ Search and filter
- ✅ All future features

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand
- **Database**: SQLite (PostgreSQL in production)
- **ORM**: Prisma
- **Authentication**: JWT

## 🎯 Use Cases

### For Content Creators
- Analyze audience engagement
- Find popular comments for highlighting
- Understand what resonates with viewers

### For Marketers
- Track brand sentiment
- Monitor competitor engagement
- Analyze customer feedback in bulk

### For Researchers
- Collect data for academic studies
- Perform sentiment analysis
- Study online community behavior

## 📝 License

MIT License - completely free to use and modify!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
Deployment update

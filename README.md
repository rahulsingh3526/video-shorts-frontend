# VideoShorts Frontend

A Next.js application for converting videos to shorts format and generating videos from text using AI-powered processing.

## Features

- **User Authentication**: Privy integration supporting both email and crypto wallet login
- **Video to Shorts**: Upload videos and convert them to engaging short format
- **Text to Video**: Generate videos from text content with AI processing
- **Processing History**: Track all your processed videos
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Get this from https://dashboard.privy.io after creating your app
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Your backend API URL (will be configured later)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Get Privy App ID

1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Create a new app
3. Copy your App ID
4. Paste it in `.env.local`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Privy provider
│   ├── page.tsx             # Main page with auth flow
│   └── globals.css          # Global styles
├── components/
│   ├── Dashboard.tsx        # Main dashboard with tabs
│   ├── Layout.tsx           # Authenticated layout
│   ├── LoginPage.tsx        # Authentication page
│   ├── VideoUpload.tsx      # Video to shorts component
│   └── TextToVideo.tsx      # Text to video component
└── lib/
    └── privy.ts            # Privy configuration
```

## Authentication Flow

1. **Unauthenticated**: Shows LoginPage with email and wallet options
2. **Loading**: Shows loading spinner while Privy initializes
3. **Authenticated**: Shows Dashboard with Layout

## Components

### LoginPage
- Beautiful landing page with feature highlights
- Email and wallet authentication options
- Responsive design

### Dashboard
- Tab-based interface for different features
- Video upload and text input forms
- Processing status and history

### VideoUpload
- File upload with drag & drop
- Progress indicators
- Download links for processed videos

### TextToVideo
- Rich text input with guidelines
- Word count and validation
- AI-powered video generation

## Backend Integration

The frontend communicates with your Python backend through API calls:

- `POST /api/process-video` - Video to shorts conversion
- `POST /api/process-text` - Text to video generation

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_API_URL=https://video-shorts-backend.onrender.com
```

## Next Steps

1. Set up Privy App ID in environment variables
2. Create backend API server to handle video processing
3. Connect to your Python scripts
4. Add payment integration with NOWPayments
5. Deploy both frontend and backend

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Privy (Web3 + Email)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

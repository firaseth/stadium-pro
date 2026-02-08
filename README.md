<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# StadiumPRO AI - Smart Stadium Management

An intelligent AI-powered stadium management system built with React, TypeScript, and Google's Gemini AI.

View your app in AI Studio: https://ai.studio/apps/drive/1NIWeEGuIrPXZErxJSrg6lW3c3tB3xNFf

## 🚀 Features

- Real-time stadium analytics and insights
- AI-powered recommendations using Google Gemini
- Interactive data visualizations with Recharts
- Modern, responsive UI with Tailwind CSS
- TypeScript for type safety

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## 🏃 Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/firaseth/stadium-pro.git
   cd stadium-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Import to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository `firaseth/stadium-pro`

3. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY` with your API key
   - Apply to: Production, Preview, and Development

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Enter your API key when prompted.

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## 🔧 Build for Production

To create a production build locally:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 📦 Project Structure

```
stadium-pro/
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── index.html           # HTML template
├── constants.tsx        # Application constants
├── geminiService.ts     # Gemini AI integration
├── types.ts             # TypeScript type definitions
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel deployment configuration
└── README.md            # This file
```

## 🛠️ Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI capabilities
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 🐛 Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### API Key Issues
- Verify your API key is correct
- Check that environment variables are properly set in Vercel dashboard
- Ensure `.env.local` is not committed to Git (it's in `.gitignore`)

### Deployment Issues
- Check Vercel build logs for errors
- Verify all environment variables are set in Vercel
- Ensure `vercel.json` configuration is correct

## 📄 License

This project is private and proprietary.

## 👤 Author

**Firas**
- GitHub: [@firaseth](https://github.com/firaseth)

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent features
- Vercel for hosting and deployment platform

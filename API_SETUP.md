# 🔑 API Setup Guide

## Gemini API Key Setup

To fix the "Gemini API key is not set" error, follow these steps:

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Create Environment File (Recommended)

1. Create a `.env.local` file in your project root
2. Add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file and restart your development server

### 3. Test the Configuration

1. Save the file
2. Refresh your browser
3. Try running a URL analysis
4. The error should be resolved

## 🔒 Security Notes

- **Never commit API keys to version control**
- Add `.env.local` to your `.gitignore` file
- Use environment variables in production
- Rotate API keys regularly

## 🚀 Quick Start

1. Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open `index.html`
3. Replace `API_KEY: ""` with `API_KEY: "your_key_here"`
4. Save and refresh browser
5. Test with any URL!

## 🆘 Troubleshooting

**Still getting errors?**
- Check if the API key is valid
- Ensure no extra spaces in the key
- Try regenerating the API key
- Check browser console for other errors

**Need help?**
- Check the browser console (F12) for detailed error messages
- Verify the API key format (should start with "AIza")
- Make sure you have sufficient API quota

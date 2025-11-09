# 🚀 Deploy to Replit (Easiest Method!)

Replit is the **simplest way** to deploy this video editor. Everything works out of the box!

## Why Replit?

✅ FFmpeg pre-installed
✅ Persistent file storage
✅ One-click deployment
✅ Free tier available
✅ Built-in environment manager
✅ Auto-installs npm packages
✅ No complex configuration needed

## Quick Deploy (3 Steps)

### Step 1: Import to Replit

1. Go to **https://replit.com**
2. Sign up/login (use GitHub for easy access)
3. Click **"+ Create Repl"**
4. Choose **"Import from GitHub"**
5. Paste your repo URL: `https://github.com/larryob78/opn-ai-editor`
6. Select branch: `claude/editor-ai-tools-011CUxCPTxHkYRWRcAL2XfxE`
7. Click **"Import from GitHub"**

### Step 2: Add Environment Variables

1. In Replit, click the **"Secrets"** tool (🔒 icon in left sidebar)
2. Add these secrets:

   **Key:** `OPENAI_API_KEY`
   **Value:** `your-openai-api-key-here`

   (Get your key from: https://platform.openai.com/api-keys)

3. Optionally add:
   - `MAX_FILE_SIZE`: `500000000`
   - `NODE_ENV`: `production`

### Step 3: Run & Deploy

1. Click the **"Run"** button at the top
2. Replit will automatically:
   - Install dependencies (`npm install`)
   - Start the server (`npm start`)
   - Open the app in a preview window

3. **To make it publicly accessible:**
   - Click the **"Deploy"** button
   - Choose **"Autoscale"** (free tier available)
   - Your app will get a permanent URL like: `https://your-app.repl.co`

## That's It! 🎉

Your video editor is now live and accessible to anyone!

## Testing Your Deployment

1. Open your Replit URL
2. Upload a video (drag & drop or click)
3. Try AI editing: "Make it grayscale"
4. Apply filters
5. Export in different formats

## Replit Tips

- **Always-On**: Upgrade to keep your app running 24/7 (optional)
- **Custom Domain**: Add your own domain in deployment settings
- **Monitoring**: Check logs in the Console tab
- **Storage**: Files persist in the `uploads/` directory
- **Database**: SQLite database persists automatically

## Troubleshooting

**If the app doesn't start:**
1. Check that `OPENAI_API_KEY` is set in Secrets
2. Look at Console for error messages
3. Make sure port 3000 is exposed (already configured)

**If uploads fail:**
- Replit free tier has storage limits (~500MB)
- Consider upgrading or cleaning old files

**If video processing is slow:**
- Normal! Video processing is CPU-intensive
- Replit may throttle on free tier
- Consider upgrading for better performance

## Cost

- **Free Tier**: Limited to 0.5 GB storage, may sleep after inactivity
- **Hacker Plan** ($7/mo): 5 GB storage, always-on, faster performance
- **Pro Plan** ($20/mo): 50 GB storage, priority support

For most users, the **free tier is perfect** for testing and light use!

## Alternative: Deploy from Replit's Template

Once you have it working, you can also:
1. Make your Repl public
2. Others can fork it
3. Create a Replit template for easy deployment

---

**Enjoy your AI-powered video editor on Replit! 🎬✨**

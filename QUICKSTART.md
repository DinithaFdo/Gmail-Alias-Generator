# 🚀 Quick Start Guide

Welcome to Gmail Alias Generator! This guide will get you running in 2 minutes.

## Prerequisites

- Node.js 20+ ([Download](https://nodejs.org))
- npm 10+ (comes with Node.js)
- Git (optional, for cloning)

## ⚡ Start Developing (30 seconds)

```bash
# Navigate to project
cd gmail-alias-generator

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Result:** Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

## 🎨 How to Use

1. **Enter Email** → Paste your `name@gmail.com`
2. **Adjust Slider** → Control number of dot variations
3. **Pick Preset** → Choose category or custom tag
4. **Copy or Export** → Get your aliases instantly

That's it! All aliases deliver to your main inbox.

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

## 🚀 Deploy to Vercel (1 minute)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, done!
```

Or push to GitHub and connect in [Vercel Dashboard](https://vercel.com/dashboard).

## 📁 Key Files to Know

| File                     | Purpose                          |
| ------------------------ | -------------------------------- |
| `app/page.tsx`           | Main application (all UI)        |
| `lib/alias-generator.ts` | Core logic (dot/plus generation) |
| `components/`            | Reusable UI components           |
| `app/globals.css`        | Theme & animations               |

## 🎯 Common Tasks

### Change Colors

Edit `app/globals.css` - look for `--primary` and `--accent` in `:root`

### Add New Preset

Edit `PRESETS` in `lib/alias-generator.ts`

### Modify Layout

Edit `app/page.tsx` - it's all in one component for simplicity

### Change Animations

Edit Framer Motion props in components, or `app/globals.css` for keyframes

## 🔧 Available Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check code quality
npm run type-check # Verify TypeScript
```

## 🐛 Troubleshooting

**Port 3000 already in use?**

```bash
npm run dev -- --port 3001
```

**Clean install needed?**

```bash
rm -rf node_modules .next
npm install
npm run dev
```

**Build errors?**

```bash
npm run build # Check exact error
npm run type-check # Find TypeScript issues
```

## 📚 Documentation

- [README.md](README.md) - Full feature list
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - What was built

## 🎓 Next Steps

1. ✅ Get it running locally (`npm run dev`)
2. ✅ Try the features (enter email, copy aliases)
3. ✅ Customize as needed (colors, presets, etc.)
4. ✅ Deploy (`vercel` or your platform)
5. ✅ Share with others!

## 💬 Need Help?

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Components:** https://ui.shadcn.com

---

**You're all set! Happy generating aliases! 🎉**

For more details, see [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md).

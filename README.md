# Gmail Alias Generator

A modern, premium web application to instantly generate Gmail aliases for organizing, filtering, and tracking your inbox.

**Features:** ✨ Instant Generation • 🎯 Smart Controls • 🎨 Premium Design • 📊 Export Features

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🎯 Key Features

✨ **Instant Alias Generation**

- Generate dot permutations (e.g., `j.ohn`, `jo.hn`, `john`)
- Create plus tag variations (e.g., `john+shopping`, `john+work`)
- Support for preset categories (Shopping, Newsletter, Testing, Work, Social, Finance)
- Smart sampling to prevent combinatorial explosion

🎨 **Premium Design**

- Google Wallet-inspired UI with rounded containers
- Dark mode with system preference detection
- Modern gradient effects and smooth Framer Motion animations
- Fully responsive (mobile-first)
- Large, easy-to-read fonts

📊 **Advanced Features**

- Export aliases as TXT or CSV
- Real-time email validation
- Gmail and Google Workspace support
- Educational content about alias usage
- Security warnings for sensitive accounts
- localStorage support for preferences

⚡ **Performance**

- Client-side only (no server calls)
- Instant feedback and validation
- Optimized rendering with React hooks
- Zero external logic dependencies

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📁 Project Structure

```
app/
├── page.tsx           # Main application component
├── layout.tsx         # Root layout with metadata
└── globals.css        # Global styles and theme

components/
├── ui/                # shadcn/ui base components
├── alias-card.tsx     # Individual alias display
├── preset-selector.tsx # Category selector
├── theme-toggle.tsx   # Dark mode toggle
├── export-button.tsx  # Export functionality
└── toast.tsx          # Toast notifications

lib/
├── alias-generator.ts # Core alias generation logic
├── export.ts          # Export utilities (TXT, CSV)
├── storage.ts         # LocalStorage helpers
└── utils.ts           # Utility functions
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly in [Vercel Dashboard](https://vercel.com/dashboard).

### Other Platforms

**Netlify:**

```bash
netlify deploy --prod --dir=.next
```

**Docker:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Security & Privacy

- ✅ **No server calls** - All processing in your browser
- ✅ **No data collection** - No tracking or analytics
- ✅ **localStorage only** - For preferences only (can be cleared)
- ⚠️ **Not for sensitive accounts** - Don't use for banking or security-critical services

## 📖 How It Works

### Dot Variations

Gmail treats dots as invisible in email addresses:

- `john@gmail.com` = `j.ohn@gmail.com` = `jo.hn@gmail.com`

For `john.doe@gmail.com`, there are 2^5 = 32 possible combinations. Smart sampling prevents overwhelming results.

### Plus Tags

Gmail ignores everything after the plus (+) sign:

- `john+shopping@gmail.com` → delivers to `john@gmail.com`
- `john+work@gmail.com` → delivers to `john@gmail.com`

## 💡 Usage Tips

1. **Enter your Gmail address** - Real-time validation
2. **Adjust dot count** - Use slider to control variations
3. **Choose category or custom tag** - Select preset or enter custom
4. **Copy aliases** - Single click or copy all at once
5. **Export** - Download as TXT or CSV
6. **Organize in Gmail** - Create filters and labels by alias

## 🎨 Design Inspiration

- [Google Wallet](https://wallet.google.com)
- [Stripe](https://stripe.com)
- [Linear](https://linear.app)
- [Vercel](https://vercel.com)
- [Raycast](https://raycast.com)

## 📚 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev) - Icons
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Next.js](https://nextjs.org) - Framework

## 📋 Roadmap

- [ ] Alias favorites/history
- [ ] Gmail API integration
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Team support
- [ ] Analytics dashboard

## 🐛 Troubleshooting

**Aliases not working?**

- Verify you're using a real Gmail account
- Check Gmail settings for alias support

**Dark mode not persisting?**

- Enable localStorage in browser settings
- Clear cache and reload

**Need help?**

- Check Gmail Help: https://support.google.com/mail/answer/9211434

## 📄 License

MIT License - Use freely for personal or commercial projects.

---

Built with ❤️ for email organization. Fast, modern, premium. Like Google Wallet for your inbox.

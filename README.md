# 🎬 Vocara

> Learn languages while watching movies — dual subtitles, instant translations, shadowing, dictation, and AI-powered learning.

Vocara is a Chrome extension that turns your favourite streaming services into an immersive language classroom. It's a **Language Reactor** competitor with enhanced features designed for serious language learners.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📺 **Dual Subtitles** | Show both the original language and your native language at the same time |
| 🔤 **Click-to-Translate** | Click any word for an instant translation popup |
| 🔢 **Multi-Phrase Selection** | Highlight multiple words to translate whole phrases |
| 🎤 **Shadowing Mode** | Record yourself repeating lines and get a pronunciation score |
| 📝 **Dictation Mode** | Type what you hear to practise listening comprehension |
| 🤖 **AI Tutor** | Chat with an AI language tutor about anything you've seen |
| 🃏 **Spaced Repetition** | SM-2 flashcard review system built right into the extension |
| 📦 **Anki Export** | Export your vocabulary deck to Anki with one click |
| 📊 **Progress Tracking** | Watch time, words learned, and streak tracking |

### Supported Platforms
- YouTube
- Netflix
- Disney+
- Amazon Prime Video

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Extension | React 18, TypeScript, Vite, CRXJS, Manifest V3 |
| Styling | Tailwind CSS (scoped to Shadow DOM) |
| State | Zustand |
| Backend | Vercel Serverless Functions (TypeScript) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Translation | DeepL API |
| AI Tutor | OpenAI GPT-4o-mini |
| Monorepo | pnpm workspaces |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 8 (`npm install -g pnpm`)

### 1. Clone & install

```bash
git clone https://github.com/OtgonbaatarGanbold3/Vocara.git
cd Vocara
pnpm install
```

### 2. Configure environment variables

```bash
cp packages/extension/.env.example packages/extension/.env
# Fill in your Supabase and DeepL credentials
```

### 3. Build / dev

```bash
# Start extension dev server with hot-reload
pnpm dev

# Build extension for production
pnpm build
```

### 4. Load extension in Chrome

1. Navigate to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select `packages/extension/dist`

---

## 📁 Project Structure

```
Vocara/
├── packages/
│   ├── extension/                 # Chrome Extension
│   │   ├── manifest.json          # Manifest V3
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── background/        # Service worker
│   │       ├── content/           # Content scripts + React overlay
│   │       ├── popup/             # Browser action popup
│   │       ├── sidepanel/         # Chrome side panel
│   │       ├── options/           # Settings page
│   │       ├── hooks/             # Custom React hooks
│   │       ├── stores/            # Zustand state stores
│   │       ├── utils/             # Subtitle parsers, SRS, etc.
│   │       └── lib/               # Supabase + API clients
│   └── api/                       # Vercel Serverless Functions
│       ├── api/
│       │   ├── translate.ts       # POST /api/translate
│       │   ├── ai-tutor.ts        # POST /api/ai-tutor
│       │   ├── vocabulary.ts      # CRUD /api/vocabulary
│       │   ├── progress.ts        # GET/POST /api/progress
│       │   └── auth/callback.ts   # OAuth callback
│       └── lib/supabase.ts
├── supabase/
│   ├── config.toml
│   └── migrations/
│       └── 001_initial_schema.sql
├── .github/workflows/
│   ├── ci.yml                     # CI on push/PR
│   └── release.yml                # Release on tag push
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## 🗄 Database Schema

### `profiles`
User account information, language preferences, subscription tier, XP, and streak data.

### `vocabulary`
Saved words and phrases with translations, context sentences, SM-2 SRS fields (`ease_factor`, `next_review_at`, `review_count`), and source metadata.

### `watch_sessions`
Records of each viewing session — platform, content title, duration, and words looked up / saved.

### `scene_cards`
Vocabulary items linked to a specific scene with screenshot and audio clip URLs for immersive flashcard review.

All tables have **Row Level Security (RLS)** enabled so users can only access their own data.

---

## 🌐 Deployment

### Extension
1. Run `pnpm build` — output is in `packages/extension/dist`
2. Zip the `dist` folder and upload to the Chrome Web Store developer dashboard

### API (Vercel)
1. Import the repository into Vercel
2. Set root directory to `packages/api`
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEEPL_API_KEY`
   - `OPENAI_API_KEY`

### Supabase
1. Create a new Supabase project
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor

---

## 🗺 Roadmap

### Phase 1 — MVP (Current)
- [x] Project scaffold and monorepo setup
- [ ] Subtitle overlay for YouTube and Netflix
- [ ] Click-to-translate with DeepL
- [ ] Vocabulary saving to local storage

### Phase 2 — Core Learning
- [ ] Spaced repetition review (SM-2)
- [ ] Shadowing mode with speech recognition
- [ ] Dictation mode
- [ ] Cloud sync via Supabase

### Phase 3 — AI & Social
- [ ] AI Tutor chat (GPT-4o-mini)
- [ ] Anki export
- [ ] Leaderboards and community features

### Phase 4 — Growth
- [ ] Disney+ and Amazon Prime support
- [ ] iOS / Android companion app
- [ ] Pronunciation analysis with detailed phoneme feedback

---

## 💰 Cost Breakdown (per 1,000 active users/month)

| Service | Cost |
|---|---|
| Vercel (Hobby) | Free |
| Supabase (Free tier) | Free |
| DeepL API (~50k chars/user) | ~$25 |
| OpenAI API (light usage) | ~$10 |
| **Total** | **~$35/month** |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please follow the existing code style (ESLint + Prettier configs are included).

---

## 📄 License

MIT © Vocara Contributors

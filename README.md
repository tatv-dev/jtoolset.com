📂 Project Architecture
src/
├── app/                      # Entry point (not used in Vite, for structure reference)
├── components/               # Shared components
│   ├── layout/               # Layout components
│   │   ├── Sidebar.jsx       # Sidebar component
│   │   ├── Header.jsx        # Header component
│   │   ├── Footer.jsx        # Footer component
│   │   ├── RootLayout.jsx    # Root layout wrapper
│   │   └── ThemeToggle.jsx   # Dark/light mode toggle button
│   ├── ui/                   # UI components
│   │   ├── Button.jsx        # Button
│   │   ├── Card.jsx          # Card
│   │   ├── HeaderSearchBar.jsx # Header search bar
│   │   ├── SidebarSearchBar.jsx # Sidebar search bar
│   │   ├── LanguageSelector.jsx # Language selector 
│   │   └── Script.jsx        # Script loader
│   └── tools/                # Tool-specific components
│       ├── unix-time/        # Unix Time tool
│       │   ├── UnixTimeConverter.jsx
│       │   └── TimeDisplay.jsx
│       ├── random/           # Random tool
│       │   ├── RandomGenerator.jsx
│       │   └── RandomOptions.jsx
│       ├── jwt-decoder/      # JWT Decoder tool
│       │   ├── JwtDecoder.jsx
│       │   └── JwtDisplay.jsx
│       └── cookie-tools/     # Cookie Import/Export tool
│           ├── CookieImporter.jsx
│           └── CookieExporter.jsx
├── context/                  # Context API
│   ├── ThemeContext.jsx      # Dark mode context
│   ├── SearchContext.jsx     # Search context
│   └── LanguageContext.jsx   # Multi-language context
├── hooks/                    # Custom hooks
│   ├── useLocalStorage.js    # Hook for localStorage
│   └── useMediaQuery.js      # Hook for responsive
├── i18n/                     # Internationalization
│   ├── i18n.js               # i18n configuration
│   └── locales/              # Translation files
│       ├── en/               # English
│       │   └── translation.json
│       └── vi/               # Vietnamese
│           └── translation.json
├── lib/                      # Libraries and utilities
│   ├── tools.js              # Tool list
│   ├── analytics.js          # Google Analytics handling
│   ├── ads.js                # Google Ads handling
│   └── seo.js                # SEO helpers
├── pages/                    # Pages
│   ├── HomePage.jsx          # Home page
│   ├── ToolsListPage.jsx     # Tools list page
│   ├── ToolPage.jsx          # Tool detail page
│   └── NotFoundPage.jsx      # 404 page
├── index.css                 # Global CSS
├── App.jsx                   # Main component
└── main.jsx                  # Entry point


🔄 Application Flow

main.jsx → LanguageProvider → BrowserRouter → App.jsx → ThemeProvider → SearchProvider → Routes → RootLayout → Pages
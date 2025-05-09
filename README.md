├── main.jsx (Entry point)
├── App.jsx (Routing)
├── context/ (Global state)
│   ├── ThemeContext.jsx
│   └── SearchContext.jsx
├── components/ (UI components)
│   ├── layout/ (Layout components)
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   └── RootLayout.jsx
│   ├── ui/ (Reusable UI components)
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── SearchBar.jsx
│   └── tools/ (Tool-specific components)
│       ├── unix-time/
│       ├── jwt-decoder/
│       ├── random/
│       └── cookie-tools/
├── pages/ (Route pages)
│   ├── HomePage.jsx
│   ├── ToolsListPage.jsx
│   ├── ToolPage.jsx
│   └── NotFoundPage.jsx
└── lib/ (Utilities)
    ├── tools.js (Tool definitions)
    ├── seo.js (SEO utilities)
    ├── analytics.js
    └── ads.js
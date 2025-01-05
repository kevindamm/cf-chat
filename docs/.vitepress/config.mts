import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Edge Serving Tutorials",
  description: "using Cloudflare, TypeScript and Hono",
  themeConfig: { // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '', link: '' },
    ],

    sidebar: [
      { text: 'Introduction',
        link: '/0-intro',
        items: [
          { text: 'Objectives', link: '/0-intro-objectives' },
          { text: 'Conventions', link: '/0-intro-conventions' },
          { text: 'Summary', link: '/0-intro-summary' }
        ]},

      { text: 'Project Setup',
        link: '/1-project',
        items: [
          { text: 'Create a Project', link: '/1-project-setup' },
          { text: 'Install Dependencies', link: '/1-project-deps' },
          { text: 'Promotional Site', link: '/1-project-promo' },
          // { text: 'Asset Serving', link: '/1-project-assets' },
          // { text: 'Email Collection', link: '/1-project-emails' },
          // { text: 'Vote Polling', link: '/1-project-votes' }
        ]},

      { text: '2. Realtime Updates',
        link: '/2-realtime',
        items: [
          { text: 'SSE stream visitor emotes', link: '/2-realtime-visitors' },
          { text: 'WebSockets without storage', link: '/2-realtime-ws-simple'},
          { text: 'WebSockets with storage', link: '/2-realtime-ws-chatrooms'},
          { text: 'WebRTC for peer streaming', link: '/2-realtime-webrtc' }
        ]},

      { text: '3. Protecting Sensitive Data',
        link: '/3-protect',
        items: [
          { text: 'TLS (secure channels)', link: '/3-protect-tls' },
          { text: 'JWT (trust tokens)', link: '/3-protect-jwt' },
          { text: 'bcrypt (no passwords in DB)', link: '/3-protect-bcrypt' },
          { text: 'AES (encrypting storage)', link: '/3-protect-aes' }
        ]},

      { text: '4. Authentication and Authorization',
        link: '/4-auth',
        items: [
          { text: 'Email Validation', link: '/4-authn-email' },
          { text: 'Open Authentication', link: '/4-authn-oauth' },
          { text: 'Authorization (ACLs)', link: '/4-authz-acls' },
          { text: 'Authorization (roles)', link: '/4-authz-roles' }
        ]},
    
      { text: '5. Game Services',
        link: '/5-games',
        items: [
          { text: 'Janken match', link: '/5-games-janken' },
          { text: 'Multi-Janken (lobby chat)', link: '/5-games-chat' },
          { text: 'Janken Royale (team chat)', link: '/5-games-teams' },
          { text: 'Developing with LÖVE', link: '/5-games-love' }
        ]},
      
      { text: '6. Fronted Focus',
        link: '/6-frontend',
        items: [
          { text: 'Image serving, optimizing', link: '/6-frontend-images' },
          { text: 'HTMX and interaction', link: '/6-frontend-htmx' },
          { text: 'Every form needs CSRF', link: '/6-frontend-csrf' },
          { text: 'Streaming video content', link: '/6-frontend-video' }
        ]},

      { text: '7. Continuous Tooling',
        link: '/7-tooling',
        items: [
          { text: 'Integration', link: '/7-tooling-integrate' },
          { text: 'Orchestration', link: '/7-tooling-orchestrate' },
          { text: 'Allocation', link: '/7-tooling-allocate' },
          { text: 'Moderation', link: '/7-tooling-moderate' }
        ]}
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kevindamm/cf-chat' },
      { icon: 'hackernews', link: 'https://news.ycombinator.com/threads?id=kevindamm' }
    ]
  }
})

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
        ]
      },
      { text: 'Project Setup',
        link: '/1-project',
        items: [
          { text: 'Create a Project', link: '/1-project-setup' },
          { text: 'Install Dependencies', link: '/1-project-deps' },
          { text: 'Promotional Site', link: '/1-project-promo' },
          // { text: 'Asset Serving', link: '/1-project-assets' },
          { text: 'Email Collection', link: '/1-project-emails' },
          { text: 'Vote Polling', link: '/1-project-votes' }
        ]
      },

      { text: '2. Realtime Updates', link: '/2-realtime' },

      { text: '3. Protecting Sensitive Data', link: '/3-sensitive'},

      { text: '4. Authentication and Authorization', link: '/4-auth'},
    
      { text: '5. Game Services', link: '/5-games'}
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kevindamm/cf-chat' }
    ]
  }
})

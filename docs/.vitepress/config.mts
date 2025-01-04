import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Edge Serving Tutorials",
  description: "using Cloudflare, TypeScript and Hono",
  themeConfig: { // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Introduction', link: '/0-intro' },

      { text: '1. Project Setup', link: '/1-project-setup' },

    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'About', link: '/about' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kevindamm/cf-chat/docs' }
    ]
  }
})

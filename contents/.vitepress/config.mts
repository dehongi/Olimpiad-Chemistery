import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3';

export default defineConfig({
  title: "المپیاد شیمی",
  description: "راهنمای جامع آمادگی برای المپیاد شیمی ایران",
  lang: 'fa-IR',
  dir: 'rtl',
  themeConfig: {
    nav: [
      { text: 'خانه', link: '/' },
      { text: 'راهنمای مطالعه', link: '/study-guide' },
      { text: 'شیمی دبیرستان', link: '/high-school/01-atomic-structure' },
    ],

    sidebar: [
      {
        text: 'مقدمه',
        items: [
          { text: 'معرفی المپیاد', link: '/introduction' },
          { text: 'ساختار آزمون', link: '/exam-structure' },
        ]
      },
      {
        text: 'شیمی دبیرستان',
        items: [
          { text: 'ساختار اتم', link: '/high-school/01-atomic-structure' },
          { text: 'جدول تناوبی', link: '/high-school/02-periodic-table' },
          { text: 'پیوند شیمیایی', link: '/high-school/03-bonding' },
          { text: 'حالات ماده', link: '/high-school/04-states-of-matter' },
          { text: 'محلول‌ها', link: '/high-school/05-solutions' },
          { text: 'اسید و باز', link: '/high-school/06-acids-bases' },
          { text: 'تعادل شیمیایی', link: '/high-school/07-equilibrium' },
          { text: 'شیمی اکسایش-احیا', link: '/high-school/08-redox' },
          { text: 'ترموشیمی', link: '/high-school/09-thermochemistry' },
          { text: 'کینتیک', link: '/high-school/10-kinetics' },
          { text: 'شیمی معدنی', link: '/high-school/11-inorganic' },
          { text: 'شیمی آلی', link: '/high-school/12-organic' },
        ]
      },
      {
        text: 'شیمی دانشگاهی',
        items: [
          { text: 'مفاهیم پایه و استوکیومتری', link: '/university/01-basics' },
          { text: 'شیمی فیزیک پیشرفته', link: '/university/02-advanced-physical' },
        ]
      },
      {
        text: 'بانک سوالات',
        items: [
          { text: 'ثبت سوال جدید', link: '/add-problem' },
          { text: 'آرشیو سوالات', link: '/problems/' },
        ]
      },
      {
        text: 'راهنمای موفقیت',
        items: [
          { text: 'برنامه مطالعه', link: '/study-guide' },
          { text: 'نکات حل مسئله', link: '/problem-solving' },
          { text: 'منابع', link: '/resources' },
        ]
      }
    ],

    socialLinks: [
      // { icon: 'github', link: '...' }
    ],

    footer: {
      message: 'منتشر شده تحت لیسانس MIT.',
      copyright: 'Copyright © 2024 المپیاد شیمی'
    },

    search: {
      provider: 'local'
    }
  },
  markdown: {
    config: (md) => {
      md.use(mathjax3)
    }
  },
  vite: {
    plugins: [
      {
        name: 'save-problem-middleware',
        configureServer(server) {
          server.middlewares.use('/api/save-problem', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const { title, year, problem, solution } = JSON.parse(body);
                  const fs = await import('fs');
                  const path = await import('path');

                  // Create slug
                  const slug = (year + '-' + title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')).replace(/^-|-$/g, '');
                  const filename = `${slug}.md`;
                  const { fileURLToPath } = await import('url');
                  const dirname = path.dirname(fileURLToPath(import.meta.url));
                  const filepath = path.resolve(dirname, '../problems', filename);

                  const content = `---
title: ${title}
year: ${year}
---
# ${title} (${year})

${problem}

::: details مشاهده پاسخ
${solution}
:::
`;
                  fs.writeFileSync(filepath, content);

                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, path: filename }));
                } catch (e) {
                  console.error(e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to save file' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ]
  }
})

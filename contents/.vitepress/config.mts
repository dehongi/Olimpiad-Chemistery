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
                  const filepath = path.join(process.cwd(), 'contents', 'problems', filename);

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

          server.middlewares.use('/api/edit-problem', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const { filename, title, year, problem, solution } = JSON.parse(body);
                  const fs = await import('fs');
                  const path = await import('path');
                  const filepath = path.join(process.cwd(), 'contents', 'problems', filename);

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
                  res.end(JSON.stringify({ success: true }));
                } catch (e) {
                  console.error(e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to update file' }));
                }
              });
            } else {
              next();
            }
          });

          server.middlewares.use('/api/get-problem', async (req, res, next) => {
            if (req.method === 'GET') {
              try {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const filename = url.searchParams.get('filename');
                
                console.log('GET /api/get-problem - filename:', filename);
                
                if (!filename) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Filename required' }));
                  return;
                }

                const fs = await import('fs');
                const path = await import('path');
                
                // Use process.cwd() which points to project root during dev
                const filepath = path.join(process.cwd(), 'contents', 'problems', filename);

                console.log('Resolved filepath:', filepath);
                console.log('File exists:', fs.existsSync(filepath));

                if (!fs.existsSync(filepath)) {
                  console.error('File not found at:', filepath);
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'File not found', path: filepath }));
                  return;
                }

                const content = fs.readFileSync(filepath, 'utf-8');
                console.log('Reading file:', filepath);
                
                // Parse frontmatter and content
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
                if (!frontmatterMatch) {
                  console.error('Failed to match frontmatter');
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Invalid file format' }));
                  return;
                }

                const frontmatter = frontmatterMatch[1];
                const body = frontmatterMatch[2];

                const titleMatch = frontmatter.match(/title:\s*(.+)/);
                const yearMatch = frontmatter.match(/year:\s*(.+)/);

                // Extract problem and solution with improved regex
                // Problem is between the title line and ::: details
                const problemMatch = body.match(/^#[^\n]+\n\n([\s\S]*?)\n::: details/);
                // Solution is between ::: details and closing :::
                const solutionMatch = body.match(/::: details[^\n]*\n([\s\S]*?)\n:::\s*$/m);

                console.log('Parsed data:', {
                  hasTitle: !!titleMatch,
                  hasYear: !!yearMatch,
                  hasProblem: !!problemMatch,
                  hasSolution: !!solutionMatch
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  title: titleMatch ? titleMatch[1].trim() : '',
                  year: yearMatch ? yearMatch[1].trim() : '',
                  problem: problemMatch ? problemMatch[1].trim() : '',
                  solution: solutionMatch ? solutionMatch[1].trim() : ''
                }));
              } catch (e) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read file' }));
              }
            } else {
              next();
            }
          });
        }
      }
    ]
  }
})

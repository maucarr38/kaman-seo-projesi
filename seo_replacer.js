const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const SEO_HTML = '<a href="index.html" class="seo-link"><strong><em>kamanubyo2026</em></strong></a>';

for (const file of htmlFiles) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Step 1: Clean up any existing SEO formatting to avoid nesting/duplication.
  // Remove <a><strong><em>... wrappers
  content = content.replace(/<a[^>]*seo-link[^>]*><strong><em>kamanubyo2026<\/em><\/strong><\/a>/g, 'kamanubyo2026');
  // Remove partial <strong><em> wrappers
  content = content.replace(/<strong><em>kamanubyo2026<\/em><\/strong>/g, 'kamanubyo2026');
  content = content.replace(/<strong>kamanubyo2026<\/strong>/g, 'kamanubyo2026');

  // Step 2: Split by HTML tags
  const parts = content.split(/(<[^>]+>)/g);

  // Step 3: Replace only in text nodes
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Text node
      // Negative lookahead to avoid replacing kamanubyo2026.blog
      parts[i] = parts[i].replace(/kamanubyo2026(?!\.blog|\.html)/g, SEO_HTML);
    }
  }

  // Step 4: Rejoin and save
  const newContent = parts.join('');
  fs.writeFileSync(filePath, newContent, 'utf-8');
}
console.log('All kamanubyo2026 instances in text nodes updated successfully!');

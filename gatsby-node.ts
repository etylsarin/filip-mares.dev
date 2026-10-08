import { createFilePath } from 'gatsby-source-filesystem';

exports.onCreateNode = ({ node, getNode, actions: { createNodeField } }) => {
  if (node.internal.type === 'Mdx') {
    createNodeField({
      node,
      name: 'slug',
      value: createFilePath({ node, getNode })
    });
  }
};

/**
 * React's SSR stream occasionally emits a stray NUL byte at a chunk boundary,
 * sometimes inside a multi-byte UTF-8 character. It corrupts the rendered
 * text and makes the file serve as binary data rather than HTML. Strip those
 * bytes from the generated pages (same clean-up as the sibling Gatsby sites).
 */
exports.onPostBuild = ({ reporter }) => {
  const fs = require('fs');
  const path = require('path');
  const publicDir = path.join(__dirname, 'public');
  const cleaned: string[] = [];

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.html')) {
        const buf: Buffer = fs.readFileSync(full);
        if (buf.includes(0)) {
          fs.writeFileSync(full, Buffer.from(buf.filter(byte => byte !== 0)));
          cleaned.push(path.relative(publicDir, full));
        }
      }
    }
  };

  walk(publicDir);

  if (cleaned.length) {
    reporter.warn(`Stripped stray NUL bytes from ${cleaned.length} HTML file(s): ${cleaned.join(', ')}`);
  }
};

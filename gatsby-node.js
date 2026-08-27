const path = require('path');
const fs = require('fs');
const { createFilePath } = require('gatsby-source-filesystem');

const SITE_BUILD_ID = new Date().toISOString();

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        'process.env.GATSBY_SITE_BUILD_ID': JSON.stringify(SITE_BUILD_ID),
      }),
    ],
  });
};

exports.onPostBuild = () => {
  fs.writeFileSync(
    path.join(__dirname, 'public', 'site-version.json'),
    JSON.stringify({ buildId: SITE_BUILD_ID }),
    'utf8'
  );
};

exports.onCreateDevServer = ({ app }) => {
  const adminIndex = path.resolve(__dirname, 'static/admin/index.html');

  app.get(['/admin', '/admin/', '/admin/index.html'], (_request, response) => {
    response.sendFile(adminIndex);
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MdxFrontmatter {
      draft: Boolean
      lang: String
      slug: String
      categories: [String!]
    }
  `);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type !== 'Mdx') {
    return;
  }

  actions.createNodeField({
    name: 'slug',
    node,
    value: node.frontmatter.slug || createFilePath({ node, getNode }),
  });

  const sourceFile = getNode(node.parent);
  if (sourceFile && sourceFile.relativePath) {
    actions.createNodeField({
      name: 'previewSlug',
      node,
      value: path.basename(sourceFile.relativePath, path.extname(sourceFile.relativePath)),
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(`
    {
      allMdx(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            id
            fields {
              slug
              previewSlug
            }
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD")
              draft
              lang
              categories
            }
            excerpt
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while loading blog posts.', result.errors);
    return;
  }

  const allNodes = result.data.allMdx.edges;
  const translations = new Map(
    allNodes
      .filter(({ node }) => node.frontmatter.lang === 'en')
      .map(({ node }) => [node.fields.slug, node])
  );
  const allPosts = allNodes.filter(({ node }) => node.frontmatter.lang !== 'en');
  const posts = process.env.NODE_ENV === 'development'
    ? allPosts
    : allPosts.filter(({ node }) => node.frontmatter.draft !== true);
  const postTemplate = path.resolve('./src/templates/post-template.tsx');
  const draftPreviewIndexTemplate = path.resolve('./src/templates/draft-preview-index-template.tsx');
  const archiveTemplate = path.resolve('./src/templates/monthly-archive-template.tsx');
  const blogListTemplate = path.resolve('./src/templates/blog-list-template.tsx');
  const tagTemplate = path.resolve('./src/templates/tag-template.tsx');
  const withTranslation = ({ node }) => ({
    node: {
      ...node,
      englishTranslation: translations.get(node.fields.slug) || null,
    },
  });

  posts.forEach(({ node }) => {
    actions.createPage({
      path: node.fields.slug,
      component: postTemplate,
      context: { id: node.id, slug: node.fields.slug },
    });
  });

  // Preview pages are deliberately absent from every public list and archive.
  // Their client-side passphrase gate is a casual sharing barrier, not strong auth.
  const draftPosts = allPosts.filter(({ node }) => node.frontmatter.draft === true);
  draftPosts.forEach(({ node }) => {
    actions.createPage({
      path: `/preview/${node.fields.previewSlug}`,
      component: postTemplate,
      context: {
        id: node.id,
        slug: node.fields.slug,
        draftPreview: true,
      },
    });
  });

  actions.createPage({
    path: '/preview/',
    component: draftPreviewIndexTemplate,
    context: {
      drafts: draftPosts.map(({ node }) => ({
        date: node.frontmatter.date,
        previewSlug: node.fields.previewSlug,
        title: node.frontmatter.title,
      })),
    },
  });

  const postsByMonth = posts.reduce((groups, post) => {
    const month = post.node.frontmatter.date.slice(0, 7);
    groups[month] = groups[month] || [];
    groups[month].push(post);
    return groups;
  }, {});
  const months = Object.keys(postsByMonth).map(month => ({
    month,
    postCount: postsByMonth[month].length,
  }));

  months.forEach(({ month }) => {
    const [year, monthPart] = month.split('-');
    actions.createPage({
      path: `/${year}/${monthPart}`,
      component: archiveTemplate,
      context: {
        month,
        posts: postsByMonth[month].map(withTranslation),
      },
    });
  });

  const postsPerPage = 5;
  const musicPosts = posts.filter(({ node }) => node.frontmatter.categories?.[0] === 'music');
  const generalPosts = posts.filter(({ node }) => node.frontmatter.categories?.[0] !== 'music');

  const createSectionPages = ({ sectionPosts, basePath, section }) => {
    const numPages = Math.max(1, Math.ceil(sectionPosts.length / postsPerPage));

    Array.from({ length: numPages }).forEach((_, index) => {
      actions.createPage({
        path: index === 0 ? basePath : `${basePath}/page/${index + 1}`,
        component: blogListTemplate,
        context: {
          limit: postsPerPage,
          skip: index * postsPerPage,
          numPages,
          currentPage: index + 1,
          basePath,
          section,
          posts: sectionPosts.slice(index * postsPerPage, (index + 1) * postsPerPage).map(withTranslation),
          allPosts: sectionPosts.map(withTranslation),
          months,
        },
      });
    });
  };

  createSectionPages({ sectionPosts: musicPosts, basePath: '/music-activity', section: 'music' });
  createSectionPages({ sectionPosts: generalPosts, basePath: '/blog', section: 'blog' });

  const postsByCategoryPath = new Map();
  posts.forEach(post => {
    const categories = post.node.frontmatter.categories || [];
    categories.forEach((_, index) => {
      const segments = categories.slice(0, index + 1);
      const key = segments.join('/');
      const categoryPosts = postsByCategoryPath.get(key) || [];
      categoryPosts.push(post);
      postsByCategoryPath.set(key, categoryPosts);
    });
  });

  const categoryEntries = Array.from(postsByCategoryPath.entries())
    .map(([key, categoryPosts]) => ({
      key,
      segments: key.split('/'),
      postCount: categoryPosts.length,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  actions.createPage({
    path: '/tags',
    component: tagTemplate,
    context: {
      segments: [],
      posts: [],
      categoryEntries,
    },
  });

  postsByCategoryPath.forEach((categoryPosts, key) => {
    actions.createPage({
      path: `/tags/${key}`,
      component: tagTemplate,
      context: {
        segments: key.split('/'),
        posts: categoryPosts.map(withTranslation),
        categoryEntries,
      },
    });
  });
};

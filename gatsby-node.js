const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const _ = require('lodash');

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

  const postsByMonth = _.groupBy(posts, ({ node }) =>
    node.frontmatter.date.slice(0, 7)
  );
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
  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, index) => {
    actions.createPage({
      path: index === 0 ? '/' : `/page/${index + 1}`,
      component: blogListTemplate,
      context: {
        limit: postsPerPage,
        skip: index * postsPerPage,
        numPages,
        currentPage: index + 1,
        posts: posts.slice(index * postsPerPage, (index + 1) * postsPerPage).map(withTranslation),
        allPosts: posts.map(withTranslation),
        months,
      },
    });
  });

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

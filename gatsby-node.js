const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const _ = require('lodash');

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
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
            }
            excerpt
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.');
    return;
  }

  const posts = result.data.allMdx.edges;

  // Create single blog post pages
  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve('./src/templates/post-template.tsx'),
      context: {
        id: node.id,
      },
    });
  });

  // Create monthly archive pages
  const postsByMonth = _.groupBy(posts, post => post.node.frontmatter.date.slice(0, 7));
  const months = Object.keys(postsByMonth).map(month => ({
    month,
    postCount: postsByMonth[month].length,
  }));

  months.forEach(({ month }) => {
    const [year, monthPart] = month.split('-');
    createPage({
      path: `/${year}/${monthPart}`,
      component: path.resolve('./src/templates/monthly-archive-template.tsx'),
      context: {
        month,
        posts: postsByMonth[month],
      },
    });
  });

  // Create index page
  createPage({
    path: '/',
    component: path.resolve('./src/pages/index.tsx'),
    context: {
      posts,
      months,
    },
  });
};
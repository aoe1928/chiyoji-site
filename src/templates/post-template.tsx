import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import { MDXProvider } from '@mdx-js/react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import MDXComponents from '../components/MDXComponents';

type Props = {
  data: {
    mdx: {
      frontmatter: {
        title: string;
        date: string;
      };
      body: string;
    };
  };
};

const PostTemplate: React.FC<Props> = ({ data }) => {
  const { frontmatter, body } = data.mdx;
  return (
    <Layout>
      <Box display="flex" alignItems="center">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton aria-label="戻る">
            <ArrowBackIcon />
            <Typography variant="button" display="block" gutterBottom>BACK</Typography>
          </IconButton>
        </Link>
      </Box>
      <Typography variant="h1" gutterBottom>{frontmatter.title}</Typography>
      <Typography variant="subtitle1" gutterBottom>{frontmatter.date}</Typography>
      <MDXProvider components={MDXComponents}>
        {body}
      </MDXProvider>
    </Layout>
  );
};

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
      body
    }
  }
`;

export default PostTemplate;
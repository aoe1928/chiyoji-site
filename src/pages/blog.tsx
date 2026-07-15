import React from 'react';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { graphql } from 'gatsby';

const BlogPage: React.FC = () => {
  const { language } = useI18next();
  const isEnglish = language === 'en';

  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h1" gutterBottom>
          {isEnglish ? 'Blog' : 'ブログ'}
        </Typography>
        <Typography variant="body1" paragraph>
          {isEnglish
            ? 'News and activity updates are posted on Note. Older posts are available on Blogger.'
            : '主な活動や告知はNoteで更新しています。過去のブログはBloggerで閲覧できます。'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            href="https://note.com/chiyoji0762"
            target="_blank"
            rel="noopener noreferrer"
          >
            Note
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            href="https://chiyoji0762.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {isEnglish ? 'Archive (Blogger)' : '旧ブログ (Blogger)'}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default BlogPage;

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

import React from 'react';
import { graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layout from '../components/layout';
import CategoryTrail from '../components/category-trail';
import { getCategoryLabel, getCategoryPath } from '../taxonomy';

type PostNode = {
  id: string;
  fields: { slug: string };
  frontmatter: {
    title: string;
    date: string;
    categories?: string[];
  };
  excerpt: string;
  englishTranslation?: {
    frontmatter: { title: string; date: string };
    excerpt: string;
  } | null;
};

type PageContext = {
  segments: string[];
  posts: Array<{ node: PostNode }>;
  categoryEntries: Array<{
    key: string;
    segments: string[];
    postCount: number;
  }>;
};

const TagTemplate: React.FC<{ pageContext: PageContext }> = ({ pageContext }) => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  const { segments, posts, categoryEntries } = pageContext;
  const isIndex = segments.length === 0;
  const childCategories = categoryEntries.filter(entry =>
    entry.segments.length === segments.length + 1
    && segments.every((segment, index) => entry.segments[index] === segment)
  );

  return (
    <Layout>
      <Box sx={{ maxWidth: 920, mx: 'auto' }}>
        <Typography variant="overline" sx={{ color: '#FFB6C1', letterSpacing: '0.14em' }}>
          {isEnglish ? 'Browse by topic' : 'テーマから探す'}
        </Typography>
        <Typography variant="h1" sx={{ mt: 0.5, mb: 1.5 }}>
          {isIndex
            ? (isEnglish ? 'Tags' : 'タグ一覧')
            : getCategoryLabel(segments[segments.length - 1], language)}
        </Typography>

        {!isIndex && <CategoryTrail categories={segments} />}

        {childCategories.length > 0 && (
          <Box sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '1.3rem', sm: '1.55rem' } }}>
              {isIndex
                ? (isEnglish ? 'Topics' : 'テーマ')
                : (isEnglish ? 'Narrow this topic' : 'さらに絞り込む')}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
              {childCategories.map(entry => (
                <Box
                  key={entry.key}
                  component={Link}
                  language={language}
                  to={getCategoryPath(entry.segments)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(102, 255, 102, 0.24)',
                    backgroundColor: 'rgba(102, 255, 102, 0.055)',
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { backgroundColor: 'rgba(102, 255, 102, 0.11)' },
                  }}
                >
                  <Typography sx={{ color: '#9cff9c', fontWeight: 600 }}>
                    {getCategoryLabel(entry.segments[entry.segments.length - 1], language)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {entry.postCount} {isEnglish ? (entry.postCount === 1 ? 'post' : 'posts') : '件'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {!isIndex && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '1.3rem', sm: '1.55rem' } }}>
              {isEnglish ? `${posts.length} posts` : `記事 ${posts.length}件`}
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {posts.map(({ node }) => {
                const displayedPost = isEnglish && node.englishTranslation
                  ? node.englishTranslation
                  : node;
                return (
                  <Box
                    key={node.id}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                    }}
                  >
                    <Typography
                      component={Link}
                      language={language}
                      to={node.fields.slug}
                      sx={{ color: '#66ff66', fontSize: { xs: '1.15rem', sm: '1.35rem' }, textDecoration: 'none' }}
                    >
                      {displayedPost.frontmatter.title}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                      {displayedPost.frontmatter.date}
                    </Typography>
                    <CategoryTrail categories={node.frontmatter.categories} compact />
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {displayedPost.excerpt}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default TagTemplate;

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
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

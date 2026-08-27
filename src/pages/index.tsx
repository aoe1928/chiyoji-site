import React from 'react';
import { graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Layout from '../components/layout';

const sections = [
  {
    path: '/music-activity',
    titleJa: '音楽活動',
    titleEn: 'Music Activity',
    descriptionJa: 'Second Waltz、Purgatorio、楽曲、ライブやリリースのお知らせ。',
    descriptionEn: 'Second Waltz, Purgatorio, songs, shows, and releases.',
    accent: '#66ff66',
  },
  {
    path: '/blog',
    titleJa: 'ブログ',
    titleEn: 'Blog',
    descriptionJa: '技術、旅行、ガジェットなど、音楽以外の記録。',
    descriptionEn: 'Technology, travel, gadgets, and notes beyond music.',
    accent: '#ffb6c1',
  },
];

const IndexPage: React.FC = () => {
  const { language } = useI18next();
  const isEnglish = language === 'en';

  return (
    <Layout>
      <Box sx={{ maxWidth: 920, mx: 'auto', py: { xs: 3, sm: 8 } }}>
        <Typography
          component="h1"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(110deg, #66ff66, #ffb6c1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {isEnglish ? "Chiyoji's Website" : 'ちよじのホームページ'}
        </Typography>
        <Typography sx={{ mb: { xs: 5, sm: 7 }, textAlign: 'center', color: 'text.secondary' }}>
          {isEnglish ? 'Music and everything else, kept in their own places.' : '音楽活動と、それ以外の記録。'}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
          {sections.map((section) => (
            <Paper
              key={section.path}
              component={Link}
              language={language}
              to={section.path}
              variant="outlined"
              sx={{
                display: 'block',
                minHeight: 220,
                p: { xs: 3, sm: 4 },
                borderRadius: '20px',
                borderColor: `${section.accent}55`,
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: 'inherit',
                textDecoration: 'none',
                transition: 'transform 160ms ease, border-color 160ms ease, background-color 160ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: section.accent,
                  backgroundColor: `${section.accent}0d`,
                },
              }}
            >
              <Typography component="h2" sx={{ mb: 2, fontSize: '2rem', fontWeight: 900, color: section.accent }}>
                {isEnglish ? section.titleEn : section.titleJa}
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
                {isEnglish ? section.descriptionEn : section.descriptionJa}
              </Typography>
              <Typography sx={{ mt: 3, color: section.accent, fontWeight: 800 }} aria-hidden="true">→</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default IndexPage;

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

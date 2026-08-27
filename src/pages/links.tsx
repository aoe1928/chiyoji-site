import React from 'react';
import { Helmet } from 'react-helmet';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';

type LinkItem = {
  label: string;
  description: string;
  href: string;
  internal?: boolean;
};

type LinkGroup = {
  title: string;
  items: LinkItem[];
};

const groups: LinkGroup[] = [
  {
    title: '発信・SNS',
    items: [
      { label: 'Note', description: '活動や日々の記録', href: 'https://note.com/chiyoji0762' },
      { label: 'X', description: '個人アカウント', href: 'https://x.com/1ucy_in_the_sky' },
      { label: 'YouTube', description: '音楽や映像', href: 'https://www.youtube.com/channel/UClxoVDsAU-ugf8hMo69vYg' },
      { label: '旧ブログ', description: 'Bloggerに残している過去の記事', href: 'https://chiyoji0762.blogspot.com/' },
    ],
  },
  {
    title: '音楽・プロジェクト',
    items: [
      { label: 'Second Waltz', description: '音楽プロジェクトのページ', href: '/second-waltz', internal: true },
      { label: 'Purgatorio', description: 'プログレッシブロックプロジェクト', href: '/purgatorio', internal: true },
      { label: '楽曲紹介', description: 'このサイトの楽曲ページ', href: '/music', internal: true },
      { label: 'Second Waltz — X', description: '最新情報', href: 'https://x.com/second_waltz_' },
      { label: 'Second Waltz — Instagram', description: '写真とお知らせ', href: 'https://www.instagram.com/second.waltz.tokyo/' },
      { label: 'Bandcamp', description: 'Second Waltzの音源', href: 'https://the-second-waltz.bandcamp.com/' },
    ],
  },
  {
    title: 'ショップ',
    items: [
      { label: 'Second Waltz Shop', description: 'グッズ・作品', href: 'https://theromans.base.shop/' },
      { label: 'Purgatorio Shop', description: 'Purgatorioのショップ', href: 'https://purgatorio.base.ec/' },
    ],
  },
];

const LinksPage: React.FC = () => {
  const { language } = useI18next();

  return (
    <Layout>
      <Helmet>
        <title>リンク | ちよじのホームページ</title>
        <meta name="description" content="ちよじのSNS、音楽活動、ショップなどのリンク集です。" />
      </Helmet>
      <Box sx={{ maxWidth: 880, mx: 'auto', py: { xs: 2, sm: 5 } }}>
        <Typography
          component="h1"
          sx={{
            mb: 1.5,
            textAlign: 'center',
            fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            background: 'linear-gradient(110deg, #66ff66 10%, #9cffaa 55%, #ffb6c1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Links
        </Typography>
        <Typography sx={{ mb: { xs: 5, sm: 7 }, textAlign: 'center', color: 'text.secondary' }}>
          SNS、音楽、ショップなどの雑多なリンク集です。
        </Typography>

        {groups.map((group) => (
          <Box component="section" key={group.title} sx={{ mb: { xs: 5, sm: 6 } }}>
            <Typography
              component="h2"
              sx={{ mb: 2, fontSize: '1.15rem', fontWeight: 800, color: '#b9ffbd', letterSpacing: '0.04em' }}
            >
              {group.title}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
              {group.items.map((item) => {
                const cardSx = {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minHeight: 92,
                  p: 2.25,
                  border: '1px solid rgba(255, 182, 193, 0.22)',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.035)',
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'transform 160ms ease, border-color 160ms ease, background-color 160ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(102, 255, 102, 0.55)',
                    backgroundColor: 'rgba(102, 255, 102, 0.07)',
                  },
                  '&:focus-visible': { outline: '2px solid #66ff66', outlineOffset: '3px' },
                };
                const content = (
                  <>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 800, color: '#fff' }}>{item.label}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>{item.description}</Typography>
                    </Box>
                    <Typography aria-hidden="true" sx={{ color: '#66ff66', fontSize: '1.4rem' }}>↗</Typography>
                  </>
                );

                return item.internal ? (
                  <Paper key={item.label} component={Link} to={item.href} language={language} elevation={0} sx={cardSx}>
                    {content}
                  </Paper>
                ) : (
                  <Paper key={item.label} component="a" href={item.href} target="_blank" rel="noopener noreferrer" elevation={0} sx={cardSx}>
                    {content}
                  </Paper>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Layout>
  );
};

export default LinksPage;

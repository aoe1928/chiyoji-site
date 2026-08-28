import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/layout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';

type IconLinkProps = {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
};

const IconLink: React.FC<IconLinkProps> = ({ href, ariaLabel, children }) => (
  <IconButton
    href={href}
    aria-label={ariaLabel}
    color="inherit"
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      color: '#ffb6c1',
      transition: 'color 160ms ease, transform 160ms ease',
      '&:hover': {
        color: '#66ff66',
        transform: 'translateY(-2px)',
      },
    }}
  >
    {children}
  </IconButton>
);

const AboutPage: React.FC = () => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  const email = "chiyoji0762@gmail.com";

  const gearCategories = [
    {
      titleJa: '楽器',
      titleEn: 'Musical Instruments',
      icon: <MusicNoteIcon sx={{ color: '#66ff66' }} />,
      items: [
        'MusicMan Axis Guitar',
        'MusicMan Sterling Bass',
        'Fernandes テレキャスター',
        'Godin エレガット',
        'KYairi アコギ',
      ],
    },
    {
      titleJa: 'メインPC',
      titleEn: 'Main PC Specs',
      icon: <ComputerIcon sx={{ color: '#66ff66' }} />,
      specs: [
        { label: 'CPU', value: 'AMD Ryzen 9 5950X' },
        { label: 'Motherboard', value: 'ASUS ROG Crosshair VIII Dark Hero' },
        { label: 'GPU', value: 'MSI GeForce RTX 5060 Ti 16G VENTUS 2X OC PLUS' },
        { label: 'RAM', value: 'Patriot Viper Steel DDR4 3600MHz 64GB (32GB×2)' },
        { label: 'Storage', value: 'WD_BLACK SN850X 2TB' },
        { label: 'Cooler', value: 'Arctic Liquid Freezer III Pro 280 A-RGB' },
        { label: 'Case', value: 'Fractal Design Pop Air RGB Black TG' },
        { label: 'PSU', value: '850W VITA GM' },
        { label: 'OS', value: 'Windows 11 Pro' },
      ],
    },
    {
      titleJa: 'スマートフォン',
      titleEn: 'Smartphones',
      icon: <SmartphoneIcon sx={{ color: '#66ff66' }} />,
      items: [
        'GalaxyS26',
        'GalaxyFold5',
      ],
    },
    {
      titleJa: '車',
      titleEn: 'Car / Vehicle',
      icon: <DirectionsCarIcon sx={{ color: '#66ff66' }} />,
      items: [
        'BYD ATTO3',
      ],
    },
  ];

  const cardStyle = {
    p: { xs: 2.5, sm: 3 },
    border: '1px solid rgba(255, 182, 193, 0.22)',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    transition: 'border-color 160ms ease, background-color 160ms ease',
    '&:hover': {
      borderColor: 'rgba(102, 255, 102, 0.45)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  };

  return (
    <Layout>
      <Helmet>
        <title>{isEnglish ? 'About | Chiyoji Website' : '自己紹介 | ちよじのホームページ'}</title>
        <meta
          name="description"
          content={isEnglish ? "Chiyoji's profile, bio, and gear/equipment list." : 'ちよじのプロフィール、経歴、所持品・機材リストです。'}
        />
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
          {isEnglish ? 'About' : '自己紹介'}
        </Typography>

        <Typography sx={{ mb: { xs: 4, sm: 5 }, textAlign: 'center', color: 'text.secondary' }}>
          {isEnglish ? 'Profile and Gear' : 'プロフィールと所持品・機材'}
        </Typography>

        {/* Profile Card */}
        <Paper elevation={0} sx={{ ...cardStyle, mb: 4 }}>
          <Typography
            component="h2"
            sx={{
              mb: 1.5,
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            Chiyoji
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.9,
              mb: 2,
            }}
          >
            {isEnglish
              ? 'Composer, performer, and IT engineer based in Saitama, Japan.'
              : '埼玉県在住 作曲家、演奏家、ITエンジニア'}<br />
            {isEnglish
              ? 'I play in a band called Second Waltz.'
              : 'セカンドワルツというバンドをやっています。'}<br />
            {isEnglish
              ? 'I play guitar, bass, and keyboards.'
              : 'ギター、ベース、キーボードを弾けます。'}
          </Typography>

          {/* Social and Contact Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <IconLink href={`mailto:${email}`} ariaLabel="email">
              <MailIcon />
            </IconLink>
            <IconLink href="https://x.com/1ucy_in_the_sky" ariaLabel="x">
              <TwitterIcon />
            </IconLink>
            <IconLink href="https://www.instagram.com/second.waltz.tokyo/" ariaLabel="instagram">
              <InstagramIcon />
            </IconLink>
            <IconLink href="https://www.youtube.com/channel/UClxoVDsAU-ugf8hMo69vYg" ariaLabel="youtube">
              <YouTubeIcon />
            </IconLink>
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              {email}
            </Typography>
          </Box>
        </Paper>

        {/* Gear & Items Section */}
        <Box component="section">
          <Typography
            component="h2"
            sx={{
              mb: 2.5,
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#b9ffbd',
              letterSpacing: '0.04em',
            }}
          >
            {isEnglish ? 'Gear & Devices' : '所持品・機材'}
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
            {gearCategories.map((category) => (
              <Paper
                key={category.titleJa}
                elevation={0}
                sx={{
                  ...cardStyle,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  {category.icon}
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#fff',
                    }}
                  >
                    {isEnglish ? category.titleEn : category.titleJa}
                  </Typography>
                </Box>

                {category.items && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {category.items.map((item) => (
                      <Box
                        key={item}
                        sx={{
                          p: 1.25,
                          px: 1.75,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {category.specs && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {category.specs.map((spec) => (
                      <Box
                        key={spec.label}
                        sx={{
                          p: 1.25,
                          px: 1.75,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#66ff66',
                            fontWeight: 700,
                            display: 'block',
                            mb: 0.25,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontSize: '0.72rem',
                          }}
                        >
                          {spec.label}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                          {spec.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default AboutPage;

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


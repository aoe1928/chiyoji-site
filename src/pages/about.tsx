import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import YouTubeIcon from '@mui/icons-material/YouTube';
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
      color: 'rgba(255, 255, 255, 0.55)',
      p: 0.75,
      transition: 'color 160ms ease',
      '&:hover': {
        color: '#fff',
      },
    }}
  >
    {children}
  </IconButton>
);

const AboutPage: React.FC = () => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  const email = 'chiyoji0762@gmail.com';

  const instruments = [
    'MusicMan Axis Guitar',
    'MusicMan Sterling Bass',
    'Fernandes テレキャスター',
    'Godin エレガット',
    'KYairi アコギ',
  ];

  const cameras = [
    'Sony α ZV-E10',
    'DJI Osmo Action 4',
    'SIGMA 18-50mm F2.8 DC DN',
    'TTArtisan 25mm f/2 C APS-C',
  ];

  const pcSpecs = [
    'AMD Ryzen 9 5950X',
    'ASUS ROG Crosshair VIII Dark Hero',
    'MSI GeForce RTX 5060 Ti 16G VENTUS 2X OC PLUS',
    'Patriot Viper Steel DDR4 3600MHz 64GB (32GB×2)',
    'WD_BLACK SN850X 2TB',
    'Arctic Liquid Freezer III Pro 280 A-RGB',
    'Fractal Design Pop Air RGB Black TG',
    '850W VITA GM',
    'Windows 11 Pro',
  ];

  const phones = ['GalaxyS26', 'GalaxyFold5'];
  const car = ['BYD ATTO3'];

  return (
    <Layout>
      <Helmet>
        <title>{isEnglish ? 'About | Chiyoji Website' : '自己紹介 | ちよじのホームページ'}</title>
        <meta
          name="description"
          content={isEnglish ? "Chiyoji's profile and gear." : 'ちよじのプロフィールと機材・所持品。'}
        />
      </Helmet>

      <Box sx={{ maxWidth: 760, mx: 'auto', py: { xs: 2, sm: 5 }, px: { xs: 1, sm: 2 } }}>
        {/* Title */}
        <Typography
          component="h1"
          sx={{
            mb: 1.5,
            fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(110deg, #66ff66 10%, #9cffaa 55%, #ffb6c1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {isEnglish ? 'About' : '自己紹介'}
        </Typography>

        <Typography sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          Profile & Gear
        </Typography>

        {/* Bio */}
        <Box sx={{ mb: 5 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#fff',
              mb: 1.5,
            }}
          >
            Chiyoji
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.9,
              fontSize: '0.95rem',
              mb: 2.5,
            }}
          >
            {isEnglish
              ? 'Composer, performer, and IT engineer based in Saitama, Japan.'
              : '埼玉県在住 作曲家、演奏家、ITエンジニア。'}<br />
            {isEnglish
              ? 'Playing in Second Waltz. Guitar, bass, and keyboards.'
              : 'セカンドワルツというバンドをやっています。ギター、ベース、キーボードを演奏。'}
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <IconLink href="https://x.com/1ucy_in_the_sky" ariaLabel="x">
              <TwitterIcon fontSize="small" />
            </IconLink>
            <IconLink href="https://www.instagram.com/second.waltz.tokyo/" ariaLabel="instagram">
              <InstagramIcon fontSize="small" />
            </IconLink>
            <IconLink href="https://www.youtube.com/channel/UClxoVDsAU-ugf8hMo69vYg" ariaLabel="youtube">
              <YouTubeIcon fontSize="small" />
            </IconLink>
            <IconLink href={`mailto:${email}`} ariaLabel="email">
              <MailIcon fontSize="small" />
            </IconLink>
            <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem' }}>
              {email}
            </Typography>
          </Box>
        </Box>

        {/* Gear Section */}
        <Box
          component="section"
          sx={{
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#b9ffbd',
              mb: 3.5,
            }}
          >
            Gear & Setup
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* 楽器 */}
            <Box>
              <Typography
                component="h3"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  mb: 1,
                }}
              >
                {isEnglish ? 'Instruments' : 'Instruments / 楽器'}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {instruments.map((item) => (
                  <Box
                    component="li"
                    key={item}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.92rem',
                      lineHeight: 1.8,
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* カメラ */}
            <Box>
              <Typography
                component="h3"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  mb: 1,
                }}
              >
                {isEnglish ? 'Camera' : 'Camera / カメラ'}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {cameras.map((item) => (
                  <Box
                    component="li"
                    key={item}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.92rem',
                      lineHeight: 1.8,
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Main PC */}
            <Box>
              <Typography
                component="h3"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  mb: 1,
                }}
              >
                Main PC
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.9rem',
                  lineHeight: 1.8,
                }}
              >
                {pcSpecs.join(' / ')}
              </Typography>
            </Box>

            {/* Mobile & Car */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5 }}>
              <Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgba(255, 255, 255, 0.45)',
                    mb: 1,
                  }}
                >
                  Mobile
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {phones.map((item) => (
                    <Box
                      component="li"
                      key={item}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '0.92rem',
                        lineHeight: 1.8,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgba(255, 255, 255, 0.45)',
                    mb: 1,
                  }}
                >
                  Car
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {car.map((item) => (
                    <Box
                      component="li"
                      key={item}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '0.92rem',
                        lineHeight: 1.8,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
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

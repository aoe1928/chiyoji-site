import React from 'react';
import Layout from '../components/layout';
import IconButton from '@mui/material/IconButton';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { styled } from '@mui/material/styles';
import { graphql } from 'gatsby';
import Typography from '@mui/material/Typography';

type IconLinkProps = {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
};

const IconLink: React.FC<IconLinkProps> = ({ href, ariaLabel, children }) => (
  <IconButton href={href} aria-label={ariaLabel} color="inherit" target="_blank" rel="noopener noreferrer">
    {children}
  </IconButton>
);

import { useI18next } from 'gatsby-plugin-react-i18next';

const StyledImage = styled('img')({
  maxWidth: '200px',
  width: '100%',
  height: 'auto',
  marginTop: '20px',
  marginRight: '20px',
  float: 'left',
});

const AboutPage: React.FC = () => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  const email = "chiyoji0762@gmail.com";

  return (
    <Layout>
      {/* <Typography variant="h1" gutterBottom>{t('about.title')}</Typography> */}
      <Typography variant="h1" gutterBottom>{isEnglish ? 'About' : '自己紹介'}</Typography>
      <Typography variant="body1" component="p" paragraph>
        {/* {t('about.name')}<br /> */}
        {/* {t('about.bio')}<br /> */}
        {/* {t('about.band')}{' '} */}
        Chiyoji<br />
        {isEnglish ? 'Composer, performer, and IT engineer based in Saitama, Japan.' : '埼玉県在住 作曲家、演奏家、ITエンジニア'}<br />
        {isEnglish ? 'I play in a band called Second Waltz.' : 'セカンドワルツというバンドをやっています'}
        <IconLink href='https://x.com/second_waltz_' ariaLabel="x">
          <TwitterIcon />
        </IconLink>
        <br />
        {/* {t('about.skills')}<br /> */}
        {/* {t('about.contact_prefix')}{' '} */}
        {isEnglish ? 'I play guitar, bass, and keyboards.' : 'ギター、ベース、キーボードを弾けます。'}<br />
        <IconLink href={`mailto:${email}`} ariaLabel="email">
          <MailIcon />
        </IconLink>
        {email}
      </Typography>
      <IconLink href='https://x.com/1ucy_in_the_sky' ariaLabel="x">
        <TwitterIcon />
      </IconLink>
      <IconLink href='https://www.instagram.com/second.waltz.tokyo/' ariaLabel="instagram">
        <InstagramIcon />
      </IconLink>
      <IconLink href='https://www.youtube.com/channel/UClxoVDsAU-ugf8hMo69vYg' ariaLabel="youtube">
        <YouTubeIcon />
      </IconLink>
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

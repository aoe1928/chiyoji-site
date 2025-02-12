import React from 'react';
import Layout from '../components/layout';
import IconButton from '@mui/material/IconButton';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { styled } from '@mui/material/styles';

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

const StyledImage = styled('img')({
  maxWidth: '200px',
  width: '100%',
  height: 'auto',
  marginTop: '20px',
  marginRight: '20px',
  float: 'left',
});

const AboutPage: React.FC = () => (
  <Layout>
    <h1>自己紹介</h1>
    <p>
      ちよじ<br />
      埼玉県在住 作曲家、演奏家、ITエンジニア<br />
      セカンドワルツというバンドをやっています 
      <IconLink href='https://x.com/second_waltz_' ariaLabel="x">
        <TwitterIcon />
      </IconLink>
      <br /> 
      ギター、ベース、キーボードを弾けます。<br />
      演奏、作曲、編曲の依頼などは 
      <IconLink href="mailto:chiyoji0762@gmail.com" ariaLabel="email">
        <MailIcon />
      </IconLink>
      chiyoji0762@gmail.com まで。<br />
    </p>
    <IconLink href='https://x.com/1ucy_in_the_sky' ariaLabel="x">
      <TwitterIcon />
    </IconLink>
    <IconLink href='https://www.instagram.com/second.waltz.tokyo/' ariaLabel="instagram">
      <InstagramIcon />
    </IconLink>
    <IconLink href='https://www.youtube.com/channel/UClxoVDsAU-ug9f8hMo69vYg' ariaLabel="youtube">
      <YouTubeIcon />
    </IconLink>
  </Layout>
);

export default AboutPage;
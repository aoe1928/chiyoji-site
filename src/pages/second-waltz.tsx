import React from 'react';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import StoreIcon from '@mui/icons-material/Store';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: '8px 0',
  color: theme.palette.primary.main,
  textDecoration: 'none',
}));

const StyledIcon = styled('div')({
  marginRight: '8px',
});

const StyledImage = styled('img')({
  maxWidth: '200px',
  width: '100%',
  height: 'auto',
  marginTop: '20px',
  marginRight: '20px',
  float: 'left',
});

const Content = styled('div')({
  overflow: 'auto',
});

const SecondWaltz: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom>セカンドワルツについて</Typography>
      <Content>
        <Typography variant="body1" gutterBottom>
          ちよじによるポッププログレバンドです。<br />
          サポートとして、現在古暮まちさんにボーカルをやってもらってます！
        </Typography>
        <StyledImage src="https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/IMG_0584.png" alt="Second Waltz" />
      </Content>
      <Box mt={4}>
        <Typography variant="h2" gutterBottom>宣伝リンク</Typography>
        <StyledLink href="https://x.com/second_waltz_" target="_blank" rel="noopener noreferrer">
          <StyledIcon>
            <TwitterIcon />
          </StyledIcon>
          Twitter
        </StyledLink>
        <StyledLink href="https://www.instagram.com/second.waltz.tokyo/" target="_blank" rel="noopener noreferrer">
          <StyledIcon>
            <InstagramIcon />
          </StyledIcon>
          Instagram
        </StyledLink>
        <StyledLink href="https://theromans.base.shop/" target="_blank" rel="noopener noreferrer">
          <StyledIcon>
            <StoreIcon />
          </StyledIcon>
          BASE
        </StyledLink>
        <StyledLink href="https://the-second-waltz.bandcamp.com/" target="_blank" rel="noopener noreferrer">
          <StyledIcon>
            <MusicNoteIcon />
          </StyledIcon>
          Bandcamp
        </StyledLink>
      </Box>
    </Layout>
  );
}

export default SecondWaltz;
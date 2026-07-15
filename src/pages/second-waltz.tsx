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
import { Link as GatsbyLink, useI18next } from 'gatsby-plugin-react-i18next';

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
  const { language } = useI18next();
  const isEnglish = language === 'en';
  return (
    <Layout>
      <Typography
        variant="h1"
        gutterBottom
        sx={{
          fontFamily: 'Dancing Script, cursive',
          color: '#E0BBE4', // 柔らかいパープル
          textShadow: '1px 1px 3px rgba(255,255,255,0.3)',
        }}
      >
        {isEnglish ? 'About Second Waltz' : 'セカンドワルツについて'}
      </Typography>
      <Content>
        <Typography variant="body1" paragraph sx={{ fontFamily: 'Lora, serif', color: '#D1E8E2' }}>
          {isEnglish
            ? 'Whimsical and pop, yet progressive. Our slightly mysterious musical world is colored by elements of jazz and classical music.'
            : 'メルヘンでポップ、だけどプログレッシブ。ジャズやクラシックのエッセンスも散りばめた、ちょっぴり不思議で贅沢な音世界をお届けします。'}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontFamily: 'Lora, serif', color: '#D1E8E2' }}>
          {isEnglish
            ? "Layered guitars and keyboards depict another waltz from Chiyoji's imagination, brought to life by guest musicians on saxophone, drums, and more."
            : 'ギターやキーボードを多重録音して描かれるのは、ちよじの心の中に広がるもうひとつのワルツ。サックスやドラムなど、豪華サポートメンバーによる生演奏が、音に命を吹き込みます。'}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontFamily: 'Lora, serif', color: '#D1E8E2' }}>
          {isEnglish ? 'We have many live performances planned—stay tuned!' : 'ライブもこれからたくさんやっていきますので、どうぞお楽しみに！'}
        </Typography>
        {/* <StyledImage src="https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/IMG_0584.png" alt="Second Waltz" /> */}
        {/* <StyledImage src="https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/second_waltz_%E3%83%84%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88.jpg" alt="Second Waltz" /> */}
      </Content>
      <Box mt={4}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontFamily: 'Dancing Script, cursive',
            color: '#E0BBE4',
          }}
        >
          {isEnglish ? 'Links' : '宣伝リンク'}
        </Typography>
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
      <Box mt={4}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontFamily: 'Dancing Script, cursive',
            color: '#E0BBE4',
          }}
        >
          {isEnglish ? 'Music' : '楽曲紹介'}
        </Typography>
        <GatsbyLink to="/music" language={language} style={{ color: '#FFB6C1', textDecoration: 'none' }}>
        {isEnglish ? 'Songs by Second Waltz ♬' : 'セカンドワルツの楽曲♬'}
        </GatsbyLink>
      </Box>
    </Layout>
  );
}

export default SecondWaltz;

import React from 'react';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link as GatsbyLink, useI18next } from 'gatsby-plugin-react-i18next';
import Link from '@mui/material/Link'; // MUI Link
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import StoreIcon from '@mui/icons-material/Store';
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

const PurgatorioPage: React.FC = () => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  return (
    <Layout>
      <Typography 
        variant="h1" 
        gutterBottom 
        sx={{
          fontFamily: 'Cinzel Decorative, cursive',
          color: '#B71C1C', // 深い赤色
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        Purgatorio
      </Typography>
      <Typography 
        variant="h2" 
        gutterBottom 
        sx={{
          fontFamily: 'Cinzel Decorative, cursive',
          color: '#9E9E9E', // 落ち着いた灰色
        }}
      >
        {isEnglish ? 'Sounds of Purgatory' : '煉獄の調べ'}
      </Typography>
      <Box mt={4}>
        <Typography variant="body1" paragraph sx={{ fontFamily: 'Cinzel Decorative, cursive', color: '#E0E0E0' }}>
          {isEnglish ? 'Purgatorio is a progressive rock band formed around CHIYOJI of Second Waltz and bassoonist Moja.' : 'セカンドワルツのCHIYOJIとファゴット奏者のMojaを中心に新たに結成されたプログレ・バンド Purgatorioです。'}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontFamily: 'Cinzel Decorative, cursive', color: '#E0E0E0' }}>
          {isEnglish ? 'Our music draws on Italian progressive rock, the Canterbury scene, free jazz, classical music, and more.' : 'イタリア、カンタベリー、フリージャズ、クラシックなど豊かな音楽の影響下です。'}
        </Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="h2" gutterBottom sx={{ fontFamily: 'Cinzel Decorative, cursive', color: '#9E9E9E' }}>{isEnglish ? 'Links' : '宣伝リンク'}</Typography>
        <StyledLink href="https://www.instagram.com/purgatorio.prog/" target="_blank" rel="noopener noreferrer">
          <StyledIcon>
            <InstagramIcon />
          </StyledIcon>
          Instagram
        </StyledLink>
        <StyledLink href="https://x.com/purgatorio_prog" target="_blank" rel="noopener noreferrer">
          <StyledIcon>
            <TwitterIcon />
          </StyledIcon>
          X
        </StyledLink>
        <StyledLink href="mailto:purgatorio.prog@gmail.com">
          <StyledIcon>
            <MailIcon />
          </StyledIcon>
          Gmail
        </StyledLink>
        <StyledLink href="https://purgatorio.base.ec/" target="_blank" rel="noopener noreferrer">
          <StyledIcon>
            <StoreIcon />
          </StyledIcon>
          BASE
        </StyledLink>
      </Box>
      <Box mt={4}>
        <Typography variant="h2" gutterBottom sx={{ fontFamily: 'Cinzel Decorative, cursive', color: '#9E9E9E' }}>{isEnglish ? 'Lyrics' : '歌詞'}</Typography>
        <GatsbyLink to="/music#purgatorio-section" language={language} style={{ color: '#FFB6C1', textDecoration: 'none' }}>
          {isEnglish ? 'View Purgatorio lyrics' : 'Purgatorioの歌詞一覧へ'}
        </GatsbyLink>
      </Box>
    </Layout>
  );
};

export default PurgatorioPage;

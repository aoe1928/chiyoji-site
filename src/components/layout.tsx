import React, { ReactNode, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import Footer from './footer';

type LayoutProps = {
  children: ReactNode;
}

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#FFB6C1', // 薄いピンク
  textDecoration: 'none',
  marginRight: '1rem',
}));

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Dancing+Script&family=Lora&family=Lobster&display=swap" rel="stylesheet" />
      </Helmet>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Link to="/" language={language} style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                background: 'linear-gradient(to right, #66ff66, #FFB6C1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              {isEnglish ? "Chiyoji's Website" : (data.site.siteMetadata?.title || 'ちよじのホームページ')}
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem sx={{ color: '#FFB6C1' }} onClick={handleMenuClose} component={Link} language={language} to="/">{isEnglish ? 'Home' : 'トップページ'}</MenuItem>
                <MenuItem sx={{ color: '#FFB6C1' }} onClick={handleMenuClose} component={Link} language={language} to="/blog">{isEnglish ? 'Blog' : 'ブログ'}</MenuItem>
                <MenuItem sx={{ color: '#FFB6C1' }} onClick={handleMenuClose} component={Link} language={language} to="/second-waltz">Second Waltz</MenuItem>
                <MenuItem sx={{ color: '#FFB6C1' }} onClick={handleMenuClose} component={Link} language={language} to="/purgatorio">Purgatorio</MenuItem>
                <MenuItem sx={{ color: '#FFB6C1' }} onClick={handleMenuClose} component={Link} language={language} to="/music">{isEnglish ? 'Music' : '楽曲紹介'}</MenuItem>
                <MenuItem sx={{ color: '#FFB6C1' }} onClick={handleMenuClose} component={Link} language={language} to="/about">{isEnglish ? 'About' : '自己紹介'}</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <StyledLink language={language} to="/">{isEnglish ? 'Home' : 'トップページ'}</StyledLink>
              <StyledLink language={language} to="/blog">{isEnglish ? 'Blog' : 'ブログ'}</StyledLink>
              <StyledLink language={language} to="/second-waltz">Second Waltz</StyledLink>
              <StyledLink language={language} to="/purgatorio">Purgatorio</StyledLink>
              <StyledLink language={language} to="/music">{isEnglish ? 'Music' : '楽曲紹介'}</StyledLink>
              <StyledLink language={language} to="/about">{isEnglish ? 'About' : '自己紹介'}</StyledLink>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <main>{children}</main>
        </Box>
        <Footer />
      </Container>
    </>
  );
}


export default Layout;

import React, { ReactNode, useState } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

type LayoutProps = {
  children: ReactNode;
}

const useStyles = makeStyles({
  link: {
    color: '#90caf9',
    textDecoration: 'none',
    marginRight: '1rem',
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
  },
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();
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
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            {data.site.siteMetadata?.title || 'ちよじのホームページ'}
          </Typography>
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
                <MenuItem onClick={handleMenuClose} component={Link} to="/">トップページ</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/search">ブログ検索</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/about">自己紹介</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/music">音源紹介</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link to="/" className={classes.link}>トップページ</Link>
              <Link to="/second-waltz" className={classes.link}>セカンドワルツ</Link>
              <Link to="/about" className={classes.link}>自己紹介</Link>
              <Link to="/music" className={classes.link}>音源紹介</Link>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <main>{children}</main>
        </Box>
        <footer className={classes.footer}>
          <Typography variant="body2">
            © {new Date().getFullYear()} ちよじのホームページ
          </Typography>
        </footer>
      </Container>
    </>
  );
}

export default Layout;
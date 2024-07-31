import React, { ReactNode } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
          <Link to="/" className={classes.link}>トップページ</Link>
          <Link to="/search" className={classes.link}>ブログ検索</Link>
          <Link to="/about" className={classes.link}>自己紹介</Link>
          <Link to="/music" className={classes.link}>音源紹介</Link>
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
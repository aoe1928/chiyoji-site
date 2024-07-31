import React from 'react';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import StoreIcon from '@mui/icons-material/Store';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  link: {
    display: 'flex',
    alignItems: 'center',
    margin: '8px 0',
    color: '#90caf9',
    textDecoration: 'none',
  },
  icon: {
    marginRight: '8px',
  },
  image: {
    maxWidth: '200px',
    width: '100%',
    height: 'auto',
    marginTop: '20px',
    marginRight: '20px',
    float: 'left',
  },
  content: {
    overflow: 'auto',
  },
});

const SecondWaltz: React.FC = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Typography variant="h1" gutterBottom>セカンドワルツについて</Typography>
      <div className={classes.content}>
        <Typography variant="body1" gutterBottom>
          ちよじによるポッププログレバンドです。<br />
          サポートとして、現在古暮まちさんにボーカルをやってもらってます！
        </Typography>
        <img src="https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/IMG_0584.png" alt="Second Waltz" className={classes.image} />
      </div>
      <Box mt={4}>
        <Typography variant="h2" gutterBottom>宣伝リンク</Typography>
        <Link href="https://x.com/second_waltz_" className={classes.link} target="_blank" rel="noopener noreferrer">
          <TwitterIcon className={classes.icon} />
          Twitter
        </Link>
        <Link href="https://www.instagram.com/second.waltz.tokyo/" className={classes.link} target="_blank" rel="noopener noreferrer">
          <InstagramIcon className={classes.icon} />
          Instagram
        </Link>
        <Link href="https://theromans.base.shop/" className={classes.link} target="_blank" rel="noopener noreferrer">
          <StoreIcon className={classes.icon} />
          BASE
        </Link>
        <Link href="https://the-second-waltz.bandcamp.com/" className={classes.link} target="_blank" rel="noopener noreferrer">
          <MusicNoteIcon className={classes.icon} />
          Bandcamp
        </Link>
      </Box>
    </Layout>
  );
}

export default SecondWaltz;
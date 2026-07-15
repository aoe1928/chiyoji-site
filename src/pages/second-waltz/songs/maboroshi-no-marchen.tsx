import React from 'react';
import Layout from '../../../components/layout';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import GatsbyLink from '../../../components/localized-link';

// Icons
import SpotifyIcon from '../../../components/icons/SpotifyIcon';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

// Lyrics
const lyrics = `これから先のストーリー、真っ白なページ
大好きな君の行方、二人の秘密さ

永遠は、儚い夢さ
でも僕は、信じる馬鹿さ

これから先のストーリー、真っ白なページ
たぶんこれは僕にとって、幻のメルヘン

ドレス着て、踊る乙女は
今とても、美しい瞳`;

const VideoContainer = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  paddingTop: '56.25%', // 16:9 Aspect Ratio
});

const ResponsiveIframe = styled('iframe')({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
});

const MaboroshiNoMarchenSongPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom sx={{ color: '#66ff66' }}>
        幻のメルヘン
      </Typography>
      <Typography variant="body1" paragraph>
        夢と現実の狭間を揺れる、どこか懐しくも新しい一曲。
      </Typography>
      <Box sx={{ maxWidth: { xs: '100%', md: '80%' }, margin: '0 auto' }}>
        <VideoContainer sx={{ mt: 2 }}>
          <ResponsiveIframe
            src="https://www.youtube.com/embed/DIZsrDfrccU"
            title="YouTube video player - 幻のメルヘン"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton component="a" href="https://open.spotify.com/intl-ja/track/74lZBcIT5j0ry7dQpEvBRY?si=95a39af1b95841f4" target="_blank" rel="noopener noreferrer">
          <SpotifyIcon />
        </IconButton>
        <IconButton component="a" href="https://music.apple.com/jp/song/%E5%B9%BB%E3%81%AE%E3%83%A1%E3%83%AB%E3%83%98%E3%83%B3/1807017987" target="_blank" rel="noopener noreferrer">
          <MusicNoteIcon sx={{ color: '#FFB6C1' }} />
        </IconButton>
      </Box>
      <Box mt={4}>
        <Typography variant="h2" gutterBottom>歌詞</Typography>
        <Paper elevation={1} sx={{ p: 2, whiteSpace: 'pre-wrap', backgroundColor: '#121212', overflowWrap: 'break-word' }}>
          <Typography component="pre" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
            {lyrics}
          </Typography>
        </Paper>
      </Box>
      <Box mt={4}>
        <GatsbyLink to="/music">← 楽曲紹介ページに戻る</GatsbyLink>
      </Box>
    </Layout>
  );
};

export default MaboroshiNoMarchenSongPage;

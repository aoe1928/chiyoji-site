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
const lyrics = `夏の日 虚しい気分
君は海を見つめて

潮風 君の髪が
揺れる、綺麗な瞳

サビ
明日 旅に出よう
さようならも言わずに
君は 幼すぎて
壊れそうな 僕の天使

砂漠の電車の中
宛先のない手紙

異国の会話を聞く
誰かが恋をしている

サビ
明日 旅に出よう
さようならも言わずに
君は 幼すぎて
壊れそうな 僕の天使

夏の日 虚しい気分
君は海を見つめて`;

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

const AugustLoverSongPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom sx={{ color: '#66ff66' }}>
        8月の恋人
      </Typography>
      <Typography variant="body1" paragraph>
        夏の終わりを思わせる、切なくも美しいバラード。
      </Typography>
      <Box sx={{ maxWidth: { xs: '100%', md: '80%' }, margin: '0 auto' }}>
        <VideoContainer sx={{ mt: 2 }}>
          <ResponsiveIframe
            src="https://www.youtube.com/embed/H-FXajoyF1g"
            title="YouTube video player - 8月の恋人"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton component="a" href="https://open.spotify.com/intl-ja/track/4ya7Ovg2D2fcXxtdQ6cu4J?si=fb6b1a7795604aac" target="_blank" rel="noopener noreferrer">
          <SpotifyIcon />
        </IconButton>
        <IconButton component="a" href="https://music.apple.com/jp/song/%E5%85%AB%E6%9C%88%E3%81%AE%E6%81%8B%E4%BA%BA/1703927147" target="_blank" rel="noopener noreferrer">
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

export default AugustLoverSongPage;

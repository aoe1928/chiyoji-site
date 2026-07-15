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
const lyrics = `ルールルル ルールル…

真夏の空が溶けたら 二人しかいない海辺
変わり果てた因果律だけど いつも通りのメロディー
つまらない電車の中 ゲームボーイで遊んだ
夢を見ているフリをするのも 意外と楽じゃないのよ

陽射しの中私 アイスを食べるの
瞳を閉じれば テレパス少女さ

振り向かないでね 知りたくないのよ
まだ眠りたい
わがまま少女の 旅は続く
虚空の ラビリンス

大人になること 諦めた方が
可愛くなれると 神さまが言ってた

振り向かないでね 知られたくないの
ズルい人なの
きまぐれ少女の 旅は続く
テレパスガール
テレパスガール
テレパス少女
 
あなたの未来を盗ませて uh—`;

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

const TelepathGirlSongPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom sx={{ color: '#66ff66' }}>
        テレパスガール
      </Typography>
      <Typography variant="body1" paragraph>
        セカンドワルツの代表曲、「テレパスガール」。
        浮遊感のあるサウンドと、どこか懐かしいメロディが特徴です。
      </Typography>
      <Box sx={{ maxWidth: { xs: '100%', md: '80%' }, margin: '0 auto' }}>
        <VideoContainer sx={{ mt: 2 }}>
          <ResponsiveIframe
            src="https://www.youtube.com/embed/VAt35sp3P8o"
            title="YouTube video player - テレパスガール"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton component="a" href="https://open.spotify.com/intl-ja/track/7bPDYjbjMaEe31tbftvJ5p?si=08f89e8ce4b54759" target="_blank" rel="noopener noreferrer">
          <SpotifyIcon />
        </IconButton>
        <IconButton component="a" href="https://music.apple.com/jp/song/%E3%83%86%E3%83%AC%E3%83%91%E3%82%B9%E3%82%AC%E3%83%BC%E3%83%AB/1703926963" target="_blank" rel="noopener noreferrer">
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

export default TelepathGirlSongPage;

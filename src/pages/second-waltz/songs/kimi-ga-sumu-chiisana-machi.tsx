import React from 'react';
import Layout from '../../../components/layout';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import GatsbyLink from '../../../components/localized-link';

// Lyrics
const lyrics = `寂しさを紛らわすために
大洗の港に来ました
ひまわり号一人きり
夜の海でビールを仰ぐ

カメラに収めてみたよ
黒潮カモメ、宮古の灯台
全てがモノクロに見えた
北風が吹いてきた

私はぬくもりなしで
生きていける自信がない
四駆を借り、道進む
廃駅に咲いてたコスモス

最果ての学童達
列車に乗って希望を繋ぐの
私の後ろ向きな夢
愛を知りたかったの
ごめんね、ありがとう

君が住む小さな街を
探し求めて疲れ果てた旅人よ
雪が降って
祈りは風に乗って

道の駅のレコードに
刻まれた時、不可逆な想い
色あせた夢を追って
終点のない道の
地平線、の向こうへ

君が住む小さな街を
探し求めて疲れ果てた旅人よ
雪が降って
祈りは風に乗って`;

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

const KimiGaSumuChiisanaMachiSongPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom sx={{ color: '#66ff66' }}>
        君が住む小さな街
      </Typography>
      <Typography variant="body1" paragraph>
        セカンドワルツの楽曲「君が住む小さな街」。
      </Typography>
      <Box sx={{ maxWidth: { xs: '100%', md: '80%' }, margin: '0 auto' }}>
        <VideoContainer sx={{ mt: 2 }}>
          <ResponsiveIframe
            src="https://www.youtube.com/embed/QTme_UYm554"
            title="YouTube video player - 君が住む小さな街"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>
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

export default KimiGaSumuChiisanaMachiSongPage;

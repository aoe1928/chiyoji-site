import React from 'react';
import Layout from '../../../components/layout';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import GatsbyLink from '../../../components/localized-link';

const lyrics = `夢は叶わないから
それは美しいのね
だから僕は君を
抱きしめて眠る

らーー らーらー

明日夢から醒めたあとどうしよう…

少し年上の君
が住んでいたあの国へ
ゴンドラで向かう
そしてまた眠る

※追加
間奏(オルガン)

明日夢から醒めたあとどうしよう...`;

const YumeWaKanawanaiSongPage: React.FC = () => (
  <Layout>
    <Typography variant="h1" gutterBottom sx={{ color: '#66ff66' }}>
      夢は叶わない
    </Typography>
    <Typography variant="body1" paragraph>
      セカンドワルツの楽曲「夢は叶わない」。
    </Typography>
    <Box mt={4}>
      <Typography variant="h2" gutterBottom>歌詞</Typography>
      <Paper elevation={1} sx={{ p: 2, backgroundColor: '#121212', overflowWrap: 'break-word' }}>
        <Typography component="pre" sx={{ fontFamily: 'inherit', fontSize: 'inherit', whiteSpace: 'pre-wrap' }}>
          {lyrics}
        </Typography>
      </Paper>
    </Box>
    <Box mt={4}>
      <GatsbyLink to="/music">← 楽曲紹介ページに戻る</GatsbyLink>
    </Box>
  </Layout>
);

export default YumeWaKanawanaiSongPage;

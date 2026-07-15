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
const lyrics = `君は綺麗だね、でも僕にはあまり　話しかけてくれないですね
ほんとはもう少し君と腹を割った　お話もしたいでも恥ずかしい

雨が降ってきた　傘をささずに線路沿い
散歩をしてる途中　重力から解き放れ　成層圏まで飛んでく

夢の中でみた君は世界で一番の恋人
君に出会えたことに感謝するよ来世もよろしく

空が晴れた　青空がときどき　壊れそうで泣きたくなるの
海がみたい　って仕事中にさ、　思ったから電車に乗った

ここはどこですか？　あたり一面の菜の花
世界の果ての岬で　神さま達が見えるよ　死神たちも囁く

夢の中でみた君は世界で一番の恋人
みんな大好きなの、令和はきっととても良い時代

夢の中でみた君は世界で一番綺麗だね
君に出会えたことに感謝するよ来世もよろしく

夢の中でみた君は世界で一番の恋人
疲れてきたからそろそろ僕は紅茶を飲んで寝る`;

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

const LiliENoKimochiSongPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom sx={{ color: '#66ff66' }}>
        リリィへの気もち
      </Typography>
      <Typography variant="body1" paragraph>
        セカンドワルツの楽曲「リリィへの気もち」。
        切ないメロディと歌詞が心に響く一曲です。ぜひお聴きください。
      </Typography>
      <Box sx={{ maxWidth: { xs: '100%', md: '80%' }, margin: '0 auto' }}>
        <VideoContainer sx={{ mt: 2 }}>
          <ResponsiveIframe
            src="https://www.youtube.com/embed/MNGH0OmyclM"
            title="YouTube video player - リリィへの気もち"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton component="a" href="https://open.spotify.com/intl-ja/track/1QlxXSkkODUguvCBq1lBzH?si=29a3bd31fb084a46" target="_blank" rel="noopener noreferrer">
          <SpotifyIcon />
        </IconButton>
        <IconButton component="a" href="https://music.apple.com/jp/album/my-feelings-for-lily/1703926962?i=1703927148" target="_blank" rel="noopener noreferrer">
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

export default LiliENoKimochiSongPage;

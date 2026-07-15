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
const lyrics = `二人で建てたお城
ときわのメルヘン

大きな犬を連れて
湖畔をドライブ
果樹園の少女

日傘が似合う君の
たくましい笑顔
寂れた分譲地は
二人だけの国
誰も触れない

Ｂ
明日はどこ行こう？
海辺の洋食屋とか
そのあと波止場へ
それともセコマで
ホットシェフ買ってハマナス
綺麗な公園

A
終わりの大地 廃墟
ノスタルジー

始まりの海 望む
朽ちてくニュータウン
二人の楽園

Ｂ
明日はどこ行こう？
海辺の洋食屋とか
そのあと波止場へ
それともセコマで
ホットシェフ買ってハマナス
綺麗な公園`;

const BunjochiNoMarchenSongPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom sx={{ fontFamily: 'Cinzel Decorative, cursive', color: '#B71C1C' }}>
        分譲地のメルヘン
      </Typography>
      <Typography variant="body1" paragraph>
        Purgatorioの楽曲「分譲地のメルヘン」。
        ノスタルジックな風景が目に浮かぶ、幻想的な一曲です。
      </Typography>
      <Box sx={{ maxWidth: { xs: '100%', md: '80%' }, margin: '0 auto' }}>
        {/* YouTube link not found */}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton component="a" href="https://open.spotify.com/intl-ja/track/2NVTBPfSmS4L2L88YqF2VG?si=e8f2d088310e48fc" target="_blank" rel="noopener noreferrer">
          <SpotifyIcon />
        </IconButton>
        {/* Apple Music link not found */}
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
        <Typography variant="h2" gutterBottom>コード</Typography>
        <Paper elevation={1} sx={{ p: 2, whiteSpace: 'pre-wrap', backgroundColor: '#121212', overflowWrap: 'break-word' }}>
          <Typography component="pre" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
            {`6/8 BPM145 Key Bb

イントロ

BbM7 Eb/F
×2

A
| BbM7 | Eb/F D7/F# |
| Gm D7/A | Gm |
| BbM7 | Eb/F D7/F# |
| Gm Gm/A Bb/Ab | EbM7 Dm7 Cm7 |
| Bb D7/A | Gm | Gm F |

| BbM7 | Eb/F D7/F# |
| Gm D7/A | Gm |
| BbM7 | Eb/F D7/F# |
| Gm Gm/A Bb/Ab | EbM7 Dm7 Cm7 |
| Bb D7/A | Gm | Gm |

B
| EbM7/F D7/F# | EbM7 D7 |
| Gm Bb9 | EM7 |
| Em6 Bb | Em6 D7 | Gm | |`}
          </Typography>
        </Paper>
      </Box>
      <Box mt={4}>
        <GatsbyLink to="/music">← 楽曲紹介ページに戻る</GatsbyLink>
      </Box>
    </Layout>
  );
};

export default BunjochiNoMarchenSongPage;

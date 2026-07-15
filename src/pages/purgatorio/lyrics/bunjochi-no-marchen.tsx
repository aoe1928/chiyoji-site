import React from 'react';
import Layout from '../../../components/layout';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import GatsbyLink from '../../../components/localized-link';

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

const BunjochiNoMarchenLyricsPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h1" gutterBottom sx={{ fontFamily: 'Cinzel Decorative, cursive', color: '#B71C1C' }}>
        分譲地のメルヘン
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, my: 4, whiteSpace: 'pre-wrap', backgroundColor: '#1e1e1e', overflowWrap: 'break-word' }}>
        <Typography component="pre" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
          {lyrics}
        </Typography>
      </Paper>
      <Box mt={4}>
        <GatsbyLink to="/purgatorio">← Purgatorioのページに戻る</GatsbyLink>
      </Box>
    </Layout>
  );
};

export default BunjochiNoMarchenLyricsPage;

import React from 'react';
import { graphql, withPrefix } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import GitHubIcon from '@mui/icons-material/GitHub';
import Layout from '../components/layout';

const repository = 'https://github.com/aoe1928/explorer-merge';
const download = `${repository}/releases/latest`;
const bodyStyle = { color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.9 };

const AppsPage: React.FC = () => {
  const { language } = useI18next();
  const en = language === 'en';
  const folders = en ? ['Documents', 'Photos', 'Work'] : ['資料', '写真', '作業'];
  const features = en ? [
    ['One click to tidy up', 'Reopens folders from separate Explorer windows as tabs in one window. Duplicate locations are kept, too.'],
    ['Only runs when needed', 'No installer, administrator rights or background service. Pin it to the taskbar and run it whenever windows pile up.'],
    ['Free and open source', 'Source code is available on GitHub under the MIT license. You can also build it using the tools included with Windows.'],
  ] : [
    ['クリックひとつで、ひとまとめ', '別々のウィンドウで開いていたフォルダーを、ひとつのウィンドウのタブにまとめます。同じ場所のタブもその数だけ残します。'],
    ['使いたいときだけ動く', 'インストーラーも管理者権限も不要。常駐せず、タスクバーに置いて、ウィンドウが増えたときだけ実行できます。'],
    ['無料・オープンソース', 'MITライセンスでソースを公開しています。Windows標準のツールで、自分のPCでビルドすることもできます。'],
  ];
  const steps = en ? [
    ['Download and extract', 'Download the ExplorerMerge ZIP from the GitHub release page and extract it to a folder you want to keep.'],
    ['Run ExplorerMerge.exe', 'Open a few File Explorer windows, then run the executable. Leave Explorer alone for a few seconds while it merges.'],
    ['Keep it on your taskbar', 'Right-click the executable and choose “Pin to taskbar” (sometimes under “Show more options”). Keep the file at the same location afterwards.'],
  ] : [
    ['ZIPをダウンロードして展開', 'GitHubのリリースページからExplorerMergeのZIPをダウンロードし、好きな場所に展開します。'],
    ['ExplorerMerge.exe を実行', 'エクスプローラーのウィンドウが増えたら実行。結合が終わるまで、数秒間エクスプローラーの操作を止めて待ちます。'],
    ['タスクバーに置く', 'exeを右クリックして「タスクバーにピン留めする」を選びます。「その他のオプションを確認」の中にある場合も。登録後は保存場所を変えずに使ってください。'],
  ];
  return (
    <Layout>
      <Helmet>
        <title>{en ? "Apps | Chiyoji's Website" : 'つくったアプリ | ちよじのホームページ'}</title>
        <meta name="description" content={en ? 'Small apps by Chiyoji. Explorer Merge combines Windows 11 File Explorer windows into native tabs. Free, open source and no installation needed.' : 'ちよじが作ったアプリの紹介。Windows 11のエクスプローラーを1クリックでまとめる、無料・常駐不要のExplorer Mergeを公開しています。'} />
      </Helmet>
      <Box sx={{ maxWidth: 1040, mx: 'auto', py: { xs: 2, md: 5 } }}>
        <Typography component="h1" sx={{ fontSize: 'clamp(2rem, 6vw, 3.4rem)', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(110deg, #66ff66 10%, #9cffaa 55%, #ffb6c1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {en ? 'Apps I made' : 'つくったアプリ'}
        </Typography>
        <Typography sx={{ ...bodyStyle, mt: 1.5, mb: { xs: 4, md: 6 } }}>
          {en ? 'Small tools for the little things that get in the way.' : '日々の「ちょっと不便」を、少し楽にする道具。'}
        </Typography>

        <Box component="article" id="explorer-merge" sx={{ scrollMarginTop: 24, borderTop: '1px solid rgba(102,255,102,0.35)', pt: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px minmax(0,1fr)' }, gap: { xs: 2, md: 5 }, alignItems: 'center' }}>
            <Box component="img" src={withPrefix('/apps/explorer-merge.png')} alt={en ? 'Explorer Merge: a purple-haired character holding a folder' : 'フォルダーを抱えた、紫の髪のExplorer Mergeのキャラクター'} width={512} height={512} sx={{ width: { xs: 168, md: 220 }, height: 'auto', justifySelf: { xs: 'center', md: 'start' } }} />
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {['Windows 11', en ? 'Free' : '無料', 'MIT / OSS'].map(label => <Chip key={label} label={label} size="small" sx={{ color: '#b9ffbd', bgcolor: 'rgba(102,255,102,0.07)', border: '1px solid rgba(102,255,102,0.2)', fontSize: '0.875rem' }} />)}
              </Box>
              <Typography component="h2" sx={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 850, color: '#fff', lineHeight: 1.2 }}>Explorer Merge</Typography>
              <Typography sx={{ fontSize: { xs: '1.15rem', md: '1.4rem' }, fontWeight: 700, color: '#ffb6c1', mt: 2, mb: 1.5, lineHeight: 1.6 }}>
                {en ? 'Too many windows? Bring them together.' : '増えすぎたウィンドウを、ひとつに。'}
              </Typography>
              <Typography sx={bodyStyle}>{en ? 'A one-click tool that combines File Explorer windows into native Windows 11 tabs.' : 'Windows 11のエクスプローラーを、クリックひとつでタブにまとめるツールです。'}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
                <Button component="a" href={download} variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: '#b9ffbd', color: '#102016', fontWeight: 800, fontSize: '1rem', px: 2.5, py: 1.25, textTransform: 'none', '&:hover': { bgcolor: '#93f99b' } }}>{en ? 'Free download' : '無料でダウンロード'}</Button>
                <Button component="a" href={repository} variant="outlined" startIcon={<GitHubIcon />} sx={{ fontSize: '1rem', textTransform: 'none', px: 2, py: 1.25 }}>GitHub</Button>
              </Box>
              <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', mt: 1.5 }}>{en ? 'Windows 11 22H2 or later · No installer · No background service' : 'Windows 11 22H2以降対応・インストーラー不要・常駐なし'}</Typography>
            </Box>
          </Box>

          <Box component="figure" sx={{ mx: 0, my: { xs: 4, md: 5 }, p: { xs: 2, sm: 3 }, bgcolor: '#191c1c', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' }, gap: 3, alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1.5 }}>{en ? 'Separate windows' : 'ばらばらのウィンドウ'}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {folders.map((name, index) => <Box key={name} sx={{ ml: `${index * 8}%`, mr: `${(2 - index) * 8}%`, border: '1px solid #555b5b', borderRadius: 1, px: 2, py: 1, fontSize: '0.95rem', bgcolor: '#262b2b' }}>{name}</Box>)}
                </Box>
              </Box>
              <Typography aria-hidden="true" sx={{ color: '#b9ffbd', fontSize: '1.75rem', textAlign: 'center', transform: { xs: 'rotate(90deg)', sm: 'none' } }}>→</Typography>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#b9ffbd', mb: 1.5 }}>{en ? 'One window, all your tabs' : 'ひとつのウィンドウに、タブで整理'}</Typography>
                <Box sx={{ border: '1px solid #78ba84', borderRadius: 1, overflow: 'hidden', bgcolor: '#222b25' }}>
                  <Box sx={{ display: 'flex', gap: 0.5, px: 1, pt: 1, flexWrap: 'wrap', borderBottom: '1px solid #49604e' }}>
                    {folders.map((name, index) => <Box key={name} sx={{ px: 1.25, py: 0.75, borderRadius: '5px 5px 0 0', bgcolor: index === 0 ? '#b9ffbd' : '#36483b', color: index === 0 ? '#102016' : '#fff', fontSize: '0.875rem' }}>{name}</Box>)}
                  </Box>
                  <Box aria-hidden="true" sx={{ p: 2.5, display: 'grid', gap: 1 }}>{[72, 50, 62].map(width => <Box key={width} sx={{ width: `${width}%`, height: 6, bgcolor: '#627d69', borderRadius: 1 }} />)}</Box>
                </Box>
              </Box>
            </Box>
            <Typography component="figcaption" sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 2, textAlign: 'right' }}>{en ? 'Illustration of the merge' : '結合のイメージ'}</Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,minmax(0,1fr))' }, gap: 3, mb: 5 }}>
            {features.map(([title, text]) => <Box key={title}><Typography component="h3" sx={{ fontSize: '1.1rem', fontWeight: 800, mb: 1, color: '#b9ffbd' }}>{title}</Typography><Typography sx={bodyStyle}>{text}</Typography></Box>)}
          </Box>

          <Box component="section" sx={{ borderTop: '1px solid rgba(255,255,255,0.12)', pt: 4 }}>
            <Typography component="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, mb: 3 }}>{en ? 'How to use it' : '使い方'}</Typography>
            <Box component="ol" sx={{ pl: 3, m: 0, display: 'grid', gap: 2.5, '& li::marker': { color: '#b9ffbd', fontWeight: 800 } }}>
              {steps.map(([title, text]) => <Box component="li" key={title} sx={{ pl: 1 }}><Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>{title}</Typography><Typography sx={bodyStyle}>{text}</Typography></Box>)}
            </Box>
            <Box sx={{ mt: 4, p: 2.5, borderLeft: '3px solid #ffb6c1', bgcolor: 'rgba(255,182,193,0.045)' }}>
              <Typography sx={{ ...bodyStyle, fontSize: '0.95rem' }}>{en ? 'Folders are reopened in new tabs, so back/forward history, file selections and scroll positions are not transferred. The destination is briefly minimized while merging. Windows whose locations cannot be verified are kept open. Some folders or future Windows updates may be unsupported.' : 'フォルダーをタブで開き直す方式のため、戻る・進むの履歴、ファイルの選択、スクロール位置は引き継ぎません。結合中は一時的に最小化し、開けたことを確認できないウィンドウは残します。一部のフォルダーやWindowsの更新によっては動かない場合があります。'}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default AppsPage;

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges { node { ns data language } }
    }
  }
`;

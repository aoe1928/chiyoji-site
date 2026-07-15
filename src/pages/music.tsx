import React from 'react';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import LocalizedLink from '../components/localized-link';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const backgroundImageUrl = 'https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/81O1AoX1MEL._AC_SL1500_.jpg';

const AlbumArt = styled('img')({
  width: '60px',
  height: '60px',
  borderRadius: '4px',
  marginRight: '16px',
});

const StyledSongLink = styled(LocalizedLink)({
  color: '#FFB6C1',
  textDecoration: 'none',
  fontSize: '1.2rem',
  display: 'flex',
  alignItems: 'center',
});

// const secondWaltzArt = "https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/second_waltz_chara.gif";
const purgatorioArt = "https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/thumbnail%20(1).jpeg";
const telepathGirlArt = "https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/telepathgirl_mini.jpg";
const maboroshinomeruhenArt = "https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/%E5%B9%BB%E3%81%AE%E3%83%A1%E3%83%AB%E3%83%98%E3%83%B3_mini.jpg";
const mamemoireArt = "https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/Ma%20Me%CC%81moire_mini.jpg";

const telepathGirlSongs = [
  { to: "/second-waltz/songs/lili-e-no-kimochi", title: "リリィへの気もち" },
  { to: "/second-waltz/songs/telepath-girl", title: "テレパスガール" },
  { to: "/second-waltz/songs/august-lover", title: "8月の恋人" },
]

const mamemoireSongs = [
  { to: "/second-waltz/songs/kimi-ga-sumu-chiisana-machi", title: "君が住む小さな街" },
]

const maboroshinomeruhenSongs = [
  { to: "/second-waltz/songs/maboroshi-no-marchen", title: "幻のメルヘン" },
]

const purgatorioSongs = [
  { to: "/purgatorio/songs/bunjochi-no-marchen", title: "分譲地のメルヘン" },
];


const SongIntroductionPage: React.FC = () => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  return (
    <Layout>
      {/* Mobile Background */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          opacity: 0.2,
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Box sx={{ display: 'flex' }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h1" gutterBottom>
            {isEnglish ? 'Music' : '楽曲紹介'}
          </Typography>

          {/* セカンドワルツ */}
          <Typography variant="h2" gutterBottom sx={{ mt: 4, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
            {isEnglish ? 'Second Waltz' : 'セカンドワルツ'}
          </Typography>
          {telepathGirlSongs.map((song) => (
            <Box mt={2} key={song.to}>
              <StyledSongLink to={song.to}>
                <AlbumArt src={telepathGirlArt} alt={song.title} />
                {song.title}
              </StyledSongLink>
            </Box>
          ))}
          {mamemoireSongs.map((song) => (
            <Box mt={2} key={song.to}>
              <StyledSongLink to={song.to}>
                <AlbumArt src={mamemoireArt} alt={song.title} />
                {song.title}
              </StyledSongLink>
            </Box>
          ))}
          {maboroshinomeruhenSongs.map((song) => (
            <Box mt={2} key={song.to}>
              <StyledSongLink to={song.to}>
                <AlbumArt src={maboroshinomeruhenArt} alt={song.title} />
                {song.title}
              </StyledSongLink>
            </Box>
          ))}

          {/* Purgatorio */}
          <Typography id="purgatorio-section" variant="h2" gutterBottom sx={{ mt: 9, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
            Purgatorio
          </Typography>
          {purgatorioSongs.map((song) => (
            <Box mt={2} key={song.to}>
              <StyledSongLink to={song.to}>
                <AlbumArt src={purgatorioArt} alt={song.title} />
                {song.title}
              </StyledSongLink>
            </Box>
          ))}
        </Box>

        {/* Desktop Background Image */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: '40%',
            ml: 4,
            height: 'calc(100vh - 150px)', // Adjust height to avoid overlapping footer
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center right',
          }}
        />
      </Box>
    </Layout>
  );
};

export default SongIntroductionPage;

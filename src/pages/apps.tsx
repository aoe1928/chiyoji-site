import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Layout from '../components/layout';
import LocalizedLink from '../components/localized-link';
import { tools } from '../components/more-tools';
const apps = [{ id: 'explorer-merge', name: 'Explorer Merge', platform: 'Windows 11', text: ['Windows 11のエクスプローラーを、クリックひとつでタブにまとめるツールです。', 'Combine Windows 11 File Explorer windows into native tabs with one click.'] }, ...tools];
export default function AppsPage() {
  const { language } = useI18next();
  const en = language === 'en';
  return <Layout>
    <Helmet><title>{en ? "Apps | Chiyoji's Website" : 'つくったアプリ | ちよじのホームページ'}</title><meta name="description" content={en ? 'Explore five tools by Chiyoji for Windows, music production, images and macOS.' : 'Windows、音楽制作、画像変換、Mac向けに作った5つのツールを紹介。各アプリの詳しい使い方と配布先はこちら。'} /></Helmet>
    <Box sx={{ maxWidth: 1040, mx: 'auto', py: { xs: 2, md: 5 } }}>
      <Typography component="h1" sx={{ fontSize: 'clamp(2rem, 6vw, 3.4rem)', fontWeight: 900, color: '#9cffaa' }}>{en ? 'Apps I made' : 'つくったアプリ'}</Typography>
      <Typography sx={{ mt: 1.5, mb: 4, lineHeight: 1.9 }}>{en ? 'Small tools for the little things that get in the way.' : '日々の「ちょっと不便」を、少し楽にする道具。'}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3 }}>
        {apps.map(app => <Box component="article" id={app.id} key={app.id} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid rgba(102,255,102,0.25)', borderRadius: 2, bgcolor: '#191c1c', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', scrollMarginTop: 24 }}>
          <Chip label={app.platform} size="small" sx={{ color: '#b9ffbd', bgcolor: 'rgba(102,255,102,0.07)', mb: 2 }} />
          <Typography component="h2" sx={{ fontSize: '1.8rem', fontWeight: 850, mb: 1.5 }}><LocalizedLink to={'/apps/' + app.id + '/'} style={{ color: 'inherit', textDecoration: 'none' }}>{app.name}</LocalizedLink></Typography>
          <Typography sx={{ lineHeight: 1.9, mb: 3 }}>{app.text[en ? 1 : 0]}</Typography>
          <Button component={LocalizedLink} to={'/apps/' + app.id + '/'} variant="outlined" sx={{ mt: 'auto', textTransform: 'none' }} aria-label={en ? 'More about ' + app.name : app.name + 'の詳細を見る'}>{en ? 'View details →' : '詳しく見る →'}</Button>
        </Box>)}
      </Box>
    </Box>
  </Layout>;
}
export const query = graphql`query($language: String!) { locales: allLocale(filter: {language: {eq: $language}}) { edges { node { ns data language } } } }`;

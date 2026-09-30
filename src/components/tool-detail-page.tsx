import React from 'react';
import { Helmet } from 'react-helmet';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Layout from './layout';
import LocalizedLink from './localized-link';
import MoreTools, { tools } from './more-tools';
export default function ToolDetailPage({ id }: { id: string }) {
  const { language } = useI18next();
  const en = language === 'en';
  const tool = tools.find(item => item.id === id)!;
  return <Layout>
    <Helmet><title>{tool.name} | {en ? "Chiyoji's Website" : 'ちよじのホームページ'}</title><meta name="description" content={tool.text[en ? 1 : 0]} /></Helmet>
    <Box sx={{ maxWidth: 1040, mx: 'auto', py: { xs: 2, md: 5 } }}>
      <Button component={LocalizedLink} to="/apps/" sx={{ mb: 3 }}>{en ? '← All apps' : '← つくったアプリ一覧'}</Button>
      <MoreTools en={en} id={id} />
    </Box>
  </Layout>;
}

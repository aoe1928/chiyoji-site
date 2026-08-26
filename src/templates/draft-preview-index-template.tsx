import React from 'react';
import { Link } from 'gatsby';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';
import DraftPreviewGate from '../components/draft-preview-gate';
import Layout from '../components/layout';

type Draft = {
  date: string;
  previewSlug: string;
  title: string;
};

type Props = {
  pageContext: {
    drafts: Draft[];
  };
};

const DraftPreviewIndexTemplate: React.FC<Props> = ({ pageContext }) => {
  const drafts = pageContext.drafts || [];

  return (
    <DraftPreviewGate description="保存済みの下書き一覧を見るには、合言葉を入力してください。">
      <Layout>
        <Helmet>
          <title>下書き一覧 | ちよじのホームページ</title>
          <meta name="robots" content="noindex,nofollow,noarchive" />
        </Helmet>
        <Box sx={{ maxWidth: 760, mx: 'auto', py: { xs: 4, sm: 7 } }}>
          <Typography variant="h1" sx={{ color: '#66ff66', mb: 1 }}>
            下書き一覧
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            投稿画面で保存すると、記事名とプレビューリンクがここへ自動で追加されます。
          </Typography>

          {drafts.length === 0 ? (
            <Paper sx={{ p: 3 }}>
              <Typography>現在、保存済みの下書きはありません。</Typography>
            </Paper>
          ) : drafts.map(draft => (
            <Paper key={draft.previewSlug} sx={{ p: 3, mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {draft.date}
              </Typography>
              <Typography variant="h2" sx={{ fontSize: '1.35rem', mt: 0.5, mb: 2 }}>
                {draft.title}
              </Typography>
              <Button
                component={Link}
                to={`/preview/${draft.previewSlug}/`}
                variant="contained"
              >
                プレビューを開く
              </Button>
            </Paper>
          ))}

          <Button component="a" href="/admin/" sx={{ mt: 2 }}>
            投稿画面に戻る
          </Button>
        </Box>
      </Layout>
    </DraftPreviewGate>
  );
};

export default DraftPreviewIndexTemplate;

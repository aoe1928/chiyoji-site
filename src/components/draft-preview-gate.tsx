import React, { FormEvent, ReactNode, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';
import Layout from './layout';

const DRAFT_PREVIEW_HASH = 'de0366a7e7978b430a3bda24884f6a18600ea9afb1a29387b49d476baf419bde';
const DRAFT_PREVIEW_SESSION_KEY = 'chiyoji-draft-preview-unlocked';

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value.normalize('NFKC'));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

type Props = {
  children: ReactNode;
  description?: string;
};

const DraftPreviewGate: React.FC<Props> = ({
  children,
  description = '下書きを見るには合言葉を入力してください。',
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setUnlocked(window.sessionStorage.getItem(DRAFT_PREVIEW_SESSION_KEY) === '1');
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const candidateHash = await sha256(passphrase);
    if (candidateHash !== DRAFT_PREVIEW_HASH) {
      setError('合言葉が違います。');
      return;
    }

    window.sessionStorage.setItem(DRAFT_PREVIEW_SESSION_KEY, '1');
    setError('');
    setUnlocked(true);
  };

  const handleLock = () => {
    window.sessionStorage.removeItem(DRAFT_PREVIEW_SESSION_KEY);
    setPassphrase('');
    setUnlocked(false);
  };

  if (!unlocked) {
    return (
      <Layout>
        <Helmet>
          <title>下書きプレビュー | ちよじのホームページ</title>
          <meta name="robots" content="noindex,nofollow,noarchive" />
        </Helmet>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={6}
          sx={{ maxWidth: 520, mx: 'auto', mt: { xs: 6, sm: 10 }, p: { xs: 3, sm: 5 } }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 2 }}>
            下書きプレビュー
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            fullWidth
            label="合言葉"
            type="password"
            value={passphrase}
            onChange={event => setPassphrase(event.target.value)}
            autoComplete="off"
          />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
            プレビューを見る
          </Button>
          <Button fullWidth component="a" href="/admin/" sx={{ mt: 1 }}>
            投稿画面に戻る
          </Button>
        </Paper>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Helmet>
      <Alert
        severity="warning"
        action={<Button color="inherit" size="small" onClick={handleLock}>ロック</Button>}
        sx={{ borderRadius: 0 }}
      >
        下書きプレビューです。通常のブログ一覧には表示されません。
      </Alert>
      {children}
    </>
  );
};

export default DraftPreviewGate;

import React from 'react';
import { graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import { MDXProvider } from '@mdx-js/react';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import MDXComponents from '../components/MDXComponents';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkIcon from '@mui/icons-material/Link';
import { makeStyles } from '@mui/styles';
import CategoryTrail from '../components/category-trail';
import DraftPreviewGate from '../components/draft-preview-gate';

type Props = {
  data: {
    allMdx: {
      nodes: Array<{
        id: string;
      frontmatter: {
        title: string;
        date: string;
          photo: string[];
          lang?: string;
          categories?: string[];
      };
      body: string;
      fields: {
        slug: string;
      };
      }>;
    };
  };
  pageContext?: {
    draftPreview?: boolean;
  };
};

const useStyles = makeStyles({
  shareButton: {
    margin: '0 8px',
  },
});

const normalizeArticleImageSrc = (src: string) => {
  const normalized = src.replace(/\\/g, '/');
  const match = normalized.match(/^(?:\/)?static\/images\/blog\/(.+)$/i);
  return match ? `/images/blog/${match[1]}` : normalized;
};

const PostTemplate: React.FC<Props> = ({ data, pageContext }) => {
    const { language } = useI18next();
    const localizedPost = data.allMdx.nodes.find(({ frontmatter }) =>
      language === 'en' ? frontmatter.lang === 'en' : frontmatter.lang !== 'en'
    ) || data.allMdx.nodes[0];
    const basePost = data.allMdx.nodes.find(({ frontmatter }) => frontmatter.lang !== 'en')
      || localizedPost;
    const { frontmatter, body, fields } = localizedPost;
    const categories = basePost.frontmatter.categories;
    //   const url = `${process.env.GATSBY_SITE_URL}${fields.slug}`;
    const url = `https://www.aoe1928.com${language === 'en' ? '/en' : ''}${fields.slug}`;
    const title = frontmatter.title;
  // const photo = frontmatter.photo;
  const { photo } = frontmatter;
    const classes = useStyles();

    type FullWidthImageProps = {
      src: string;
      alt?: string;
      title?: string;
    };

    const ArticleImage: React.FC<FullWidthImageProps> = ({ src, alt, title }) => {
      const imageSrc = normalizeArticleImageSrc(src);
      return (
      <Box
        component="span"
        sx={{
          display: 'block',
          width: '100%',
          maxWidth: '520px',
          my: { xs: 3, sm: 4 },
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Box
          component="a"
          href={imageSrc}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={alt ? `${alt}（原寸画像を開く）` : '原寸画像を開く'}
          sx={{
            display: 'block',
            p: { xs: 0.75, sm: 1 },
            borderRadius: '14px',
            border: '1px solid rgba(255, 182, 193, 0.32)',
            backgroundColor: 'rgba(255, 255, 255, 0.035)',
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.35)',
            lineHeight: 0,
            transition: 'transform 180ms ease, box-shadow 180ms ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 18px 42px rgba(0, 0, 0, 0.45)',
            },
            '&:focus-visible': {
              outline: '2px solid #FFB6C1',
              outlineOffset: '4px',
            },
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={alt || title || ''}
            title={title}
            loading="lazy"
            sx={{
              display: 'block',
              width: 'auto',
              maxWidth: '100%',
              maxHeight: { xs: '68vh', sm: '72vh' },
              height: 'auto',
              mx: 'auto',
              borderRadius: '9px',
              objectFit: 'contain',
            }}
          />
        </Box>
        {title && (
          <Typography
            component="span"
            variant="caption"
            sx={{ display: 'block', mt: 1.25, color: 'text.secondary', lineHeight: 1.5 }}
          >
            {title}
          </Typography>
        )}
      </Box>
      );
    };

    const FullWidthImage: React.FC<FullWidthImageProps> = ({ src, alt, title }) => (
      <ArticleImage src={src} alt={alt} title={title} />
    );
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            alert(language === 'en' ? 'URL copied to clipboard' : 'URLがクリップボードにコピーされました');
        });
    };

    const LinkRenderer = ({ href, children }) => {
      const linkStyle = { color: '#66ff66' };
      // 外部リンクの場合は新しいタブで開く
      if (href.startsWith('http')) {
        return <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>{children}</a>;
      }
      // 内部リンクはGatsbyのLinkを使用
      return <Link to={href} language={language} style={linkStyle}>{children}</Link>;
    };

    const ArticleH1 = ({ children }) => (
      <Typography
        component="h1"
        sx={{
          maxWidth: '920px',
          mx: 'auto',
          mt: { xs: 5, sm: 7 },
          mb: { xs: 3, sm: 4 },
          textAlign: 'center',
          fontSize: 'clamp(1.9rem, 5vw, 3.5rem)',
          fontWeight: 850,
          lineHeight: 1.18,
          letterSpacing: '-0.025em',
          overflowWrap: 'anywhere',
          textWrap: 'balance',
          background: 'linear-gradient(110deg, #66ff66 15%, #b5ffbd 58%, #ffb6c1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {children}
      </Typography>
    );

    const ArticleH2 = ({ children }) => (
      <Typography
        component="h2"
        sx={{
          maxWidth: '760px',
          mx: 'auto',
          mt: { xs: 6, sm: 8 },
          mb: { xs: 3, sm: 4 },
          px: 2,
          textAlign: 'center',
          color: '#f7fff7',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 800,
          lineHeight: 1.35,
          letterSpacing: '0.01em',
          textWrap: 'balance',
          '&::after': {
            content: '""',
            display: 'block',
            width: '72px',
            height: '3px',
            mx: 'auto',
            mt: 1.5,
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #66ff66, #ffb6c1)',
          },
        }}
      >
        {children}
      </Typography>
    );

  const article = (
    <Layout>
      <Box display="flex" alignItems="center">
        <Link to="/" language={language} style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton aria-label="戻る">
            <ArrowBackIcon />
            <Typography variant="button" display="block" gutterBottom>BACK</Typography>
          </IconButton>
        </Link>
      </Box>
      <Box component="header" sx={{ maxWidth: '980px', mx: 'auto', mb: { xs: 4, sm: 5 }, textAlign: 'center' }}>
        <Typography
          component="h1"
          sx={{
            maxWidth: '940px',
            mx: 'auto',
            mb: 2,
            fontSize: 'clamp(2rem, 5.2vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.14,
            letterSpacing: '-0.035em',
            overflowWrap: 'anywhere',
            textWrap: 'balance',
            background: 'linear-gradient(110deg, #66ff66 10%, #9cffaa 58%, #ffb6c1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {frontmatter.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: '0.08em' }}>
          {frontmatter.date}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CategoryTrail categories={categories} />
        </Box>
      </Box>
      <MDXProvider components={MDXComponents}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ a: LinkRenderer, img: ArticleImage, h1: ArticleH1, h2: ArticleH2 }}
        >
          {body}
        </ReactMarkdown>
      </MDXProvider>
      {/* {photo && <FullWidthImage src={photo} alt='' />} */}
      {photo && photo.length > 0 && photo.map((imgSrc, index) => (
        <FullWidthImage key={index} src={imgSrc} alt={`image-${index}`} />
      ))}
      {!pageContext?.draftPreview && <Box mt={4} display="flex" justifyContent="center">
        <IconButton
          className={classes.shareButton}
          component="a"
          href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          className={classes.shareButton}
          component="a"
          href={`https://www.instagram.com/?url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Instagram"
        >
          <InstagramIcon />
        </IconButton>

        <IconButton
          className={classes.shareButton}
          onClick={handleCopyToClipboard}
          aria-label="Copy URL to clipboard"
        >
          <LinkIcon />
        </IconButton>

      </Box>}
    </Layout>
  );

  return pageContext?.draftPreview
    ? <DraftPreviewGate>{article}</DraftPreviewGate>
    : article;
};

export const query = graphql`
  query($slug: String!, $language: String!) {
    allMdx(filter: { fields: { slug: { eq: $slug } } }) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          photo
          lang
          categories
        }
        body
        fields {
          slug
        }
      }
    }
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default PostTemplate;

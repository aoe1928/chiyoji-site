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
};

const useStyles = makeStyles({
  shareButton: {
    margin: '0 8px',
  },
});

const PostTemplate: React.FC<Props> = ({ data }) => {
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
    };

    const ArticleImage: React.FC<FullWidthImageProps> = ({ src, alt }) => (
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
          href={src}
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
            src={src}
            alt={alt || ''}
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
        {alt && (
          <Typography
            component="span"
            variant="caption"
            sx={{ display: 'block', mt: 1.25, color: 'text.secondary', lineHeight: 1.5 }}
          >
            {alt}
          </Typography>
        )}
      </Box>
    );

    const FullWidthImage: React.FC<FullWidthImageProps> = ({ src, alt }) => (
      <ArticleImage src={src} alt={alt} />
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

  return (
    <Layout>
      <Box display="flex" alignItems="center">
        <Link to="/" language={language} style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton aria-label="戻る">
            <ArrowBackIcon />
            <Typography variant="button" display="block" gutterBottom>BACK</Typography>
          </IconButton>
        </Link>
      </Box>
      <Typography variant="h1" gutterBottom sx={{ color: '#66ff66' }}>{frontmatter.title}</Typography>
      <Typography variant="subtitle1" gutterBottom>{frontmatter.date}</Typography>
      <CategoryTrail categories={categories} />
      <MDXProvider components={MDXComponents}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ a: LinkRenderer, img: ArticleImage }}
        >
          {body}
        </ReactMarkdown>
      </MDXProvider>
      {/* {photo && <FullWidthImage src={photo} alt='' />} */}
      {photo && photo.length > 0 && photo.map((imgSrc, index) => (
        <FullWidthImage key={index} src={imgSrc} alt={`image-${index}`} />
      ))}
      <Box mt={4} display="flex" justifyContent="center">
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

      </Box>
    </Layout>
  );
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

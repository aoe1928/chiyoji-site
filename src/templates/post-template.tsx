import React from 'react';
import { graphql, Link } from 'gatsby';
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

type Props = {
  data: {
    mdx: {
      frontmatter: {
        title: string;
        date: string;
      };
      body: string;
      fields: {
        slug: string;
      };
    };
  };
};

const useStyles = makeStyles({
  shareButton: {
    margin: '0 8px',
  },
});

const PostTemplate: React.FC<Props> = ({ data }) => {
    const { frontmatter, body, fields } = data.mdx;
    //   const url = `${process.env.GATSBY_SITE_URL}${fields.slug}`;
    const url = `https://aoe1928.com${fields.slug}`;
    const title = frontmatter.title;
    const classes = useStyles();
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            alert('URLがクリップボードにコピーされました');
        });
    };

  return (
    <Layout>
      <Box display="flex" alignItems="center">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton aria-label="戻る">
            <ArrowBackIcon />
            <Typography variant="button" display="block" gutterBottom>BACK</Typography>
          </IconButton>
        </Link>
      </Box>
      <Typography variant="h1" gutterBottom>{frontmatter.title}</Typography>
      <Typography variant="subtitle1" gutterBottom>{frontmatter.date}</Typography>
      <MDXProvider components={MDXComponents}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {body}
        </ReactMarkdown>
      </MDXProvider>
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
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
      body
      fields {
        slug
      }
    }
  }
`;

export default PostTemplate;
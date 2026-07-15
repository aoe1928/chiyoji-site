import React from 'react';
import { graphql, PageProps } from 'gatsby';
import LocalizedLink from '../components/localized-link';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import { useI18next } from 'gatsby-plugin-react-i18next';

const useStyles = makeStyles({
  blogTitle: {
    fontSize: '1.8rem',
  },
  blogDate: {
    fontSize: '0.875rem',
    color: 'gray',
  },
  sidebar: {
    width: '200px',
    float: 'left',
  },
  content: {
    marginLeft: '220px',
  },
});

type NodeProps = {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    date: string;
  };
  excerpt: string;
  englishTranslation?: {
    frontmatter: {
      title: string;
      date: string;
    };
    excerpt: string;
  } | null;
};

type PageContextProps = {
  month: string;
  posts: {
    node: NodeProps;
  }[];
};

const MonthlyArchiveTemplate: React.FC<PageProps<{}, PageContextProps>> = ({ pageContext }) => {
  const classes = useStyles();
  const posts = pageContext.posts;
  const month = pageContext.month;
  const { language } = useI18next();
  const isEnglish = language === 'en';

  return (
    <Layout>
      <div className={classes.sidebar}>
        <Typography variant="h6" gutterBottom>{isEnglish ? 'Archive' : 'アーカイブ'}</Typography>
        <List>
          {/* 他の月のリンクをここに追加 */}
        </List>
      </div>
      <div className={classes.content}>
        <Typography variant="h1" gutterBottom>{isEnglish ? `Posts from ${month}` : `${month} のブログ記事`}</Typography>
        <List>
          {posts.map(({ node }) => {
            const displayedPost = isEnglish && node.englishTranslation
              ? node.englishTranslation
              : node;
            return (
            <ListItem key={node.id} button component={LocalizedLink} to={node.fields.slug}>
              <ListItemText
                primary={<span className={classes.blogTitle}>{displayedPost.frontmatter.title}</span>}
                secondary={
                  <span>
                    <span className={classes.blogDate}>{displayedPost.frontmatter.date}</span>
                    <br />
                    {displayedPost.excerpt}
                  </span>
                }
              />
            </ListItem>
            );
          })}
        </List>
      </div>
    </Layout>
  );
};

export default MonthlyArchiveTemplate;

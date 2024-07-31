import React from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';

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

  return (
    <Layout>
      <div className={classes.sidebar}>
        <Typography variant="h6" gutterBottom>アーカイブ</Typography>
        <List>
          {/* 他の月のリンクをここに追加 */}
        </List>
      </div>
      <div className={classes.content}>
        <Typography variant="h1" gutterBottom>{month} のブログ記事</Typography>
        <List>
          {posts.map(({ node }) => (
            <ListItem key={node.id} button component={Link} to={node.fields.slug}>
              <ListItemText
                primary={<span className={classes.blogTitle}>{node.frontmatter.title}</span>}
                secondary={
                  <span>
                    <span className={classes.blogDate}>{node.frontmatter.date}</span>
                    <br />
                    {node.excerpt}
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Layout>
  );
};

export default MonthlyArchiveTemplate;
import React, { useState } from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const BlogTitle = styled('span')(({ theme }) => ({
  fontSize: '1.8rem',
}));

const BlogDate = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: 'gray',
}));

const MoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#7f8c8d', // 地味な色に設定
  color: 'white',
  '&:hover': {
    backgroundColor: '#95a5a6', // ホバー時の色
  },
}));

type Props = {
  data: {
    allMdx: {
      edges: {
        node: {
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
      }[];
    };
  };
};

const IndexPage: React.FC<Props> = ({ data }) => {
  const [visiblePosts, setVisiblePosts] = useState(5);
  const posts = data.allMdx.edges;

  const handleShowMore = () => {
    setVisiblePosts((prev) => prev + 5);
  };

  return (
    <Layout>
      <Typography variant="h1" gutterBottom>ちよじブログ</Typography>
      <List>
        {posts.slice(0, visiblePosts).map(({ node }) => (
          <ListItem key={node.id} button component={Link} to={node.fields.slug}>
            <ListItemText
              primary={<BlogTitle>{node.frontmatter.title}</BlogTitle>}
              secondary={
                <span>
                  <BlogDate>{node.frontmatter.date}</BlogDate>
                  <br />
                  {node.excerpt}
                </span>
              }
            />
          </ListItem>
        ))}
      </List>
      {visiblePosts < posts.length && (
        <MoreButton variant="contained" onClick={handleShowMore}>
          More
        </MoreButton>
      )}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
          }
          excerpt
        }
      }
    }
  }
`;

export default IndexPage;
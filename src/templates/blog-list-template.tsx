import React, { useMemo, useState } from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CategoryTrail from '../components/category-trail';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TuneIcon from '@mui/icons-material/Tune';
import Collapse from '@mui/material/Collapse';
import { getCategoryLabel } from '../taxonomy';

const BlogTitle = styled('span')(({ theme }) => ({
  fontSize: '1.8rem',
  color: '#66ff66', // キャラクターの緑色
}));

const BlogDate = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: 'gray',
}));

const CharacterImage = styled('img')(({ theme }) => ({
  width: '25%',
  height: 'auto',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    height: '150px',
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
}));

const getPagePath = (page: number) => page === 1 ? '/' : `/page/${page}`;

const getVisiblePages = (currentPage: number, numPages: number) => {
  if (numPages <= 7) {
    return Array.from({ length: numPages }, (_, index) => index + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(numPages - 1, currentPage + 1);

  if (start > 2) pages.push('ellipsis');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < numPages - 1) pages.push('ellipsis');
  pages.push(numPages);

  return pages;
};

type PageContext = {
  posts: {
    node: {
      id: string;
      fields: {
        slug: string;
      };
      frontmatter: {
        title: string;
        date: string;
        categories?: string[];
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
  }[];
  allPosts: PageContext['posts'];
  numPages: number;
  currentPage: number;
};

type Props = {
  pageContext: PageContext;
};

const BlogListTemplate: React.FC<Props> = ({ pageContext }) => {
  const { language } = useI18next();
  const isEnglish = language === 'en';
  const { posts, allPosts, currentPage, numPages } = pageContext;
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const visiblePages = getVisiblePages(currentPage, numPages);
  const isFiltering = query.trim().length > 0 || selectedCategory.length > 0;
  const categoryOptions = useMemo(() => {
    const entries = new Map<string, { categories: string[]; count: number }>();
    allPosts.forEach(({ node }) => {
      const categories = node.frontmatter.categories || [];
      categories.forEach((_, index) => {
        const prefix = categories.slice(0, index + 1);
        const key = prefix.join('/');
        const existing = entries.get(key);
        entries.set(key, { categories: prefix, count: (existing?.count || 0) + 1 });
      });
    });
    return Array.from(entries.values()).sort((a, b) =>
      a.categories.length - b.categories.length || a.categories.join('/').localeCompare(b.categories.join('/'))
    );
  }, [allPosts]);
  const displayedPosts = useMemo(() => {
    if (!isFiltering) return posts;
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return allPosts.filter(({ node }) => {
      const displayedPost = isEnglish && node.englishTranslation ? node.englishTranslation : node;
      const matchesQuery = !normalizedQuery || `${displayedPost.frontmatter.title} ${displayedPost.excerpt}`
        .toLocaleLowerCase().includes(normalizedQuery);
      const categories = node.frontmatter.categories || [];
      const matchesCategory = selectedCategory.length === 0
        || selectedCategory.every((category, index) => categories[index] === category);
      return matchesQuery && matchesCategory;
    });
  }, [allPosts, isEnglish, isFiltering, posts, query, selectedCategory]);
  const visibleCategoryOptions = useMemo(() => categoryOptions.filter(({ categories }) => {
    if (categories.length !== selectedCategory.length + 1) return false;
    return selectedCategory.every((category, index) => categories[index] === category);
  }), [categoryOptions, selectedCategory]);

  const renderFilterPanel = () => (
    <Box>
      <TextField
        fullWidth
        size="small"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={isEnglish ? 'Search articles' : '記事を検索'}
        inputProps={{ 'aria-label': isEnglish ? 'Search articles' : '記事を検索' }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
        }}
      />
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
        {isEnglish ? 'Filter by tag' : 'タグで絞り込む'}
      </Typography>
      {selectedCategory.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5, mb: 1.25 }}>
          {selectedCategory.map((category, index) => (
            <React.Fragment key={selectedCategory.slice(0, index + 1).join('/')}>
              {index > 0 && <Box component="span" sx={{ color: 'text.secondary' }}>›</Box>}
              <Chip
                label={getCategoryLabel(category, language)}
                clickable
                size="small"
                color={index === selectedCategory.length - 1 ? 'success' : 'default'}
                variant={index === selectedCategory.length - 1 ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(selectedCategory.slice(0, index + 1))}
              />
            </React.Fragment>
          ))}
          <Button
            size="small"
            onClick={() => setSelectedCategory(selectedCategory.slice(0, -1))}
            sx={{ minWidth: 0, ml: 0.25, color: '#FFB6C1' }}
          >
            {isEnglish ? 'Back' : '戻る'}
          </Button>
        </Box>
      )}
      {visibleCategoryOptions.length > 0 && selectedCategory.length > 0 && (
        <Typography variant="caption" sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}>
          {isEnglish ? 'Choose a subtag' : '下のタグを選択'}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {visibleCategoryOptions.map(({ categories, count }) => {
          const category = categories[categories.length - 1];
          const label = getCategoryLabel(category, language);
          return (
            <Chip
              key={categories.join('/')}
              label={`${label} (${count})`}
              clickable
              variant="outlined"
              onClick={() => setSelectedCategory(categories)}
              sx={{ maxWidth: '100%', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
          );
        })}
      </Box>
      {isFiltering && (
        <Button
          size="small"
          onClick={() => { setQuery(''); setSelectedCategory([]); }}
          sx={{ mt: 1.5, color: '#FFB6C1' }}
        >
          {isEnglish ? 'Clear filters' : '絞り込みを解除'}
        </Button>
      )}
    </Box>
  );

  return (
    <Layout>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px minmax(0, 1fr)' }, gap: { md: 4 } }}>
        <Paper
          component="aside"
          variant="outlined"
          sx={{
            display: { xs: 'none', md: 'block' },
            alignSelf: 'start',
            position: 'sticky',
            top: 24,
            p: 2,
            backgroundColor: 'rgba(255,255,255,0.025)',
          }}
        >
          {renderFilterPanel()}
        </Paper>

        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
            <Typography 
              variant="h1" 
              sx={{
                fontFamily: 'Courier, monospace',
                fontSize: { xs: '2.8rem', sm: '5rem' },
                mb: 0,
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              Chiyoji's Page
            </Typography>
            <CharacterImage src="https://pub-01fefff4e3b240f089003a1627fe087d.r2.dev/second_waltz_chara.gif" alt="Second Waltz Character" />
          </Box>
          <Paper variant="outlined" sx={{ display: { xs: 'block', md: 'none' }, mb: 2, backgroundColor: 'rgba(255,255,255,0.025)' }}>
            <Button
              fullWidth
              startIcon={<TuneIcon />}
              onClick={() => setMobileFiltersOpen(open => !open)}
              aria-expanded={mobileFiltersOpen}
              sx={{ justifyContent: 'space-between', px: 2, py: 1.25, color: '#9cff9c' }}
            >
              {isEnglish ? 'Search & filter' : '検索・タグ絞り込み'}{isFiltering ? ` (${displayedPosts.length})` : ''}
            </Button>
            <Collapse in={mobileFiltersOpen}>
              <Box sx={{ px: 2, pb: 2 }}>{renderFilterPanel()}</Box>
            </Collapse>
          </Paper>

          {isFiltering && (
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }} aria-live="polite">
              {isEnglish ? `${displayedPosts.length} results` : `${displayedPosts.length}件の記事`}
            </Typography>
          )}
      <List disablePadding>
        {displayedPosts.map(({ node }) => {
          const displayedPost = isEnglish && node.englishTranslation
            ? node.englishTranslation
            : node;
          return (
          <ListItem key={node.id} button component={Link} language={language} to={node.fields.slug}>
            <ListItemText
              primary={<BlogTitle>{displayedPost.frontmatter.title}</BlogTitle>}
              secondary={
                <span>
                  <BlogDate>{displayedPost.frontmatter.date}</BlogDate>
                  <CategoryTrail categories={node.frontmatter.categories} linked={false} compact />
                  <br />
                  {displayedPost.excerpt}
                </span>
              }
            />
          </ListItem>
          );
        })}
      </List>

      {!isFiltering && <PaginationContainer>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} aria-live="polite">
          {isEnglish ? `Page ${currentPage} of ${numPages}` : `${currentPage} / ${numPages} ページ`}
        </Typography>

        <Box
          component="nav"
          aria-label={isEnglish ? 'Article pages' : '記事ページ'}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <IconButton
            component={Link}
            language={language}
            to="/"
            aria-label={isEnglish ? 'First page' : '最初のページ'}
            disabled={isFirst}
            sx={{ color: '#FFB6C1' }}
          >
            <FirstPageIcon />
          </IconButton>

          <Button
            component={Link}
            language={language}
            to={getPagePath(Math.max(1, currentPage - 1))}
            disabled={isFirst}
            startIcon={<ArrowBackIosNewIcon />}
            aria-label={isEnglish ? 'Previous page' : '前のページ'}
            sx={{ color: '#FFB6C1', minWidth: { xs: 40, sm: 88 } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {isEnglish ? 'Previous' : '前へ'}
            </Box>
          </Button>

          {visiblePages.map((page, index) => page === 'ellipsis' ? (
            <Box
              key={`ellipsis-${index}`}
              component="span"
              aria-hidden="true"
              sx={{ minWidth: 24, textAlign: 'center', color: 'text.secondary' }}
            >
              …
            </Box>
          ) : page === currentPage ? (
            <Box
              key={page}
              component="span"
              aria-current="page"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#FFB6C1',
                color: '#222',
                fontWeight: 'bold',
              }}
            >
              {page}
            </Box>
          ) : (
            <IconButton
              key={page}
              component={Link}
              language={language}
              to={getPagePath(page)}
              aria-label={isEnglish ? `Go to page ${page}` : `${page}ページへ`}
              sx={{ width: 40, height: 40, color: '#FFB6C1' }}
            >
              {page}
            </IconButton>
          ))}

          <Button
            component={Link}
            language={language}
            to={getPagePath(Math.min(numPages, currentPage + 1))}
            disabled={isLast}
            endIcon={<ArrowForwardIosIcon />}
            aria-label={isEnglish ? 'Next page' : '次のページ'}
            sx={{ color: '#FFB6C1', minWidth: { xs: 40, sm: 72 } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {isEnglish ? 'Next' : '次へ'}
            </Box>
          </Button>

          <IconButton
            component={Link}
            language={language}
            to={getPagePath(numPages)}
            aria-label={isEnglish ? 'Last page' : '最後のページ'}
            disabled={isLast}
            sx={{ color: '#FFB6C1' }}
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      </PaginationContainer>}
        </Box>
      </Box>
    </Layout>
  );
};

export default BlogListTemplate;

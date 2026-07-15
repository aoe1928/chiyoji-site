import React from 'react';
import Box from '@mui/material/Box';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import { getCategoryLabel, getCategoryPath } from '../taxonomy';

type CategoryTrailProps = {
  categories?: string[] | null;
  linked?: boolean;
  compact?: boolean;
};

const CategoryTrail: React.FC<CategoryTrailProps> = ({
  categories,
  linked = true,
  compact = false,
}) => {
  const { language } = useI18next();

  if (!categories?.length) return null;

  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 0.75,
        my: compact ? 0.75 : 1.5,
      }}
    >
      {categories.map((category, index) => (
        <React.Fragment key={`${category}-${index}`}>
          {index > 0 && (
            <Box component="span" aria-hidden="true" sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>
              ›
            </Box>
          )}
          <Box
            component={linked ? Link : 'span'}
            {...(linked ? { to: getCategoryPath(categories, index + 1), language } : {})}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: compact ? 24 : 28,
              px: compact ? 1 : 1.25,
              borderRadius: '999px',
              border: '1px solid rgba(102, 255, 102, 0.3)',
              backgroundColor: 'rgba(102, 255, 102, 0.07)',
              color: '#9cff9c',
              fontSize: compact ? '0.72rem' : '0.8rem',
              lineHeight: 1,
              textDecoration: 'none',
              transition: 'background-color 160ms ease, border-color 160ms ease',
              ...(linked ? {
                '&:hover': {
                  backgroundColor: 'rgba(102, 255, 102, 0.14)',
                  borderColor: 'rgba(102, 255, 102, 0.55)',
                },
              } : {}),
            }}
          >
            {getCategoryLabel(category, language)}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default CategoryTrail;

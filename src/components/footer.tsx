import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Footer = () => {
  const { languages, originalPath, language } = useI18next();

  return (
    <Box component="footer" sx={{ mt: 4, py: 2, textAlign: 'center' }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Chiyoji
      </Typography>
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {languages.map((lng) => (
          <Link
            key={lng}
            to={originalPath}
            language={lng}
            style={{
              fontWeight: language === lng ? 'bold' : 'normal',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {lng === 'ja' ? '日本語' : 'English'}
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;

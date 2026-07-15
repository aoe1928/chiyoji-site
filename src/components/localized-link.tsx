import React from 'react';
import { Link, LinkProps, useI18next } from 'gatsby-plugin-react-i18next';

const LocalizedLink = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'language'>>(
  ({ children, ...props }, ref) => {
    const { language } = useI18next();

    return (
      <Link ref={ref} language={language} {...props}>
        {children}
      </Link>
    );
  }
);

LocalizedLink.displayName = 'LocalizedLink';

export default LocalizedLink;

import React from 'react';
import { graphql } from 'gatsby';
import ToolDetailPage from '../../components/tool-detail-page';
export default function Page() { return <ToolDetailPage id="note-catcher" />; }
export const query = graphql`query($language: String!) { locales: allLocale(filter: {language: {eq: $language}}) { edges { node { ns data language } } } }`;

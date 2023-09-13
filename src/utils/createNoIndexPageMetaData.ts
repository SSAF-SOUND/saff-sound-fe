import type { PageHeadProps } from '~/components/Common';

export const createNoIndexPageMetaData = (metaTitle: string): PageHeadProps => {
  return {
    title: metaTitle,
    openGraph: { title: metaTitle },
    robots: { index: false, follow: false },
  };
};

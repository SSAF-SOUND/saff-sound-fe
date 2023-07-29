import type { ArticleDetail } from '~/services/article';

import { css } from '@emotion/react';

import ArticleStats from '~/components/Article/ArticleStats';
import { flex, fontCss, palettes } from '~/styles/utils';

import ArticleContent from './ArticleContent';

interface ArticleMainProps {
  className?: string;
  articleDetail: ArticleDetail;
}

const ArticleMain = (props: ArticleMainProps) => {
  const { articleDetail, className } = props;
  const { title, modified, content } = articleDetail;

  return (
    <div className={className}>
      <h2 css={titleCss}>
        <span>{title}</span>
        {modified && <strong css={modifyIndicator}>(수정됨)</strong>}
      </h2>
      <ArticleContent html={content} />
      <ArticleStats articleDetail={articleDetail} />
    </div>
  );
};

export default ArticleMain;

const titleCss = css(fontCss.style.B16, flex('center', '', 'row', 10));
const modifyIndicator = css({ color: palettes.primary.dark });

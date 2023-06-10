// eslint-disable-next-line
type Noop = (...args: any[]) => any;
export const noop: Noop = () => {};

/**
 * @example
 *   composeUrls('http://example.com/', '/url')
 *   composeUrls('http://example.com', 'url')
 *   // http://example.com/url
 */
export const composeUrls = (...urls: string[]) => {
  const composed = urls
    .map((url) => url.trim().replace(/(^\/+)|(\/+$)/g, ''))
    .filter(Boolean)
    .join('/')
    .trim();

  if (/^https?:\/\//.test(composed)) return composed;
  return '/' + composed;
};

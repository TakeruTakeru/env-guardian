export const getDomainAndPathname = (url) => {
  const urlObj = new URL(url);
  return {
    domain: urlObj.hostname,
    pathname: urlObj.pathname,
  };
};

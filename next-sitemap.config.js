/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://yukseltpc.com",
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  outDir: "./public",
};

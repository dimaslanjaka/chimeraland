/* global hexo */

hexo.extend.helper.register('getPosts', function () {
  const { page } = this;
  return page.posts;
});

hexo.extend.helper.register('getAuthor', function (author, fallback) {
  if (typeof author === 'string') return author;
  if (!author) return fallback;
  if (author.name) return author.name;
  if (author.nick) return author.nick;
  if (author.nickname) return author.nickname;
});

hexo.extend.helper.register(
  'getPostByLabel',
  /**
   * hexo get post by key with name
   * @param {'tags'|'categories'} by
   * @param {string[]} filternames
   * @returns {Record<string, string>[]}
   */
  function (by, filternames) {
    const hexo = this;
    /**
     * @type {any[]}
     */
    const data = hexo.site[by].data;
    const map = filternames
      .map((filtername) => {
        const filter = data.filter(({ name }) => String(name).toLowerCase() == filtername.toLowerCase());
        return filter.map((group) => {
          return group.posts.map(
            /**
             * @param {import('hexo').Post.Data} post
             */
            function ({ title, permalink, thumbnail, photos }) {
              // get title and permalink
              // for more keys, you can look at https://github.com/dimaslanjaka/nodejs-package-types/blob/ec9b509d81eefdfada79f1658ac02118936a1e5a/index.d.ts#L757-L762
              return { title, permalink, thumbnail, photos };
            }
          );
        });
      })
      // flattern all multidimensional arrays
      // to get array of hexo post object
      .flat(2);
    // dump
    // console.log(map);
    // return an JSON string
    // return JSON.stringify(map, null, 2);
    // return an Array
    return map;
  }
);

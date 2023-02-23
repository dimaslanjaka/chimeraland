hexo.extend.filter.register('pre', function(data, callback) {
    var footContent = ""
    var ReLink = new RegExp('\\[[^](\\d+)\\]:(.+)', 'g');
    data.content = data.content.replace(ReLink, function(x, y, z) {
        footContent += '<li id="fn:' + y + '">' + z + '<a href="#fnref:' + y + '" rev="footnote">↩</a></li>';
        return "";
    });
    var ReSup = new RegExp('\\[[^](\\d+)\\]', 'g');
    data.content = data.content.replace(ReSup, '<sup id="fnref:$1"><a href="#fn:$1" rel="footnote">$1</a></sup>');
    if (footContent.length > 0)
    {
        data.content += '<div id="footnotes"><hr><div id="footnotelist"><ol>' + footContent + '</ol></div></div>';
    }
    callback(null, data);
});

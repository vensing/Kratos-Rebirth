
const gitDateExtractor = require('git-date-extractor');
const fs = require('fs');

hexo.extend.processor.register('posts/:id', async function (file) {
    const stamps = await gitDateExtractor.getStamps({
        files: file.source
    });
    fs.utimes(file.source, stamps['source/' + file.path].modified, stamps['source/' + file.path].modified, function (err) {
        if (err) {
            console.log('Time modification failed.');
            throw err;
        }
    });
});

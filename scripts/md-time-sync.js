
// const gitDateExtractor = require('git-date-extractor');
// const fs = require('fs');

// hexo.extend.processor.register('posts/:id', async function (file) {
//     const stamps = await gitDateExtractor.getStamps({
//         files: file.source
//     });
//     fs.utimes(file.source, stamps['source/' + file.path].modified, stamps['source/' + file.path].modified, function (err) {
//         if (err) {
//             console.log('Time modification failed.');
//             throw err;
//         }
//     });
// });

/**
 * Read git log and overwrite the front-matter properties date and updated for each posts.
 * https://github.com/xcatliu/hexo-filter-date-from-git
 * 
 */

const path = require('path');
const execSync = require('child_process').execSync;
const moment = require('moment-timezone');

hexo.extend.filter.register('before_post_render', data => {
  const originDate = data.date;
  const gitDate = getDate(data);
  if (gitDate < originDate) {
    data.date = gitDate;
  }

  const originUpdated = data.updated;
  const gitUpdated = getUpdated(data);
  if (gitUpdated < originUpdated) {
    data.updated = gitUpdated;
  }

  return data;
});

function getDate(data) {
  const filePath = getFilePath(data);
  const date = execSync(`git log --follow --format="%ad" -- ${filePath} | tail -1`).toString().trim();
  // If the file is created a moment ago, it will be an untracked file, then git can not log it
  if (date === '') {
    return moment();
  }
  return moment(new Date(date));
}

function getUpdated(data) {
  const filePath = getFilePath(data);
  const updated = execSync(`git log --follow -1 --format="%ad" -- ${filePath}`).toString().trim();
  if (updated === '') {
    return moment();
  }
  return moment(new Date(updated));
}

function getFilePath(data) {
  return path.resolve(hexo.config.source_dir, data.source);
}


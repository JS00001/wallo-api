import fs from 'fs';

import Cache from '.';

const fileCache = new Cache();

/**
 * Cache every content file before running
 * the server
 */
const cacheContent = () => {
  const files = fs.readdirSync('content');

  // For each course, get all of its content files and cache them
  files.forEach((file) => {
    const courseId = file.split('--')[1];
    const contentFiles = fs.readdirSync(`content/${file}/content`);

    contentFiles.forEach((contentFile) => {
      const data = fs.readFileSync(
        `content/${file}/content/${contentFile}`,
        'utf8',
      );
      fileCache.set(`${courseId}-${contentFile}`, data);
    });
  });
};

export { cacheContent };

export default fileCache;

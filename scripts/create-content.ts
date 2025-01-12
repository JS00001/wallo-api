import fs from 'fs';
import pico from 'picocolors';
import readline from 'readline';

// Ask for course name, then course description by prompting the user, using nodejs and typescript
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  pico.green(`[Create Content] ${pico.white('Lessons per Course: ')}`),
  (lessons) => {
    rl.question(
      pico.green(`[Create Content] ${pico.white('Content per Lesson: ')}`),
      async (content) => {
        // Go through each folder in ./content, open its 'content' folder, and create a file "lesson-x-content-y.md"
        const lessonCount = parseInt(lessons);
        const contentCount = parseInt(content);

        const folders = fs.readdirSync('./content');

        folders.forEach((folder) => {
          const folderPath = `./content/${folder}/content`;

          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }

          for (let i = 1; i <= lessonCount; i++) {
            for (let j = 1; j <= contentCount; j++) {
              const filename = `lesson-${i}-content-${j}.md`;
              // If the file already exists, skip
              if (fs.existsSync(`${folderPath}/${filename}`)) {
                continue;
              }

              fs.writeFileSync(`${folderPath}/${filename}`, '');
              console.log(pico.blue(`Created ${filename}`));
            }
          }
        });

        console.log(pico.blue('Content created!'));
        rl.close();
      },
    );
  },
);

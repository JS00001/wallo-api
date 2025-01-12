import fs from 'fs';
import pico from 'picocolors';
import readline from 'readline';
import mongoose from 'mongoose';

// Ask for course name, then course description by prompting the user, using nodejs and typescript
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  pico.green(`[Create Course] ${pico.white('Course name: ')}`),
  (courseName) => {
    rl.question(
      pico.green(`[Create Course] ${pico.white('Course description: ')}`),
      async (courseDescription) => {
        const courseId = new mongoose.Types.ObjectId();

        const course = {
          _id: courseId,
          name: courseName,
          description: courseDescription,
        };

        const fileSafeCourseName = courseName.replace(/ /g, '-').toLowerCase();

        // Ensure that ./content exists
        if (!fs.existsSync('./content')) {
          fs.mkdirSync('./content');
        }

        // Create a folder in ../content/{courseId} and save the course.json file with
        // the course object
        const folder = `./content/${fileSafeCourseName}--${courseId}`;

        fs.mkdirSync(folder);
        fs.writeFileSync(
          `${folder}/course.json`,
          JSON.stringify(course, null, 2),
        );

        const lessons = [
          {
            course: courseId,
            order: 1,
            name: '',
            description: '',
            content: ['example.md'],
            questions: [
              {
                question: '',
                type: 'single',
                answers: [
                  { answer: '', correct: true },
                  { answer: '', correct: false },
                  { answer: '', correct: false },
                  { answer: '', correct: false },
                ],
              },
            ],
          },
        ];

        // In the course folder, create a lessons.json file with the lessons array
        fs.writeFileSync(
          `${folder}/lessons.json`,
          JSON.stringify(lessons, null, 2),
        );

        // In the course folder, create a 'content' folder, and create an example.md file
        fs.mkdirSync(`${folder}/content`);
        fs.writeFileSync(
          `${folder}/content/example.md`,
          'This is an example lesson',
        );

        console.log(pico.blue(`Course created at ${folder}`));

        rl.close();
      },
    );
  },
);

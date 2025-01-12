import fs from 'fs';
import pc from 'picocolors';
import mongoose from 'mongoose';

import config from '../src/constants';

const main = async () => {
  const { connection: db } = await mongoose.connect(config.DBUri, {
    dbName: config.DBName,
  });

  // Get all folders in the courses directory
  const courses = fs.readdirSync('./content');

  // For each course id, check first if the course exists, then either update or create
  for (const courseFolder of courses) {
    const courseId = courseFolder.split('--')[1];

    const courseData = fs.readFileSync(
      `./content/${courseFolder}/course.json`,
      'utf-8',
    );

    const lessonData = fs.readFileSync(
      `./content/${courseFolder}/lessons.json`,
      'utf-8',
    );

    const course = JSON.parse(courseData);
    const lessons = JSON.parse(lessonData);
    const courseDocument = await db.collection('courses').findOne({
      _id: new mongoose.Types.ObjectId(courseId),
    });

    const updatedLessons: any[] = [];

    // If the document does not exist, create it and its lessons
    if (!courseDocument) {
      await db.collection('courses').insertOne({
        _id: new mongoose.Types.ObjectId(course._id as string),
        name: course.name,
        description: course.description,
      });

      courseLog(`${course.name} was just created`);

      for (const lesson of lessons) {
        const id = new mongoose.Types.ObjectId();

        await db.collection('lessons').insertOne({
          _id: id,
          course: new mongoose.Types.ObjectId(courseId),
          name: lesson.name,
          description: lesson.description,
          order: lesson.order,
          content: lesson.content,
          questions: lesson.questions,
        });

        updatedLessons.push({ _id: id, ...lesson });

        lessonLog(
          `${lesson.name} was just created for course ${pc.green(course.name)}`,
        );
      }

      // Write to the lessons.json file
      fs.writeFileSync(
        `./content/${courseFolder}/lessons.json`,
        JSON.stringify(updatedLessons, null, 2),
      );

      console.log();
      continue;
    }

    // Otherwise, update the course and its lessons
    await db
      .collection('courses')
      .updateOne(
        { _id: new mongoose.Types.ObjectId(courseId) },
        { $set: { name: course.name, description: course.description } },
      );

    courseLog(`${course.name} was just updated`);

    for (const lesson of lessons) {
      // If the lesson does not exist, create it

      if (!lesson._id) {
        const id = new mongoose.Types.ObjectId();

        await db.collection('lessons').insertOne({
          _id: id,
          course: new mongoose.Types.ObjectId(courseId),
          name: lesson.name,
          description: lesson.description,
          order: lesson.order,
          content: lesson.content,
          questions: lesson.questions,
        });

        updatedLessons.push({ _id: id, ...lesson });

        lessonLog(
          `${lesson.name} was just created for course ${pc.green(course.name)}`,
        );

        continue;
      }

      await db.collection('lessons').updateOne(
        { _id: new mongoose.Types.ObjectId(lesson._id as string) },
        {
          $set: {
            name: lesson.name,
            description: lesson.description,
            order: lesson.order,
            content: lesson.content,
            questions: lesson.questions,
          },
        },
      );

      updatedLessons.push({ _id: lesson._id, ...lesson });

      lessonLog(
        `${lesson.name} was just updated for course ${pc.green(course.name)}`,
      );
    }

    // Write to the lessons.json file
    fs.writeFileSync(
      `./content/${courseFolder}/lessons.json`,
      JSON.stringify(updatedLessons, null, 2),
    );

    console.log('');
  }

  db.close();
};

const lessonLog = (message: string) => {
  console.log(pc.green(`[Lesson] ${pc.white(message)}`));
};

const courseLog = (message: string) => {
  console.log(pc.blue(`[Course] ${pc.white(message)}`));
};

main();

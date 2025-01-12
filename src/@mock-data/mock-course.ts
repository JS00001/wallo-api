import { ICourse, QuestionType } from '@/models/@types';

const mockCourse = {
  name: 'Finance 101',
  description: 'This is a course about finance. Hooray',
};

const mockLesson = (courseId: string) => ({
  course: courseId,
  name: 'Lesson 1',
  description: 'Dive into the basics of finance',
  order: 1,
  content: ['objectid-1.md', 'objectid-2.md'],
  questions: [
    {
      question: 'How much is 1$ worth?',
      type: QuestionType.Single,
      answers: [
        { answer: '$1', correct: true },
        { answer: '$2', correct: false },
        { answer: '$3', correct: false },
        { answer: '$4', correct: false },
      ],
    },
    {
      question: 'How much is 1$ worth?',
      type: QuestionType.Single,
      answers: [
        { answer: '$1', correct: true },
        { answer: '$2', correct: false },
        { answer: '$3', correct: false },
        { answer: '$4', correct: false },
      ],
    },
  ],
});

export default mockCourse;

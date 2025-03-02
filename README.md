## Introduction

Wallo is a financial education platform that allows users to learn about personal finance, investing, and other financial topics. This repository contains the code for the Wallo backend. The backend is responsible for serving the course content to the frontend, as well as handling user authentication and other backend operations.

## Documentation Sections

- [Introduction](#introduction)
- [Setting up the environment](#setting-up-the-environment)
- [Running the application](#running-the-application)
- [Creating new course content](#creating-new-course-content)
- [Publishing courses to users](#publishing-courses-to-users)

## Setting up the environment

1. Install the required packages by running the following command:

```bash
yarn install
```

2. Create a `config/.env.dev` and `config/.env.prod` file in the root directory. These files should match the entries of the `config/.env.schema` file.

## Running the application

Run the following command to start the application in development mode:

```bash
yarn dev
```

> [!TIP]
> Press 'C' at any time to clear the console.

## Creating a new course

Run the following command to create a new course.

```bash
yarn create-course
```

- You will see that a 'content' folder has been created in the root directory with a new course folder inside of it. The course folder is
  formatted as `<course_name>-<course_id>`.
- Inside the course folder, you will find a `course.json` file. This file contains the course data that you can edit. You
  will also find a `lessons.json` file. This file contains every lesson that belongs to the course.
- Finally, each lesson has a `content` attribute that
  allows for an array of strings. These strings are relative paths to the markdown files that contain the lesson content. These markdown files **must** be placed in the `content` folder.

> [!NOTE]
> The course will NOT be published to the database/users until you run the `yarn publish-courses:dev/prod` command. You can read more about this below.

### Creating course content

- Any markdown file in content/<course>/content can be used as a 'slide' in a lesson. Each lesson takes an array of markdown files that will be displayed.
- Markdown files can use any formatting that is supported by the markdown parser. This includes headers, lists, images, and more.
- We offer a few special syntaxes that are non-standard markdown. These are
  - `{definition: <term> | <definition>}`: This will create underlined text, that, when clicked, will show the definition.
  - `{info: <text>}`: This will create a blue box with the text inside of it.
  - `{warning: <text>}`: This will create a red box with the text inside of it.

## Publishing courses to users

Run one of the two following commands (depending on your environment) to publish the courses to the database/users.

#### Development Environment (Publishing to the dev database)

```bash
yarn publish-courses:dev
```

#### Production Environment (Publishing to the prod database)

```bash
yarn publish-courses:prod
```

This will create the documents for courses and lessons if they do not already exist in the database. If they do exist, the documents will be updated with the new course data.

> [!WARNING]
> Do NOT change the `_id` of a course or lesson once it exists in the database. This can cause data loss and other issues. Similarly, do NOT change the folder name of a course (only the ID part of the folder name) after it has been published to the database.

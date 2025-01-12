### Setting up the environment

1. Install the required packages by running the following command:

```bash
yarn install
```

### Running the application

1. Run the following command to start the application in development mode:

```bash
yarn dev
```

> [!TIP]
> Press 'C' at any time to clear the console.

### Creating new course content

1. Run the following command to create a new course.

```bash
yarn create-course
```

You will see that a 'content' folder has been created in the root directory with a new course folder inside of it. The course folder is
formatted as `<course_name>-<course_id>`. Inside the course folder, you will find a `course.json` file. This file contains the course data that you can edit. You
will also find a `lessons.json` file. This file contains every lesson that belongs to the course. Finally, each lesson has a `content` attribute that
allows for an array of strings. These strings are relative paths to the markdown files that contain the lesson content. These markdown files **must** be placed in the `content` folder.

> [!NOTE]
> The course will NOT be published to the database/users until you run the `yarn publish-courses:dev/prod` command. You can read more about this below.

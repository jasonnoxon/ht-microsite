# Healthy Together Microsite
I'm not sure how a microsite differs from a regular website, but there it is...

#Instructions
Make sure the following are installed:
  - [node.js](http://nodejs.org/)
  - [git](http://git-scm.com/)
  - [gulp](http://gulp.js)

Run `npm install` to install project dependencies

Run `gulp` to run BrowserSync and create `/dev` directory.

Run `gulp build` to create build folder. The contents of that folder are what is updated to the webserver.

#Note
For production, delete the `js/app.js` file from the build folder. Was too lazy to delete it in the `compress-js` task.

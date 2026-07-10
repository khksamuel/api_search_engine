# Google Books API Search Engine

## Outline

This project will require you to use React and Asynchronous programming.
The aim is for the user to be able to search for a book inside the Google Books database and to be able to get more details about a certain title.

## MVP

Create a page that allows users to search for books
Page should include the following:

- Header section introducing the page
- Form containing a text input and a submit / search button

- A grid of books
  Instructions:

- When the submit button is clicked you need the request books from the Google books API using the input value as your query string
- The books that you receive should be rendered in the books grid.
- Each book in the grid should have an image, author, title and description
- The grid should be responsive on different screen sizes

Styling (required):

This application should look good, take some time to pick a palette and plan out your design - this will also help with splitting the app into React components. You can use tools like Figma or wireframe pro to plan what your application is going to look like.

Use modules for styling, don't forget about other SCSS features, like a separate file for palette or variables.

Application Design (required):

- Remember that some JavaScript logic, like functions that fetch data, can be moved to their own .js files
- Always use iterators over loops
- Always parametrize and abstract large pieces of duplicate code.

## Bonus (optional, but highly recommended):

- Give feedback to the user when no book results can be found for the query.
- When a user clicks a book in the grid, a modal should appear with more book information, think about release, publish date, country, languages, etc.

## Useful Resources:

- [Google Books API no Auth link](https://developers.google.com/books/docs/v1/using#WorkingVolumes)
- [Using Async Await](https://dmitripavlutin.com/javascript-fetch-async-await/)
- [Using Postman to Test APIs](https://www.blazemeter.com/blog/how-use-postman-test-apis)
- [Download Postman](https://www.postman.com/downloads/)

## Setup

Set up the repo with (choose the command for your platform):

```
npm install
# macOS / Linux
cp .env.sample .env
# PowerShell
Copy-Item .env.sample .env
# CMD
copy .env.sample .env
```

Change the API key to your key from Google Cloud Console:

1. Create or select a project in Google Cloud Console.
2. Go to APIs & Services → Library, search for "Books API", and click Enable.
3. Go to APIs & Services → Credentials → Create credentials → API key.
4. (Optional but recommended) Restrict the key:
   - Under API restrictions choose "Restrict key" and add "Books API".
   - Under Application restrictions set appropriate restrictions (for development you can leave None; for production restrict to your domains or IPs).
5. Copy the API key value.
6. Open your local `.env` file and set:

```
VITE_BOOKS_API_KEY=your_api_key_here
```

7. Save the file.

Security note:

- Never commit your `.env` file or your API key to version control. Ensure `.env` is listed in `.gitignore`.

Quick verification (optional):

```
node -e "console.log(process.env.BOOKS_API_KEY || process.env.VITE_BOOKS_API_KEY)"
```

Test the repo with:

```
npm test
```

# AI Book Finder

An AI-enhanced book discovery application built with Next.js, TypeScript, Tailwind CSS, Open Library, and Google Gemini.

## Live Demo

https://ai-book-finder-nu.vercel.app

## Features

* Search for books using the Open Library API
* Browse book covers, titles, and authors
* View detailed book information
* AI-powered book recommendations
* Streaming AI chat experience
* Favorites page
* Responsive interface for desktop and mobile
* Accessible interactive components
* Health-check endpoint
* Automated tests with Vitest
* Production deployment with Vercel

## Tech Stack

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Google Gemini
* Open Library API
* Vitest
* Vercel

## Architecture

The application uses Next.js App Router with Server Components by default and Client Components where interactivity is required.

API routes handle search, AI recommendations, streaming chat, and application health checks.

## Testing

The project includes automated tests covering:

* AI recommendation UI
* Book search functionality
* Book matching by title and author
* API failure handling
* Health-check functionality

Run the test suite with:

```bash
npm test -- --run
```

## Production Build

To verify the production build:

```bash
npm run build
```

## Environment Variables

API credentials are stored in environment variables and are not committed to the repository.

Create a `.env.local` file locally and add the required API credentials.

## Deployment

The application is deployed to Vercel.

Production URL:

https://ai-book-finder-nu.vercel.app

## Project Goals

This project demonstrates production-oriented frontend development combined with AI integration, including API integration, streaming responses, responsive UI, accessibility considerations, automated testing, error handling, and deployment.

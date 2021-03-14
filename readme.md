## Installation

Clone repo:

```sh
git clone https://github.com/tuhy020395/e-talk-api.git
cd e-talk.vn
```

Install the dependencies:

```sh
yarn install
```

or

```shhttps://github.com/tuhy020395/e-talk-api/blob/master/readme.md
npm install
```

## Development Workflow

Start a live-reload development server:

```sh
yarn dev
```

or

```sh
npm run dev
```

Generate a production build:

```sh
yarn build
```

or

```sh
npm run build
```

Generate a static file:

```sh
yarn export
```

or

```shell script
npm run export
```

## Guide

### 1. Structure

- `/api`: API config use in app.
- `/components`: Reuse component use in app.
  - `/Layout`: Layout persistence, use HOC `getLayout` for teacher page, `getStudentLayout` for student page.
- `/page-components`: All component using on specific page.
- `/page`: Pages use in app, each page is associated with a route based on its file name.
  - About route: [Routing NextJs](https://nextjs.org/docs/routing/introduction)
  - Dynamic route (using for detail page): [Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)
- `/public`: All static file serving in page. Files inside public can then be referenced by your code starting from the base URL (/).

```
<img src="/static/my-image.png" alt="my image" />
```

equal to :

```
<img src="/public/static/my-image.png" alt="my image" />
```

### 2. Stylesheet

- Global stylesheet locate at : `/styles/styles.scss`
- Every page can import any scss module file with suffix module. Ex: `header.module.scss`
- Global variables locate at: `/styles/variable`

### 2. Multiple languages

Read more docs at here: [next-i18next docs](https://github.com/isaachinman/next-i18next)

Translate file locate at : `/public/static/locales`

- "en" folder for english language, "vi" folder for vietnamese language.
- In the withTranslation HOC, only the first namespace can be used without prefix. All the other ones have to be prefixed with the filename. Example: `t('menu:title')`

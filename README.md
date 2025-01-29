<h1 align="center">DevSpace</h1>

- [Why](#why)
- [Techonologies](#technologies)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Project Architecture](#project-architecture)

---

**Join our workspace**: https://devspace-app.vercel.app/app/workspace/l47qfeumtyl27fnj

**Join our discord**: https://discord.com/invite/VnB4wgBNAw

## Why

> Before talking about the tech stack and the project architecture, it's very important to talk about why? Why this app? Does it offer what is not found in other apps like notion, obsidian, etc...

Actually, it differs a lot from them, for these features:

- **👩‍💻 Specialized for developers**: As developers differ from normal people, they need a mix of things, (eg. the clearness of obsidian and the greate tools of notion), and as a developer I tried a lot of these apps and noone has fit me

- **🆓 Free**: Totally free

- **🔓 Open source**: And particularly in the field, you rarely found an open source note taking app

These are the core features that seperate DevSpace from any note taking app

## Technologies

### Frontend

- [Nextjs](https://nextjs.org/) - Main framework
- [Shadcn/ui](http://ui.shadcn.com/) - Components
- [Tailwind](https://tailwindcss.com) - CSS utilities library
- [Tiptap](https://tiptap.dev) - rich text editor
- [Valibot](https://valibot.dev) - Validating schema
- [React Hook Form](http://react-hook-form.com/) - handle forms

### Backend

- [Lucia](https://lucia-auth.com) - Cookies handling and authentication
- [Supabase](https://supabase.com) - Online database
- [@node-rs/argon2](https://www.npmjs.com/package/@node-rs/argon2) - Hashing and validating password
- [nodemailer](https://npmjs.com/package/nodemailer) - mailing
- [Drizzle ORM](https://orm.drizzle.team/) - ORM

## Project Architecture

```txt
├───.husky
├───drizzle
└───src
    ├───app
    ├───components
    ├───db
    │   ├───actions
    │   ├───utils
    ├───lib
    ├───styles
```

# 🚀 Chat App

**Chat App** is a group chat platform where you can create chat rooms, invite members, and connect with others. This project aims to provide an easy-to-use interface for managing group communications. **Future updates** will include audio and video chat functionalities. This is a work-in-progress project, with new features being implemented as I learn new technologies.

---

### 🛠️ Technologies

- Next.js - The react meta framework used for building the project as a fullstack application with server-side rendering.
- TypeScript - The programming language used for the project.
- Tailwind CSS - The utility-first CSS framework used for styling the project.
- Shadcn/UI - The headless UI library used for styling the project.
- React Hook Form - The form library used for handling form submissions.
- zod - The schema validation library used for validating form submissions.
- React Query - The data fetching library used for fetching & caching data from the server.
- tRPC - The RPC library that "glues" the server and client together, used for ensuring type safety and consistency between the server and client(A future rework of this project might drop the tRPC library in favor of Server Actions).
- Supabase - The database management platform used for storing user data, it also implements webhooks and websockets directly into the database level.
- PostgreSQL - The query language used for interacting with the database.
- PostgresJS - The JavaScript library used for interacting with the database.
- Drizzle - The ORM used for interacting with the database.
- Clerk - The authentication library used for managing user authentication.

---

### 📌 TODO

---

**_🚨 HIGH PRIORITY 🚨_**

- [ ] Load only (x) amount of posts, load more posts on scroll up
- [ ] Setup a few global groups for all members on the chat app (Global:General, Global:Dev, Global:Design, etc)

---

**_🤷‍♂️ MEDIUM PRIORITY 🤷‍♂️_**

- [ ] Setup friends
  - [ ] Setup private messages between friends
- [ ] "Remember" last read post and automatically focus the page on it, when loading the posts load up to (x) posts above and below it.
- [ ] Have a notification about (x) new posts
- [ ] Split Dev & Production environments (repo branch for dev(test & staging), with supabase & clerk dev envs)

---

**_💤 LOW PRIORITY 💤_**

- [ ] Add CRUD operations to users and chat groups, Missing so far:
  - [x] Remove user
  - [x] Edit user role
  - [ ] Remove chat group
- [ ] Implement the emoji button

**_🚧 HOPES & DREAMS 🚧_**

- [ ] Implement webRTC for video chat and audio chat

---

**_ 🎊 COMPLETED 🎊_**

- [x] Display online users in the chat / logged in to the website and logged into the group
- [x] Add notifications when user joins the chat & leaves the chat
- [x] Setup errors
- [x] Edit invitation links permissions & logic

---

**_🐛 BUGS and Backlog 🐛_**

- [ ] Chat window sometimes locks in the bottom

---

## Version History

0.1.0 - Initial Release

---

Feel free to reach out with any contributions or suggestions!

---

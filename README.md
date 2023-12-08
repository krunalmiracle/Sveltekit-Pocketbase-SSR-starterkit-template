# Freelancer Job board and Workers Board Monorepo

This is an example repo on how to use Sveltekit with Pocketbase modified server for nested update of models in Golang for
Backend + Frontend, this is also able to run on single 1vCPU with 256 MB ram for upto 1000 users.
Use this as a starter template.

## The tech Stack

- Frontend
  - ` Sveltekit SSR`
  - ` Authentication pocketbase cookie based`
  - ` Password Reset`
  - ` Confirm Email`
  - ` Email Change`
  - ` Login+Register`
  - ` Profile Avatar change`
  - ` User data modification`
  - ` Super forms for form handling and file handling`
  - ` Zod Schemas for data validation and types`
  - ` Skeleton theming with custom theme and inbuilt website color modification directly from the page`
  - ` Theme and UI changing directly from the website localhost:5173/theme`
  - ` Theme chooser from the top navigation bar, navbar to see the different themes in Realtime`
- Backend
  - ` Sveltekit SSR + Pocketbase Modified Golang Server`
- Code Exection Platform
  - ` Docker --> Node alpine with Nginx and Supervisord`
- Deployment Location
  - ` Fly Cloud Platform using fly.toml at t1-nano`

## For Development
Open Two terminals
### Terminal 1
`./main serve --http=0.0.0.0:8080 --dir=/pb_data`
### Terminal 2
`npm run dev`
## For production or Deployment just execute the following command
`flyctl deploy`

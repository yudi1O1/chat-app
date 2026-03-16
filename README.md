This is a basic chat app by the name one-chat.

Deployment
----------
Frontend: Vercel
Backend: Render

Frontend environment variables
------------------------------
`REACT_APP_API_URL=https://your-render-service.onrender.com`

`REACT_APP_ENABLE_SOCKET=true`

Set `REACT_APP_ENABLE_SOCKET=true` for your Vercel frontend so it connects to the Render-hosted Socket.IO server.

Backend environment variables
-----------------------------
`mongo_url=your-mongodb-connection-string`
`CLIENT_ORIGINS=https://your-frontend-project.vercel.app,http://localhost:3000`

Local development
-----------------
Frontend: run inside `chat-app`
Backend: run inside `server`

Notes
-----
The backend is set up for a long-running Node server, which suits Render and Socket.IO:
- run locally with `node server.js`
- deploy to Render with the root [render.yaml](/e:/FullStack/chatApp/chatApp/render.yaml)
- serve REST APIs and Socket.IO from the same server process


# MERN_CHAT_APP_VIBEn
 Realtime Chat appliation built in MERN stack

## Features : 
 1. One to one chatting
 2. Group chatting
 3. Remove/Add Members in group
 4. Realtime Notification
 5. User Authentication and Authorization using Refresh Token and AccessToken (Used refresh token Rotation & Reuse Detection) 
 6. Shows If other user typing or not

## Tech Stack
 1. JWT (Authentication/ authorization)
 2. REACT
 3. MONGOOSE (MONGODB ODM)
 4. TYPEGOOSE (mongoose wrapper for typesafety)
 5. EXPRESSJS (NODEJS framework)
 6. Terraform
 7. Docker (COntainerized)
 8. Chakra UI (UI library)
 9. NGINX (Reverse Proxy)
 10. Prometheus (Metrics storing)
 11. Grafana (Metrics showing UI) 

## Locally Run this project 
### without docker

1. starting client 
```
cd client
npm install
npm run dev
```

2. starting server
```
cd server
npm install
npm start
```

### with docker

1. run your docker client/ desktop
2. <code>docker compose up</code>

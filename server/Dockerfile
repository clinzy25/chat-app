FROM node:18
RUN npm install -g pnpm
RUN npm install -g nodemon
WORKDIR /app
CMD pnpm dev
ADD ./package.json .
RUN pnpm i
ADD ./src .
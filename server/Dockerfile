FROM node:18
WORKDIR /src
RUN npm install -g pnpm
RUN npm install -g nodemon
ADD . .
RUN pnpm i
CMD pnpm dev
FROM node:18
RUN npm install -g pnpm
RUN npm install -g nodemon
WORKDIR /src
CMD pnpm dev
ADD ./package.json /src
RUN pnpm i
ADD ./src /src
FROM node:18
RUN npm install -g pnpm
WORKDIR /src
EXPOSE 3000
CMD pnpm start
ADD ./package.json /src
RUN pnpm i
ADD ./src /src
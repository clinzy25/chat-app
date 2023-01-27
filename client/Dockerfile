FROM node:18
RUN npm install -g pnpm
WORKDIR /app
CMD pnpm start
ADD ./package.json .
RUN pnpm i
ADD ./src .
EXPOSE 3000
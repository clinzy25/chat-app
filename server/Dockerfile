FROM node:18
WORKDIR /server
RUN npm install -g pnpm
ADD . .
RUN pnpm i
CMD [ "node", "./bin/www" ]
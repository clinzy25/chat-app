FROM node:18
RUN npm install -g pnpm
WORKDIR /client
ENV PATH /client/node_modules/.bin:$PATH
ADD ./package.json /client/
RUN pnpm i
ADD . /client
RUN pnpm run build
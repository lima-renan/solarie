FROM node:16-alpine

WORKDIR /app

# Install Typescript Globally
RUN npm install -g typescript

COPY /app /app

RUN yarn install


EXPOSE 3000

CMD ["yarn", "start"]
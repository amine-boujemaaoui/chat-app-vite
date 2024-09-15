FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then node src/index.js; else npx nodemon --legacy-watch src/index.js; fi"]
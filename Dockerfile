FROM node:18
WORKDIR /app
COPY package.json /app
RUN npm cache clean --force
RUN npm install
COPY . /app
CMD ["npm", "start"]
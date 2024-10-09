FROM node:20

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# RUN npm install

COPY . .


COPY docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh
RUN chmod 777 docker-entrypoint.sh

EXPOSE 3000


ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
FROM mongo:latest

ENV MONGO_INITDB_ROOT_USERNAME admin
ENV MONGO_INITDB_ROOT_PASSWORD admin123


ADD mongo-init.js /docker-entrypoint-initdb.d/

EXPOSE 27017
FROM mongo:latest

ENV MONGO_INITDB_ROOT_USERNAME admin
ENV MONGO_INITDB_ROOT_PASSWORD admin123
ENV MONGO_INITDB_DATABASE project-tracker

ADD mongo-init.js /docker-entrypoint-initdb.d/
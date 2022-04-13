FROM node:12

RUN mkdir /app

COPY src/ app/
# COPY frontend

# TODO proper build

WORKDIR /app
CMD npm run start
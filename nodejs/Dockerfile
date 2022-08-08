FROM node:16

COPY . /nodejs
WORKDIR /nodejs

EXPOSE 8080

RUN ["chmod", "+x", "/nodejs/rename-chunks.sh"]
RUN ["/nodejs/rename-chunks.sh"]

CMD [ "node", "app/server.js" ]
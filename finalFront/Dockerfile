FROM node

COPY ./cookie /app
WORKDIR /app
RUN npm i
EXPOSE 5173
COPY ./build.sh .
ENTRYPOINT ["sh", "build.sh"]
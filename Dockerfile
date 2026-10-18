FROM node:20-alpine
RUN apk add --no-cache git
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# RepoRun's checkout may leave the blog submodule (content/) empty; fetch it before building.
RUN git submodule update --init --recursive || (rm -rf content && git clone https://github.com/ivanavelevaiv/auravia-blog-content.git content)
RUN npm run build
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]

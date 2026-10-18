FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache git
COPY package*.json ./
RUN npm ci
COPY . .
# Attempt to fetch blog submodule from public HTTP URL, fallback gracefully if already present or failed
RUN mkdir -p content && git clone https://github.com/ivanavelevaiv/auravia-blog-content.git temp_content && cp -r temp_content/* content/ 2>/dev/null || true; rm -rf temp_content
RUN npm run build
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]

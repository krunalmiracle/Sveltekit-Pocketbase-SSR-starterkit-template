# Use Node.js to build the SvelteKit app
FROM node:18-alpine as sveltekit-builder

WORKDIR /app
COPY ./frontend/package*.json .
COPY ./frontend/tsconfig.json .
COPY ./frontend/svelte.config.js .
COPY ./frontend/vite.config.ts .
RUN npm ci
COPY ./frontend .
# Environment variables
ENV PUBLIC_BACKEND_URL="https://starter-template.fly.dev"
ENV PRIVATE_BACKEND_URL="http://localhost:8080"
ENV PUBLIC_SITE_URL="https://starter-template.fly.dev"
RUN npm run build

RUN npm prune --production


# Use Golang to build the Go app
FROM golang:1.21-alpine as go-builder

WORKDIR /app

# Copy go mod and sum files
COPY ./backend/go.mod ./backend/go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY ./backend .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage to setup the server
FROM node:18-alpine

WORKDIR /app

# Copy built SvelteKit app
COPY --from=sveltekit-builder /app/build build/
COPY --from=sveltekit-builder /app/node_modules node_modules/
COPY ./frontend/package.json .


ENV NODE_ENV=production

# Copy built Go app
COPY --from=go-builder /app/main .

# Install necessary packages
RUN apk update && apk add --no-cache supervisor nginx

VOLUME ["/pb_data"]

# Copy supervisor logger script
COPY logger.sh /app/logger.sh

RUN chmod +x /app/logger.sh

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy Nginx configuration apk add nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8060 NodeApp, only use in local docker never on cloud
#EXPOSE 8060
# Expose port 8070 NGINX, to be opened to public. Just HTTP no HTTPS
# The HTTPS will be handled by FLY hosting
EXPOSE 8070
# Expose port 8080 Pocketbase, only use in local docker never on cloud
#EXPOSE 8080
# Run supervisord when the container launches
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf" ]
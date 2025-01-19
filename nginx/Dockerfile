# # Use a Node.js base image for the build stage
# FROM node:18 AS build

# # Set working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json for dependency installation
# COPY react-app/package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the React app source code
# COPY react-app/ ./

# # Build the React app
# RUN npm run build

# Use an Nginx base image for the final image
FROM nginx:latest

# Copy the built React app from the build stage
# COPY --from=build /app/build /usr/share/nginx/html/

# Copy the default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# for copying a prebuilt file, if you want
COPY react-app/build/ /usr/share/nginx/html/

# Copy 50x.html error pages
COPY nginx/50x.html /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"] 

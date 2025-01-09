FROM nginx

EXPOSE 8002

# docker build context is project_management_app (same as the docker compose file), not this current directory, so you can get react app

# can change to ssl conf to get https
COPY nginx/default.conf /etc/nginx/conf.d/

COPY nginx/50x.html /usr/share/nginx/html/

COPY react-app/build/ /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
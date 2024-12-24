FROM python:3.8-bullseye

WORKDIR /app

EXPOSE 8000

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "project_management_app.asgi:application"]
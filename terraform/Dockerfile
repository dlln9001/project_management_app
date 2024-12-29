FROM hashicorp/terraform:1.10.3

WORKDIR /app

COPY . .

ENTRYPOINT []

CMD ["sh", "-c", "terraform init && terraform plan && terraform apply -auto-approve"]
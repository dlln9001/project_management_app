FROM hashicorp/terraform:1.10.3

WORKDIR /app

COPY . .

ENTRYPOINT []

CMD ["sh", "-c", "echo $SA_KEY > /app/service_account_key.json && terraform init && terraform plan && terraform apply -auto-approve"]
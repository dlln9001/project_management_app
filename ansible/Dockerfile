FROM python:3.12-bookworm

WORKDIR /app

RUN pip install ansible requests google-auth

RUN ansible-galaxy collection install google.cloud

COPY . .

CMD ["/bin/bash", "-c", "echo $ANSIBLE_GCP_SA_KEY > /app/service_account_key.json && ansible-playbook playbooks/master.yml"]

# to keep the container running
# CMD ["/bin/bash", "-c", "tail -f /dev/null"] 
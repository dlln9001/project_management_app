FROM python:3.12-bookworm

WORKDIR /app

RUN pip install ansible requests google-auth

RUN ansible-galaxy collection install google.cloud

COPY . .

CMD ["ansible-playbook", "playbooks/master.yml"]
# CMD ["/bin/bash", "-c", "tail -f /dev/null"] to keep the container running
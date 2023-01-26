# Messenger

A one-to-one realtime chat app.

## Running Application Locally

1. Obtain from a system admin:
  - the key pair and for the AWS RDS instance from a system admin
  - your developer database credentials. System admin should create a new database user.
2. Create a `.env` file in the root of the project, add your credentials in the format of `.env.sample`.
3. `cd` into the directory containting the key
4. Run the following command to open an ssh tunnel to RDS through a bastion server.
  `ssh -i rds-bastion.pem -NL 3002:[RDS_PRIVATE_IP]:5432 ec2-user@54.190.136.58 -v`
5. Ensure Docker and docker-compose installed and configured
6. From project root, run `docker-compose -f docker-compose.dev.yml up --build`
7. Open `localhost:3000` in your browser

*Subsequent app stop/starts can use `docker-compose -f docker-compose.dev.yml up` and `docker-compose -f docker-compose.dev.yml down`

What am I looking at?

Two docker containers with frontend and backend images respectively. You are connected to the dev RDS instance in a private IP via a bastion connection.

Am I affecting prod?

No, client and server are local, the dev db you are connected to does not sync writes, and is synced with prod once daily.

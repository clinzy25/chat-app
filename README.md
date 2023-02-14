# Messenger

A one-to-one realtime chat app. Not novel in functionality, but used as a cloud / ops test bed.

# Running Application Locally
You will create an AWS custom VPC, Postgres RDS instance and bastion server, then launch two docker containers for the client and the server, using the bastion as a secure tunnel into the RDS instance.
### Prerequisites:
  - Terraform
  - Postgres
  - Docker and docker-compose
  - AWS configured
  - Ok with very small AWS bill (<$5)

### 1. Create VPC in AWS
  - `cd` into `infra/vpc`
  - run `terraform init`
  - run `terraform apply -auto-approve`
### 2. Create RDS instance and bastion server in AWS
  - `cd` into `infra/db`
  - run `terraform init`
  - create a file called `locals.auto.tfvars` in `infra/db`
  - add the following environment variables in the format `env_name = "ssh-rsa xxxx..."`
    - `key_path` and assign it to a directory where you can store a key and use it for dev connections
    - `db_password` and assign a master database password
  - run `terraform apply -auto-approve`
### 3. Create an SSH tunnel into RDS instance
  - obtain the ip addresses of the newly created RDS database and the bastion instance
  - `cd` into the `key_path` directory containing the bastion key
  - run `ssh -i rds-bastion.pem -NL 3002:{DATABASE_IP}:5432 ec2-user@{BASTION_IP} -v` replacing the values with the IP addresses

*this creates a connection to the RDS instance using the bastion as a tunnel. The connection is exposed on port 3002 on your local machine
### 4. Create your DB user and seed the database
  - in a new terminal window, run `psql -h localhost -U postgres -d ChatAppDb -p 3002`
  - when prompted, use the master database password you assigned in step 2
  - run `CREATE USER {USERNAME} WITH ENCRYPTED PASSWORD {PASSWORD};` and keep these values for later
  - run `GRANT ALL PRIVILEGES ON DATABASE "ChatAppDb" TO {USERNAME};`
  - run `cd /server && pnpm run seed`
### 5. Run the app
  - create an `.env` file in the project root and copy the values from `.env.sample`
  - add your db credentials to `POSTGRES_USER_DEV` and `POSTGRES_PASSWORD_DEV` and assign a random string to `SESSION_SECRET`
  - from project root, run `docker-compose -f docker-compose.dev.yml up --build`
  - open `localhost:3000` in your browser

*client and server both have hot reload enable for development

*Subsequent app stop/starts can use `docker-compose -f docker-compose.dev.yml up` and `docker-compose -f docker-compose.dev.yml down`

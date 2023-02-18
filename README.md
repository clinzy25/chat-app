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
  - add the following environment variable in the format `env_name = "value xxxx..."`
    - `db_password` and assign a master database password
  - run `terraform apply -auto-approve`
### 3. Create your DB user and seed the database
  - in a new terminal window, run `psql -h localhost -U postgres -d ChatAppDb -p 3002`
  - when prompted, use the master database password you assigned in step 2
  - run `CREATE USER {USERNAME} WITH ENCRYPTED PASSWORD {PASSWORD};` and keep these values for later
  - run `GRANT ALL PRIVILEGES ON DATABASE "ChatAppDb" TO {USERNAME};`
  - run `cd /server && pnpm run seed`
### 4. Add environment variables
  - create an `.env` file in the project root and copy the values from `.env.sample`
  - add your db credentials to `POSTGRES_USER_DEV` and `POSTGRES_PASSWORD_DEV` and assign a random string to `SESSION_SECRET`
### 5. Run the app
  - ensure docker is running
  - run `sh start_dev` from project root
  - open `localhost:3000` in your browser

*Client and server both have hot reload enable for development
*You can start two clients simultaneously by adding the flag `--two-clients` to the start_dev command. They will be on ports 3000 and 3001.
*Subsequent app stop/starts can use `docker-compose -f docker-compose.dev.yml up` and `docker-compose -f docker-compose.dev.yml down`

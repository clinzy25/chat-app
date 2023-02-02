locals {
  project = "chat-app"
  region  = "us-west-2"
  ami     = "ami-06e85d4c3149db26a"
}

data "aws_vpc" "chat_app_vpc" {
  filter {
    name   = "tag:Name"
    values = ["chat-app-vpc"] # insert values here
  }
}

data "aws_subnet" "bastion_subnet" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.chat_app_vpc.id]
  }
  filter {
    name   = "tag:Name"
    values = ["*public-1*"] # insert values here
  }
}

resource "aws_kms_key" "db_key" {
  description  = "Db encryption key"
  multi_region = true
}

resource "aws_db_instance" "chat_app_db" {
  identifier                      = "chat-app-db"
  db_name                         = "ChatAppDb"
  engine                          = "postgres"
  engine_version                  = "13.7"
  instance_class                  = "db.t3.micro"
  username                        = "postgres"
  password                        = "6zLPRL&7*%obmmb#&6T7N"
  allocated_storage               = 20
  max_allocated_storage           = 22
  final_snapshot_identifier       = "chat-app-db-snapshot"
  db_subnet_group_name            = "rds-subnet-group"
  skip_final_snapshot             = false
  performance_insights_enabled    = true
  multi_az                        = true
  performance_insights_kms_key_id = aws_kms_key.db_key.arn
  storage_encrypted               = true
  kms_key_id                      = aws_kms_key.db_key.arn
  vpc_security_group_ids          = [aws_security_group.allow_bastion.id]
}

resource "aws_security_group" "bastion" {
  name        = "rds-bastion"
  description = "Allow SSH from local dev"
  vpc_id      = data.aws_vpc.chat_app_vpc.id

  ingress {
    description = "SSH from local dev"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["192.168.0.12/32"]
  }

  ingress {
    description = "Postgres from local dev"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["192.168.0.12/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db"
  }
}

resource "aws_security_group" "allow_bastion" {
  name        = "rds-allow-bastion"
  description = "Allow bastion access"
  vpc_id      = data.aws_vpc.chat_app_vpc.id

  ingress {
    description     = "Inbound postgres"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }
  
  ingress {
    description     = "Inbound SSL"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db"
  }
}

resource "aws_instance" "rds_bastion_server" {
  ami                         = local.ami
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  key_name                    = "rds-bastion"
  subnet_id                   = data.aws_subnet.bastion_subnet.id
}

resource "aws_eip" "rds_bastion_eip" {
  instance = aws_instance.rds_bastion_server.id
  vpc      = true
}

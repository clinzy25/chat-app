locals {
  project       = "chat-app"
  region        = "us-west-2"
  ami           = "ami-06e85d4c3149db26a"
  backend_sg_id = "sg-062a78c82cb628c90"
  multi_az      = false
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

data "aws_security_group" "chat_app_backend_sg" {
  id = local.backend_sg_id
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
  password                        = var.db_password
  allocated_storage               = 20
  max_allocated_storage           = 22
  final_snapshot_identifier       = "chat-app-db-snapshot"
  db_subnet_group_name            = "rds-subnet-group"
  skip_final_snapshot             = false
  performance_insights_enabled    = true
  multi_az                        = local.multi_az
  performance_insights_kms_key_id = aws_kms_key.db_key.arn
  storage_encrypted               = true
  kms_key_id                      = aws_kms_key.db_key.arn
  vpc_security_group_ids          = [aws_security_group.rds_sg.id]
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
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Postgres from local dev"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = local.project
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "chat-app-rds"
  description = "Allow bastion access"
  vpc_id      = data.aws_vpc.chat_app_vpc.id

  ingress {
    description     = "Inbound postgres from bastion"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Inbound SSL from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Inbound from ecs backend"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [data.aws_security_group.chat_app_backend_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = local.project
  }
}

resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "bastion_key_pair" {
  key_name   = "rds-bastion"
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "../../${aws_key_pair.bastion_key_pair.key_name}.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

resource "aws_instance" "rds_bastion_server" {
  ami                         = local.ami
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  key_name                    = aws_key_pair.bastion_key_pair.key_name
  subnet_id                   = data.aws_subnet.bastion_subnet.id
  hibernation                 = true
  root_block_device {
    encrypted = true
  }
}

resource "aws_eip" "rds_bastion_eip" {
  instance = aws_instance.rds_bastion_server.id
  vpc      = true
}

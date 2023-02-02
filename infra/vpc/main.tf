locals {
  name             = "chat-app-vpc"
  project          = "chat-app"
  region           = "us-west-2"
  azs              = ["${local.region}a", "${local.region}b"]
  database_subnets = ["10.0.0.0/20", "10.0.16.0/20"]
  public_subnets   = ["10.0.32.0/20", "10.0.48.0/20"]
  private_subnets  = ["10.0.64.0/20", "10.0.80.0/20"]

  tags = {
    Example = local.name
  }
}

resource "aws_vpc" "chat_app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = local.name
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.chat_app_vpc.id
}

resource "aws_subnet" "public_subnets" {
  count                   = length(local.public_subnets)
  vpc_id                  = aws_vpc.chat_app_vpc.id
  cidr_block              = local.public_subnets[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name = "public-${count.index + 1}-${local.project}-subnet"
  }
}

resource "aws_subnet" "private_subnets" {
  count                   = length(local.private_subnets)
  vpc_id                  = aws_vpc.chat_app_vpc.id
  cidr_block              = local.private_subnets[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = false
  tags = {
    Name = "private-${count.index + 1}-${local.project}-subnet"
  }
}

resource "aws_subnet" "db_subnets" {
  count                   = length(local.database_subnets)
  vpc_id                  = aws_vpc.chat_app_vpc.id
  cidr_block              = local.database_subnets[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = false
  tags = {
    Name = "db-${count.index + 1}-${local.project}-subnet"
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = aws_subnet.db_subnets.*.id
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.chat_app_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.chat_app_vpc.id
}

resource "aws_route_table_association" "public_rt_assoc" {
  count          = length(local.public_subnets)
  subnet_id      = element(aws_subnet.public_subnets.*.id, count.index)
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "private_rt_assoc" {
  count          = length(local.private_subnets)
  subnet_id      = element(aws_subnet.private_subnets.*.id, count.index)
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "database_rt_assoc" {
  count          = length(local.database_subnets)
  subnet_id      = element(aws_subnet.db_subnets.*.id, count.index)
  route_table_id = aws_route_table.private_route_table.id
}

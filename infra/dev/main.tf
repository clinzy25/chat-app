locals {
  env     = "dev"
  project = "chat-app"
  tags = {
    env     = "dev"
    project = "chat-app"
  }
}

data "aws_vpc" "chat_app_vpc" {
  filter {
    name   = "tag:Name"
    values = ["chat-app-vpc"] # insert values here
  }
}

data "aws_subnet" "public_subnets" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.chat_app_vpc.id]
  }
  filter {
    name   = "tag:Name"
    values = ["*public*"] # insert values here
  }
}

resource "aws_security_group" "frontend_lb_sg" {
  name        = "${project}-frontend-lb"
  description = "Allow internet traffic"
  vpc_id      = var.vpc_id

  ingress {
    description      = "Internet traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = local.tags
}

resource "aws_security_group" "backend_lb_sg" {
  name        = "${project}-backend-lb"
  description = "Allow internet traffic and egress to frontend"
  vpc_id      = var.vpc_id

  ingress {
    description      = "Internet traffic"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port       = 80
    to_port         = 80
    protocol        = "HTTP"
    security_groups = ["${aws_security_group.frontend_lb_sg.id}"]
  }

  tags = local.tags
}

module "frontend_lb" {
  source                          = "../modules/load-balancer"
  env                             = local.env
  name                            = "${project}-frontend-lb"
  tags                            = local.tags
  sg_ids                          = [aws_security_group.frontend_lb_sg.id]
  subnets                         = [data.aws_subnet.public_subnets.ids]
  vpc_id                          = data.aws_vpc.chat_app_vpc.id
  https_listener_cert_domain_name = "chat01.link"
  https                           = true
  http                            = true
  target_id                       = "asdfasd"
  tg_port                         = 80
}
module "backend_lb" {
  source                          = "../modules/load-balancer"
  env                             = local.env
  name                            = "${project}-backend-lb"
  tags                            = local.tags
  sg_ids                          = [aws_security_group.backend_lb_sg.id]
  subnets                         = [data.aws_subnet.public_subnets.ids]
  vpc_id                          = data.aws_vpc.chat_app_vpc.id
  https_listener_cert_domain_name = "chat01.link"
  https                           = true
  http                            = true
  target_id                       = "asdfasd"
  tg_port                         = 80
}

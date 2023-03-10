locals {
  env     = "prod"
  project = "chat-app"
  tags = {
    env     = "prod"
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

resource "aws_security_group" "frontend_ecs_sg" {
  name        = "${project}-frontend-ecs"
  description = "Allow load balancer access"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow load balancer access"
    from_port       = 80
    to_port         = 80
    protocol        = "HTTP"
    security_groups = ["${aws_security_group.frontend_lb_sg.id}"]
  }

  egress {
    description     = "Allow backend access"
    from_port       = 80
    to_port         = 80
    protocol        = "HTTP"
    security_groups = ["${aws_security_group.backend_lb_sg.id}"]

  }

  tags = local.tags
}

resource "aws_security_group" "backend_ecs_sg" {
  name        = "${project}-backend-ecs"
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


resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${local.project}-cluster"
  configuration {
    log_configuration {
      cloud_watch_encryption_enabled = true
      cloud_watch_log_group_name     = aws_cloudwatch_log_group.ecs_logs.name
    }
  }
}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name = "/ecs/${var.project}-${var.component}"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecsTaskExecutionRole"
  tags               = local.tags
  depends_on         = [aws_iam_role_policy.task_execution_policy]
  assume_role_policy = <<EOF
    {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
    }
    EOF
}

resource "aws_iam_role_policy" "task_execution_policy" {
  name   = "ecsTaskExecutionRolePolicy"
  role   = aws_iam_role.ecs_task_execution_role.id
  policy = <<EOF
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "ecr:GetAuthorizationToken",
                    "ecr:BatchCheckLayerAvailability",
                    "ecr:GetDownloadUrlForLayer",
                    "ecr:BatchGetImage",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                "Resource": "*"
            }
        ]
    }
    EOF
}

module "frontend_lb" {
  source                          = "../modules/load-balancer"
  env                             = local.env
  name                            = "${project}-frontend-lb"
  tags                            = local.tags
  sg_ids                          = [aws_security_group.frontend_lb_sg.id]
  subnets                         = [data.aws_subnet.public_subnets.ids]
  vpc_id                          = data.aws_vpc.chat_app_vpc.id
  https                           = true
  http                            = true
  https_acm_cert_arn              = module.route_53.acm_cert_arn
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
  http                            = true
  https                           = true
  https_acm_cert_arn              = module.route_53.acm_cert_arn
  tg_port                         = 80
}

module "route_53" {
  source               = "../modules/route-53"
  env                  = local.env
  domain_name          = "chat01.link"
  sub_domain_name_1    = "api"
  frontend_lb_dns_name = module.frontend_lb.lb_dns_name
  frontend_lb_zone_id  = module.frontend_lb.lb_zone_id
  backend_lb_dns_name  = module.backend_lb.lb_dns_name
  backend_lb_zone_id   = module.backend_lb.lb_zone_id
}

module "frontend_ecr" {
  source    = "../modules/ecr"
  env       = local.env
  project   = local.project
  component = "frontend"
}

module "backend_ecr" {
  source    = "../modules/ecr"
  env       = local.env
  project   = local.project
  component = "backend"
}

module "frontend_ecs" {
  source                  = "../modules/ecs"
  env                     = local.env
  project                 = local.project
  component               = "frontend"
  cluster_id              = aws_ecs_cluster.ecs_cluster.id
  task_execution_role_arn = aws_iam_role.ecs_task_execution_role.id
  target_group_arn        = module.frontend_lb.target_group_arn
  container_name          = "${local.project}-frontend"
  container_port          = 80
  image_uri               = module.frontend_ecr.ecr_url
  image_digest            = module.frontend_ecr.latest_digest
  log_group_name          = aws_cloudwatch_log_group.ecs_logs.name
  subnets                 = [data.aws_subnet.public_subnets.ids]
  security_group_ids      = [aws_security_group.frontend_ecs_sg.id]
}

module "backend_ecs" {
  source                  = "../modules/ecs"
  env                     = local.env
  project                 = local.project
  component               = "backend"
  cluster_id              = aws_ecs_cluster.ecs_cluster.id
  task_execution_role_arn = aws_iam_role.ecs_task_execution_role.id
  target_group_arn        = module.backend_lb.target_group_arn
  container_name          = "${local.project}-backend"
  container_port          = 80
  image_uri               = module.backend_ecr.ecr_url
  image_digest            = module.backend_ecr.latest_digest
  log_group_name          = aws_cloudwatch_log_group.ecs_logs.name
  subnets                 = [data.aws_subnet.public_subnets.ids]
  security_group_ids      = [aws_security_group.backend_ecs_sg.id]
}

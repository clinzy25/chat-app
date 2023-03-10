resource "aws_ecs_service" "service" {
  name            = "mongodb"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.task_def.arn
  desired_count   = 1
  iam_role        = var.task_execution_role_arn

  network_configuration {
    subnets          = var.subnets
    security_groups  = var.security_group_ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = var.container_name
    container_port   = var.container_port
  }
}

resource "aws_ecs_task_definition" "task_def" {
  family                   = "${var.project}-${var.component}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = var.task_execution_role_arn
  task_role_arn            = var.task_execution_role_arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = <<DEFINITION
    [
        {
            "name": "${var.project}-${var.component}",
            "image": "${var.image_uri}:latest@${var.image_digest}"",
            "cpu": 1024,
            "portMappings": [
                {
                    "name": "${var.component}-${var.container_port}-tcp",
                    "containerPort": ${var.container_port},
                    "hostPort": ${var.container_port},
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [],
            "mountPoints": [],
            "volumesFrom": [],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-create-group": "true",
                    "awslogs-group": "${var.log_group_name}",
                    "awslogs-region": "us-west-2",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
  DEFINITION
}

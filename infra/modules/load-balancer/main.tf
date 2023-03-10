resource "aws_lb" "alb" {
  name               = var.name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.sg_ids]
  subnets            = [for subnet in var.subnets : subnet.id]

  enable_deletion_protection = false

  tags = {
    Environment = "production"
  }
}

resource "aws_lb_listener" "http" {
  count             = var.http ? 1 : 0
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  count             = var.https ? 1 : 0
  load_balancer_arn = aws_lb.alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.https_acm_cert_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_tg.arn
  }
}

resource "aws_lb_target_group" "alb_tg" {
  name        = var.name
  target_type = "alb"
  port        = var.tg_port
  protocol    = "TCP"
  vpc_id      = var.vpc_id

  health_check {
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 5
    interval            = 30
    path                = "/"
    port                = var.tg_port
    timeout             = 5
  }
}

resource "aws_lb_target_group_attachment" "alb_tg_attachment" {
  target_group_arn = aws_lb_target_group.alb_tg.arn
  target_id        = var.target_id
  port             = var.tg_port
}

output "lb_dns_name" {
  description = "The dns name for the load balancer"
  value       = aws_lb.alb.dns_name
}

output "lb_zone_id" {
  description = "The zone id for the load balancer"
  value       = aws_lb.alb.zone_id
}

output "target_group_arn" {
  description = "ARN of the target group for the load balancer"
  value       = aws_lb_target_group.alb_tg.arn
}

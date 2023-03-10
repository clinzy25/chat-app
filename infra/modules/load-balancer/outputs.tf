output "lb_dns_name" {
  description = "The dns name for the load balancer"
  value       = aws_lb.alb.dns_name
}

output "lb_zone_id" {
  description = "The zone id for the load balancer"
  value       = aws_lb.alb.zone_id
}
variable "env" {
  description = "Name of the environment"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the hosted zone and targets"
  type        = string
}

variable "sub_domain_name_1" {
  description = "Sub domain name for the hosted zone and targets"
  type        = string
}

variable "frontend_lb_dns_name" {
  description = "DNS name for frontend load balancer"
  type        = string
}

variable "frontend_zone_id" {
  description = "Zone id for frontend load balancer"
  type        = string
}

variable "backend_lb_dns_name" {
  description = "DNS name for backend load balancer"
  type        = string
}

variable "backend_zone_id" {
  description = "Zone id for backend load balancer"
  type        = string
}

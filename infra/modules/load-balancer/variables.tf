variable "env" {
  description = "Name of the environment"
  type        = string
}

variable "name" {
  description = "Name of the load balancer"
  type        = map(string)
}

variable "tags" {
  description = "Load balancer tags"
  type        = map(string)
  default     = {}
}

variable "sg_ids" {
  description = "List of security group ids for the load balancer"
  type        = map(string)
}

variable "subnets" {
  description = "VPC subnets that the load balancer will use"
  type        = set(string)

}

variable "vpc_id" {
  description = "Id of the VPC that the load balancer will use"
  type        = string
}

variable "https_listener_cert_domain_name" {
  description = "Domain name for HTTPS certificate for HTTPS load balancer listener"
  type        = string
}

variable "https" {
  description = "Create an HTTPS listener"
  type        = bool
}

variable "http" {
  description = "Create an HTTP listener"
  type        = bool
}

variable "target_id" {
  description = "Target id of the load balancer target group"
  type        = string
}

variable "tg_port" {
  description = "Port for the target group"
  type        = number
}

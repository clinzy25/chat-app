variable "env" {
  description = "Name of the environment"
  type        = string
}

variable "name" {
  description = "Name of the load balancer"
  type        = string
}

variable "tags" {
  description = "Load balancer tags"
  type        = map(string)
  default     = {}
}

variable "sg_ids" {
  description = "List of security group ids for the load balancer"
  type        = list
}

variable "subnets" {
  description = "VPC subnets that the load balancer will use"
  type        = list

}

variable "vpc_id" {
  description = "Id of the VPC that the load balancer will use"
  type        = string
}

variable "https_acm_cert_arn" {
  description = "ACM certificate arn for the https listener"
  type        = string
  default     = ""
}
variable "https" {
  description = "Create an HTTPS listener"
  type        = bool
}

variable "http" {
  description = "Create an HTTP listener"
  type        = bool
}

variable "tg_port" {
  description = "Port for the target group"
  type        = number
}

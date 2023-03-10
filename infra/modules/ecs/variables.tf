variable "env" {
  description = "Name of the environment"
  type        = string
}

variable "project" {
  description = "Name of the project"
  type        = string
}

variable "component" {
  description = "Name of the component (eg, frontend, backend)"
  type        = string
}

variable "cluster_id" {
  description = "Id of the ecs cluster"
  type        = string
}

variable "task_execution_role_arn" {
  description = "IAM role arn for the task execution role"
  type        = string
}

variable "target_group_arn" {
  description = "ARN of the target group of the associated load balancer"
  type        = string
}

variable "container_name" {
  description = "Name of the container"
  type        = string
}

variable "container_port" {
  description = "Port of the container"
  type        = string
}

variable "image_uri" {
  description = "URI of the ECR docker image"
  type        = string
}

variable "log_group_name" {
  description = "Cloudwatch log group name for the ECS service"
  type        = string
}

variable "subnets" {
  description = "Subnets to run the service in"
  type        = map(string)
}

variable "security_group_ids" {
  description = "Security group ids for the ECS tasks"
  type        = map(string)
}

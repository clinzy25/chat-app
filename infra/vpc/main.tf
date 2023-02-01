locals {
  name    = "chat-app-vpc"
  project = "chat-app"
  region  = "us-west-2"

  tags = {
    Example    = local.name
    GithubRepo = "terraform-aws-vpc"
    GithubOrg  = "terraform-aws-modules"
  }
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = local.name
  cidr = "10.0.0.0/22"

  azs              = ["${local.region}a", "${local.region}b"]
  database_subnets  = ["10.0.0.0/26", "10.0.0.64/26"] # 128 IPs
  public_subnets   = ["10.0.0.128/25", "10.0.1.0/25"] # 256 IPs
  private_subnets = ["10.0.2.0/24", "10.0.3.0/24"] # 512 IPs
  # 896 total IPs, 128 free
  
  private_subnet_names = ["private-1-${local.project}-subnet", "private-2-${local.project}-subnet"]
  public_subnet_names  = ["public-1-${local.project}-subnet", "public-2-${local.project}-subnet"]
  database_subnet_names  = ["db-1-${local.project}-subnet", "db-2-${local.project}-subnet"]

  create_database_subnet_group = true

  manage_default_network_acl = true
  default_network_acl_tags   = { Name = "${local.name}-default" }

  manage_default_route_table = true
  default_route_table_tags   = { Name = "${local.name}-default" }

  manage_default_security_group = true
  default_security_group_tags   = { Name = "${local.name}-default" }

  enable_dns_hostnames = false
  enable_dns_support   = false

  enable_nat_gateway = false
  single_nat_gateway = false
  enable_vpn_gateway = false

  enable_dhcp_options              = true
  dhcp_options_domain_name         = "service.consul"
  dhcp_options_domain_name_servers = ["127.0.0.1", "10.10.0.2"]

  # VPC Flow Logs (Cloudwatch log group and IAM role will be created)
  enable_flow_log                      = true
  create_flow_log_cloudwatch_log_group = true
  create_flow_log_cloudwatch_iam_role  = true
  flow_log_max_aggregation_interval    = 60

  tags = local.tags
}

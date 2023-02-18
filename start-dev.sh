get_bastion_ip () {
  aws ec2 describe-network-interfaces --region us-west-2 --filters "Name=vpc-id,Values=$(aws ec2 describe-vpcs --region us-west-2 --filter "Name=tag:Name,Values=chat-app-vpc" | jq ".Vpcs[0].VpcId")" "Name=group-name,Values=rds-bastion" | jq ".NetworkInterfaces[0].Association.PublicIp" | tr -d '"'
}
get_rds_ip () {
  aws ec2 describe-network-interfaces --region us-west-2 --filters "Name=vpc-id,Values=$(aws ec2 describe-vpcs --region us-west-2 --filter "Name=tag:Name,Values=chat-app-vpc" | jq ".Vpcs[0].VpcId")" "Name=group-name,Values=chat-app-rds" | jq ".NetworkInterfaces[0].PrivateIpAddress" | tr -d '"'
}

ssh -i rds-bastion.pem -NL 3002:$(get_rds_ip):5432 ec2-user@$(get_bastion_ip) -v & docker-compose -f docker-compose.dev.yml up --build
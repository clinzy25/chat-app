DOCKERFILE=docker-compose.dev.yml
BASTION_ID=$(aws ec2 describe-instances --filters "Name=key-name,Values=rds-bastion" --region us-west-2 | jq ".Reservations[0].Instances[0].InstanceId" | tr -d '"')
BASTION_STATUS=$(aws ec2 describe-instance-status --instance-ids $BASTION_ID --region us-west-2 | jq ".InstanceStatuses") 

while getopts 'two-clients' OPTION; do
  DOCKERFILE=docker-compose.dev.two-clients.yml
done

get_bastion_ip () {
  aws ec2 describe-network-interfaces --region us-west-2 --filters "Name=vpc-id,Values=$(aws ec2 describe-vpcs --region us-west-2 --filter "Name=tag:Name,Values=chat-app-vpc" | jq ".Vpcs[0].VpcId")" "Name=group-name,Values=rds-bastion" | jq ".NetworkInterfaces[0].Association.PublicIp" | tr -d '"'
}
get_rds_ip () {
  aws ec2 describe-network-interfaces --region us-west-2 --filters "Name=vpc-id,Values=$(aws ec2 describe-vpcs --region us-west-2 --filter "Name=tag:Name,Values=chat-app-vpc" | jq ".Vpcs[0].VpcId")" "Name=group-name,Values=chat-app-rds" | jq ".NetworkInterfaces[0].PrivateIpAddress" | tr -d '"'
}

# [CONNECT AND START]
START_BASTION () {
  aws ec2 start-instances --instance-ids $BASTION_ID --region us-west-2
}
CONNECT_TO_BASTION () {
  ssh -i rds-bastion.pem -NL 3002:$(get_rds_ip):5432 ec2-user@$(get_bastion_ip) -v
}
DOCKER_COMPOSE () {
  docker-compose -f $DOCKERFILE up --build
}

if [ ${#BASTION_STATUS[@]} -eq 1 ]; then
  START_BASTION & echo "Starting bastion server..."
fi

CONNECT_TO_BASTION & echo "Connecting to bastion server..."
DOCKER_COMPOSE & echo "Starting dev environment..."


# [CLOSE CONNECTIONS]
trap "docker-compose -f $DOCKERFILE down & kill-port 3002 & aws ec2 stop-instances --instance-ids $BASTION_ID --hibernate --region us-west-2" SIGHUP
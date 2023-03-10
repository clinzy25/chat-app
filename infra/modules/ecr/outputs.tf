output "ecr_url" {
  description = "URL for ecr repo"
  value       = aws_ecr_repository.ecr_repo.repository_url
}

output "latest_digest" {
  description = "This is the images digest used to help trigger a build with terraform"
  value = data.aws_ecr_image.latest_image.id
}
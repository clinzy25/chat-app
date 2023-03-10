output "ecr_url" {
  description = "URL for ecr repo"
  value       = aws_ecr_repository.ecr_repo.repository_url
}

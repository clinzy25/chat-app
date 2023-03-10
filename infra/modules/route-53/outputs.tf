output "acm_cert_arn" {
  description = "ARN of the acm certificate"
  value       = aws_acm_certificate.cert.arn
}

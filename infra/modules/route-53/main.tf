

resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_route53_record" "frontend_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.frontend_lb_dns_name
    zone_id                = var.frontend_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "frontend_aaaa" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = var.frontend_lb_dns_name
    zone_id                = var.frontend_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "backend_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "${var.sub_domain_name}.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.backend_lb_dns_name
    zone_id                = var.backend_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "backend_aaaa" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "${var.sub_domain_name}.${var.domain_name}"
  type    = "AAAA"

  alias {
    name                   = var.backend_lb_dns_name
    zone_id                = var.backend_zone_id
    evaluate_target_health = true
  }
}

resource "aws_acm_certificate" "cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  tags = {
    Environment = var.env
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "example" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in [aws_route53_record.frontend_a, aws_route53_record.frontend_aaaa, aws_route53_record.backend_a, aws_route53_record.backend_aaaa, cname] : record.fqdn]
}


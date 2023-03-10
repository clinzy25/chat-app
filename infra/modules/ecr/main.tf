resource "aws_ecr_repository" "ecr_repo" {
  name                 = "${var.project}-${var.env}-${var.component}-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

data "aws_ecr_image" "latest_image" {
  repository_name = "${var.project}-${var.env}-${var.component}-repo"
  image_tag       = "latest"
}

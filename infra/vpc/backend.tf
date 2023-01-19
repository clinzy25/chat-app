terraform {
  backend "s3" {
    bucket = "tfstate9945"
    key    = "vpc/vpc.tfstate"
    region = "us-west-2"
  }
}

terraform {
  backend "s3" {
    bucket = "tfstate9945"
    key    = "db/db.tfstate"
    region = "us-west-2"
  }
}


terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region for CodeSentinel infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "existing_instance_id" {
  description = "Existing CodeSentinel EC2 instance ID"
  type        = string
  default     = "i-0736a394f3cb2b214"
}

data "aws_caller_identity" "current" {}

data "aws_instance" "codesentinel" {
  instance_id = var.existing_instance_id
}

# Main artifacts bucket
resource "aws_s3_bucket" "artifacts" {
  bucket = "codesentinel-artifacts-${data.aws_caller_identity.current.account_id}-${var.aws_region}"

  force_destroy = false

  tags = {
    Name        = "CodeSentinel-Artifacts"
    Project     = "CodeSentinel"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

# Enable versioning
resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption (AES256)
resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle management
resource "aws_s3_bucket_lifecycle_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    id     = "cleanup-old-artifacts"
    status = "Enabled"

    filter {}

    expiration {
      days = 90
    }
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# Outputs
output "existing_ec2_id" {
  value = data.aws_instance.codesentinel.id
}

output "existing_ec2_type" {
  value = data.aws_instance.codesentinel.instance_type
}

output "artifacts_bucket_name" {
  value = aws_s3_bucket.artifacts.bucket
}


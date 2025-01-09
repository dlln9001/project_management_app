terraform {
    required_providers {
        google = {
            source = "hashicorp/google"
            version = "6.8.0"
        }
    }

    backend "gcs" {
        bucket  = "project-management-app-terraform-bucket"
    }
}


provider "google" {
    project = var.project_id
    region  = "us-central1"
    zone    = "us-central1-c"
}


resource "google_compute_instance" "web-server" {
    name = "test-vm-2"
    machine_type = "e2-micro"

    boot_disk {
    initialize_params {
        image = "debian-12-bookworm-v20241210"
    }
    }

    network_interface {
        network = "default"

        access_config {
          
        }
    }

    metadata = {
      ssh-keys = "dfcross18:${file("ssh_public_key.txt")}"
    }

    tags = ["https-server", "http-server"]
}


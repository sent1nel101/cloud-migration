/**
 * Resource Database
 * 
 * Maps career roles to real, curated learning resources:
 * - Courses (Coursera, Udemy, LinkedIn Learning, etc.)
 * - Certifications (industry-standard credentials)
 * - Communities (forums, Discord, Reddit, etc.)
 * 
 * Used by the roadmap API to populate resource links for users.
 */

export interface ResourceLink {
  name: string
  url: string
  platform?: string
}

export interface RoleResources {
  courses: ResourceLink[]
  certifications: ResourceLink[]
  communities: ResourceLink[]
}

/**
 * Resource mappings for common roles
 * Keys are role titles (normalized to lowercase for matching)
 */
export const ROLE_RESOURCES: Record<string, RoleResources> = {
  "cloud architect": {
    courses: [
      {
        name: "AWS Solutions Architect Professional",
        url: "https://www.coursera.org/professional-certificates/aws-cloud-architect",
        platform: "Coursera",
      },
      {
        name: "Google Cloud Professional Cloud Architect",
        url: "https://www.coursera.org/learn/preparing-cloud-professional-cloud-architect-exam",
        platform: "Coursera",
      },
      {
        name: "Azure Administrator Certified Associate",
        url: "https://learn.microsoft.com/en-us/certifications/azure-administrator/",
        platform: "Microsoft Learn",
      },
      {
        name: "Cloud Architecture Design Patterns",
        url: "https://www.udemy.com/course/aws-solutions-architect-professional/",
        platform: "Udemy",
      },
    ],
    certifications: [
      {
        name: "AWS Solutions Architect Associate",
        url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
      },
      {
        name: "AWS Solutions Architect Professional",
        url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
      },
      {
        name: "Google Cloud Professional Cloud Architect",
        url: "https://cloud.google.com/certification/cloud-architect",
      },
      {
        name: "Azure Solutions Architect Expert",
        url: "https://learn.microsoft.com/en-us/certifications/azure-solutions-architect/",
      },
    ],
    communities: [
      {
        name: "AWS Architecture Community",
        url: "https://www.reddit.com/r/aws/",
      },
      {
        name: "Cloud Architecture Discord",
        url: "https://discord.gg/cloud-architects",
      },
      {
        name: "Stack Exchange - Cloud",
        url: "https://stackoverflow.com/questions/tagged/cloud-architecture",
      },
      {
        name: "Slack Cloud Architects",
        url: "https://cloudarchitects.slack.com",
      },
    ],
  },

  "cloud engineer": {
    courses: [
      {
        name: "AWS Developer Associate",
        url: "https://www.coursera.org/learn/aws-developer",
        platform: "Coursera",
      },
      {
        name: "Google Cloud Engineer Track",
        url: "https://www.coursera.org/professional-certificates/google-cloud-engineering",
        platform: "Coursera",
      },
      {
        name: "Kubernetes for Developers",
        url: "https://www.udemy.com/course/kubernetes-for-developers/",
        platform: "Udemy",
      },
      {
        name: "Docker & Kubernetes Complete Guide",
        url: "https://www.udemy.com/course/docker-kubernetes-the-complete-guide/",
        platform: "Udemy",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer Associate",
        url: "https://aws.amazon.com/certification/certified-developer-associate/",
      },
      {
        name: "Google Cloud Associate Cloud Engineer",
        url: "https://cloud.google.com/certification/cloud-engineer",
      },
      {
        name: "Kubernetes Administrator (CKA)",
        url: "https://www.cncf.io/certification/cka/",
      },
      {
        name: "HashiCorp Certified: Terraform Associate",
        url: "https://www.hashicorp.com/certification/terraform-associate",
      },
    ],
    communities: [
      {
        name: "DevOps Community",
        url: "https://www.reddit.com/r/devops/",
      },
      {
        name: "Kubernetes Slack",
        url: "https://kubernetes.slack.com",
      },
      {
        name: "Cloud Native Computing Foundation",
        url: "https://www.cncf.io/community/",
      },
      {
        name: "Docker Community Forums",
        url: "https://forums.docker.com",
      },
    ],
  },

  "data engineer": {
    courses: [
      {
        name: "Google Cloud Data Engineer Professional",
        url: "https://www.coursera.org/professional-certificates/gcp-data-engineering",
        platform: "Coursera",
      },
      {
        name: "Data Engineering with Apache Spark",
        url: "https://www.udemy.com/course/spark-and-python-for-big-data-with-pyspark/",
        platform: "Udemy",
      },
      {
        name: "Cloud SQL and BigQuery",
        url: "https://www.coursera.org/learn/google-cloud-sql-bigquery-mysql",
        platform: "Coursera",
      },
      {
        name: "AWS Data Pipeline Development",
        url: "https://www.udemy.com/course/aws-data-pipeline/",
        platform: "Udemy",
      },
    ],
    certifications: [
      {
        name: "Google Cloud Professional Data Engineer",
        url: "https://cloud.google.com/certification/data-engineer",
      },
      {
        name: "AWS Certified Data Analytics",
        url: "https://aws.amazon.com/certification/certified-data-analytics-specialty/",
      },
      {
        name: "Databricks Lakehouse Fundamentals",
        url: "https://www.databricks.com/learn/training/lakehouse-fundamentals",
      },
      {
        name: "Cloudera Certified Associate",
        url: "https://www.cloudera.com/about/training/certification.html",
      },
    ],
    communities: [
      {
        name: "r/dataengineering",
        url: "https://www.reddit.com/r/dataengineering/",
      },
      {
        name: "Data Engineering Stack Exchange",
        url: "https://stackoverflow.com/questions/tagged/data-engineering",
      },
      {
        name: "Apache Spark Community",
        url: "https://spark.apache.org/community.html",
      },
      {
        name: "dbt Community Slack",
        url: "https://www.getdbt.com/community/",
      },
    ],
  },

  "devops engineer": {
    courses: [
      {
        name: "AWS DevOps Engineer Professional",
        url: "https://www.coursera.org/learn/aws-devops",
        platform: "Coursera",
      },
      {
        name: "CI/CD with Jenkins and GitLab",
        url: "https://www.udemy.com/course/jenkins-complete-guide/",
        platform: "Udemy",
      },
      {
        name: "Terraform Fundamentals",
        url: "https://www.coursera.org/learn/terraform",
        platform: "Coursera",
      },
      {
        name: "Kubernetes Deep Dive",
        url: "https://www.udemy.com/course/kubernetes-deep-dive/",
        platform: "Udemy",
      },
    ],
    certifications: [
      {
        name: "AWS Certified DevOps Engineer Professional",
        url: "https://aws.amazon.com/certification/certified-devops-engineer-professional/",
      },
      {
        name: "Kubernetes Administrator (CKA)",
        url: "https://www.cncf.io/certification/cka/",
      },
      {
        name: "Terraform Associate",
        url: "https://www.hashicorp.com/certification/terraform-associate",
      },
      {
        name: "Certified Kubernetes Security Specialist",
        url: "https://www.cncf.io/certification/cks/",
      },
    ],
    communities: [
      {
        name: "r/devops",
        url: "https://www.reddit.com/r/devops/",
      },
      {
        name: "DevOps Slack Communities",
        url: "https://devopsengineers.com",
      },
      {
        name: "Linux Academy Community",
        url: "https://www.linuxacademy.com/community",
      },
      {
        name: "HashiCorp Community Forum",
        url: "https://discuss.hashicorp.com",
      },
    ],
  },

  "solutions architect": {
    courses: [
      {
        name: "AWS Solutions Architect Professional",
        url: "https://www.coursera.org/professional-certificates/aws-cloud-architect",
        platform: "Coursera",
      },
      {
        name: "Enterprise Architecture Design",
        url: "https://www.udemy.com/course/enterprise-architecture/",
        platform: "Udemy",
      },
      {
        name: "Cloud Architecture Best Practices",
        url: "https://www.coursera.org/learn/cloud-architecture",
        platform: "Coursera",
      },
      {
        name: "Microservices Architecture",
        url: "https://www.udemy.com/course/microservices-architecture/",
        platform: "Udemy",
      },
    ],
    certifications: [
      {
        name: "AWS Solutions Architect Professional",
        url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
      },
      {
        name: "Azure Solutions Architect Expert",
        url: "https://learn.microsoft.com/en-us/certifications/azure-solutions-architect/",
      },
      {
        name: "Google Cloud Architect",
        url: "https://cloud.google.com/certification/cloud-architect",
      },
      {
        name: "TOGAF 9 Certification",
        url: "https://www.opengroup.org/togaf",
      },
    ],
    communities: [
      {
        name: "Cloud Architecture Slack",
        url: "https://cloudarchitects.slack.com",
      },
      {
        name: "r/aws",
        url: "https://www.reddit.com/r/aws/",
      },
      {
        name: "The Open Group Forum",
        url: "https://www.opengroup.org/community",
      },
      {
        name: "Enterprise Architecture Board",
        url: "https://architecture.archimatetool.com",
      },
    ],
  },
}

/**
 * Get resources for a specific role
 * Falls back to generic cloud resources if role not found
 */
export function getResourcesForRole(roleName: string): RoleResources {
  const normalized = roleName.toLowerCase()

  // Try exact match
  if (ROLE_RESOURCES[normalized]) {
    return ROLE_RESOURCES[normalized]
  }

  // Try partial match (e.g., "architect" in role name)
  const partialMatch = Object.entries(ROLE_RESOURCES).find(([key]) =>
    normalized.includes(key) || key.includes(normalized)
  )

  if (partialMatch) {
    return partialMatch[1]
  }

  // Return generic cloud resources as fallback
  return ROLE_RESOURCES["cloud architect"]
}

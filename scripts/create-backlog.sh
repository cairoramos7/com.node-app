#!/bin/bash

# Script para criar backlog inicial no GitHub Issues
# Requer gh cli autenticado

echo "🚀 Iniciando criação de backlog..."

# Features
gh issue create --title "Feature: Comments System" --body "Implement comments system for tasks.\n- CRUD for comments\n- Association with User and Task" --label "enhancement"
gh issue create --title "Feature: Likes/Reactions" --body "Implement likes/reactions system for tasks." --label "enhancement"
gh issue create --title "Feature: Advanced Search & Pagination" --body "Add filters and pagination to task listing." --label "enhancement"

# DevOps
gh issue create --title "DevOps: CI/CD Pipeline Deployment" --body "Configure continuous deployment (CD) pipeline." --label "documentation"
gh issue create --title "DevOps: Docker Compose for Production" --body "Optimize Dockerfile and Compose for production environment." --label "documentation"

# Quality
gh issue create --title "Quality: Increase Test Coverage to 100%" --body "Cover remaining edge cases and branches in tests." --label "good first issue"

echo "✅ Issues created successfully!"
echo "👉 Now go to the 'Projects' tab on GitHub, create a new project, and click 'Add items from repository'."

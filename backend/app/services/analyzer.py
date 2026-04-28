"""Repository analysis service for detecting languages, architecture, and structure."""

import os
import json
from pathlib import Path
from collections import defaultdict, Counter
from typing import Optional
from app.services.parser import parse_infrastructure

# Language file extensions mapping
LANGUAGE_EXTENSIONS = {
    "python": [".py"],
    "javascript": [".js", ".jsx", ".mjs"],
    "typescript": [".ts", ".tsx"],
    "java": [".java"],
    "go": [".go"],
    "rust": [".rs"],
    "cpp": [".cpp", ".cc", ".cxx", ".h", ".hpp"],
    "c": [".c", ".h"],
    "csharp": [".cs"],
    "php": [".php"],
    "ruby": [".rb"],
    "swift": [".swift"],
    "kotlin": [".kt", ".kts"],
    "bash": [".sh", ".bash"],
    "sql": [".sql"],
    "html": [".html", ".htm"],
    "css": [".css", ".scss", ".sass", ".less"],
    "json": [".json"],
    "xml": [".xml"],
    "yaml": [".yaml", ".yml"],
    "dockerfile": ["dockerfile"],
    "makefile": ["makefile"],
}

# Important files to look for
IMPORTANT_FILES = {
    "package.json": "Node.js project",
    "requirements.txt": "Python dependencies",
    "setup.py": "Python setup",
    "pyproject.toml": "Python project",
    "Dockerfile": "Container setup",
    "docker-compose.yml": "Docker Compose",
    "Gemfile": "Ruby dependencies",
    "go.mod": "Go dependencies",
    "Cargo.toml": "Rust project",
    "pom.xml": "Maven (Java)",
    "build.gradle": "Gradle (Java)",
    ".github/workflows": "GitHub Actions",
    "README.md": "Documentation",
    ".env.example": "Environment config",
    "terraform": "Infrastructure as Code",
    "kubernetes": "Kubernetes configs",
    ".gitlab-ci.yml": "GitLab CI",
    ".travis.yml": "Travis CI",
}


class RepositoryAnalyzer:
    """Analyzes repository structure and content."""
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.languages = Counter()
        self.file_count = 0
        self.directory_count = 0
        self.important_files = []
        self.readme_content = None
        self.main_language = None
        self.architecture_insights = []
    
    def analyze(self) -> dict:
        """Run full analysis on repository.
        
        Returns:
            dict containing analysis results
        """
        if not self.repo_path.exists():
            return self._error_response("Repository path does not exist")
        
        try:
            self._scan_languages()
            self._find_important_files()
            self._read_readme()
            self._generate_insights()
            
            # Parse infrastructure files
            infrastructure = parse_infrastructure(str(self.repo_path))
            
            return {
                "success": True,
                "languages": dict(self.languages.most_common()),
                "main_language": self.main_language,
                "file_count": self.file_count,
                "directory_count": self.directory_count,
                "important_files": self.important_files,
                "readme_preview": self.readme_content[:500] if self.readme_content else None,
                "architecture_insights": self.architecture_insights,
                "infrastructure": infrastructure,
            }
        except Exception as e:
            return self._error_response(f"Analysis failed: {str(e)}")
    
    def _scan_languages(self) -> None:
        """Scan repository for programming languages."""
        try:
            for root, dirs, files in os.walk(self.repo_path):
                # Skip common ignored directories
                dirs[:] = [d for d in dirs if not self._should_ignore_dir(d)]
                
                self.directory_count += len(dirs)
                
                for file in files:
                    self.file_count += 1
                    file_lower = file.lower()
                    ext = Path(file).suffix.lower()
                    
                    # Check by extension
                    for lang, exts in LANGUAGE_EXTENSIONS.items():
                        if ext in exts or file_lower == lang.lower():
                            self.languages[lang] += 1
                            break
                    
                    # Special case for Dockerfile
                    if file_lower == "dockerfile":
                        self.languages["dockerfile"] += 1
        except Exception as e:
            print(f"Error scanning languages: {e}")
    
    def _should_ignore_dir(self, dirname: str) -> bool:
        """Check if directory should be ignored in analysis."""
        ignore_dirs = {
            ".git", ".github", "node_modules", "__pycache__", ".venv", 
            ".env", "dist", "build", ".next", ".nuxt", "coverage",
            ".pytest_cache", "htmlcov", "venv", "ENV", "env",
            ".vscode", ".idea", ".DS_Store", ".terraform",
        }
        return dirname in ignore_dirs
    
    def _find_important_files(self) -> None:
        """Identify important files in repository."""
        try:
            for root, dirs, files in os.walk(self.repo_path):
                dirs[:] = [d for d in dirs if not self._should_ignore_dir(d)]
                
                for file in files:
                    file_lower = file.lower()
                    
                    # Check exact matches
                    for important_file, description in IMPORTANT_FILES.items():
                        if file_lower == important_file.lower():
                            rel_path = os.path.relpath(
                                os.path.join(root, file), 
                                self.repo_path
                            )
                            self.important_files.append({
                                "name": file,
                                "path": rel_path,
                                "description": description
                            })
                    
                    # Check for directory matches
                    relative_path = os.path.relpath(root, self.repo_path)
                    for pattern in [".github/workflows", "kubernetes", "terraform"]:
                        if pattern in relative_path.lower():
                            if not any(p["path"] == relative_path for p in self.important_files):
                                self.important_files.append({
                                    "name": pattern,
                                    "path": relative_path,
                                    "description": IMPORTANT_FILES.get(pattern, pattern)
                                })
        except Exception as e:
            print(f"Error finding important files: {e}")
    
    def _read_readme(self) -> None:
        """Extract README content."""
        readme_names = ["README.md", "readme.md", "README.txt", "readme.txt"]
        
        try:
            for root, dirs, files in os.walk(self.repo_path):
                dirs[:] = [d for d in dirs if not self._should_ignore_dir(d)]
                
                for readme_name in readme_names:
                    if readme_name in files:
                        readme_path = os.path.join(root, readme_name)
                        with open(readme_path, "r", encoding="utf-8", errors="ignore") as f:
                            self.readme_content = f.read()
                            return
        except Exception as e:
            print(f"Error reading README: {e}")
    
    def _generate_insights(self) -> None:
        """Generate architecture insights based on analysis."""
        insights = []
        
        # Main language
        if self.languages:
            self.main_language = self.languages.most_common(1)[0][0].title()
            insights.append(f"Primary language: {self.main_language}")
        
        # Multi-language detection
        if len(self.languages) > 3:
            langs = ", ".join([lang.title() for lang, _ in self.languages.most_common(3)])
            insights.append(f"Multi-language project: {langs}")
        
        # Framework detection
        if any(f["name"] == "package.json" for f in self.important_files):
            insights.append("🔧 Node.js/JavaScript ecosystem detected")
        
        if any(f["name"] == "requirements.txt" for f in self.important_files):
            insights.append("🐍 Python project with dependencies")
        
        if any(f["name"] == "go.mod" for f in self.important_files):
            insights.append("🚀 Go project detected")
        
        if any(f["name"] == "Dockerfile" for f in self.important_files):
            insights.append("🐳 Containerized application (Docker)")
        
        if any(f["name"] == "docker-compose.yml" for f in self.important_files):
            insights.append("🐳 Multi-container setup (Docker Compose)")
        
        if any(".github/workflows" in f["path"] for f in self.important_files):
            insights.append("⚙️ CI/CD with GitHub Actions")
        
        if any("kubernetes" in f["path"].lower() for f in self.important_files):
            insights.append("☸️ Kubernetes deployment configs")
        
        if any("terraform" in f["path"].lower() for f in self.important_files):
            insights.append("🏗️ Infrastructure as Code (Terraform)")
        
        # Size estimation
        if self.file_count > 1000:
            insights.append(f"📊 Large project: {self.file_count:,} files")
        elif self.file_count > 100:
            insights.append(f"📊 Medium project: {self.file_count} files")
        else:
            insights.append(f"📊 Smaller project: {self.file_count} files")
        
        self.architecture_insights = insights
    
    @staticmethod
    def _error_response(message: str) -> dict:
        """Generate error response."""
        return {
            "success": False,
            "error": message,
            "languages": {},
            "main_language": None,
            "file_count": 0,
            "directory_count": 0,
            "important_files": [],
            "readme_preview": None,
            "architecture_insights": [],
        }


def analyze_repository(repo_path: str) -> dict:
    """Convenience function to analyze a repository.
    
    Args:
        repo_path: Path to repository directory
        
    Returns:
        dict with analysis results
    """
    analyzer = RepositoryAnalyzer(repo_path)
    return analyzer.analyze()

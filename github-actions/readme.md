# github-pages-verification

`github-pages-verification` is a lightweight validation tool for checking your GitHub Pages site **before deployment**. It helps detect common issues early, ensuring your site is clean, optimized, and ready to publish.

## Features

* **File size validation**
  Detects files that exceed configured size limits to help prevent slow page loads and GitHub Pages deployment issues.

* **Empty content detection**
  Finds empty pages, assets, or generated files that may indicate broken builds or missing content.

* **Content sanity checks** *(optional)*
  Runs additional validation checks to verify content integrity before publishing.

* **CI/CD friendly**
  Easily integrates into GitHub Actions or other CI/CD pipelines, and can also be run locally as a pre-deploy check.

## Why use `github-pages-verification`?

Publishing a broken or oversized GitHub Pages site can lead to:

* Failed deployments
* Slow-loading pages
* Missing assets or blank content
* Poor user experience

`github-pages-verification` helps catch these problems before your site goes live, making deployments safer and more reliable.

## Usage

Run the verification step locally before deployment or integrate it into your CI workflow.

### Example GitHub Actions workflow

See this example workflow configuration:

[GitHub Actions example workflow](https://github.com/dimaslanjaka/dimaslanjaka.github.io/blob/cd04dfc459f7b56e7dfdd40825b2e5b150183ef3/.github/workflows/install.yml?utm_source=chatgpt.com)

## Typical Use Cases

* Validating static site builds before publishing
* Preventing oversized assets from being deployed
* Detecting incomplete or empty generated content
* Adding quality checks to automated deployment pipelines

## Goal

The main goal of `github-pages-verification` is to provide a simple and automated safety layer for GitHub Pages deployments, helping maintain consistent site quality with minimal setup.

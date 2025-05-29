github-pages-verification
=========================

`github-pages-verification` is a validation tool designed to run checks on your GitHub Pages site **before** publishing. It helps ensure your site meets essential quality standards and prevents common issues that could affect the user experience or deployment success.

Features
--------

-   **File size validation**: Detects files that exceed specified size limits to avoid slow loading or GitHub Pages restrictions.

-   **Empty content detection**: Identifies pages or assets with empty or missing content.

-   **Content sanity checks**: (Optional) Additional checks to ensure content integrity before deployment.

-   **Easy integration**: Can be incorporated into your CI/CD pipeline or run locally as a pre-deploy step.

Why use github-pages-verification?
----------------------------------

Deploying a broken or oversized GitHub Pages site can result in poor user experience, build failures, or unexpected errors. This tool helps catch such issues early, so you can fix them before pushing your site live.
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const { spawn } = require("git-command-helper");
const args = require("minimist")(process.argv.slice(2));
const { JSDOM } = require("jsdom");
const color = require("ansi-colors");
const { writefile } = require("sbg-utility");

const root = process.cwd();
const configPath = path.join(root, "github-actions-validator.config.yml");

if (!fs.existsSync(configPath)) {
	console.error("Missing config file:", configPath);
	process.exit(1);
}

const config = yaml.parse(fs.readFileSync(configPath, "utf8"));

// Save schema
writefile(
	path.join(__dirname, "tmp/schema.json"),
	JSON.stringify(config, null, 2)
);

let hasErrors = false;

/**
 * Validates a file's existence, size, and DOM body content.
 * @param {string} file - Full path to the file
 * @param {string} label - Human-readable label for the file (e.g., homepage)
 */
function validate(file, label) {
	if (!fs.existsSync(file)) {
		console.error(`${label}: File does not exist -> ${file}`);
		hasErrors = true;
		return;
	}

	const stats = fs.statSync(file);
	if (stats.size === 0) {
		console.error(`${label}: File is empty -> ${file}`);
		hasErrors = true;
		return;
	}

	try {
		const dom = new JSDOM(fs.readFileSync(file, "utf8"));
		const bodyEmpty = dom.window.document.body.innerHTML.trim().length === 0;
		if (bodyEmpty) {
			throw new Error(`${label}: <body> is empty`);
		}
	} catch (err) {
		console.error(`${label}: DOM parse error -> ${err.message}`);
		hasErrors = true;
	}
}

(async function main() {
	// Validate files
	for (const [name, relPath] of Object.entries(config.validate || {})) {
		const fullPath = path.resolve(root, relPath);
		console.log("Validating:", color.magenta(name), fullPath.replace(root, ""));
		validate(fullPath, name);
	}

	if (hasErrors) {
		process.exit(1);
	}

	// Run npm install in specified directories
	for (const dir of config.install || []) {
		const cwd = path.resolve(root, dir);
		const yarnLock = path.join(cwd, "yarn.lock");
		const packageLock = path.join(cwd, "package-lock.json");

		try {
			[yarnLock, packageLock].forEach((file) => {
				if (fs.existsSync(file)) fs.rmSync(file, { force: true });
			});

			console.log("Installing node_modules in:", dir, "->", cwd);
			await spawn("npm", ["install", "--omit=dev"], { cwd });
		} catch (err) {
			console.error("Install failed for:", dir, "-", err.message);
		}
	}
})();

const { execSync } = require("child_process")
const chalk = require("chalk")

console.log(chalk.blue("Checking TypeScript types..."))

try {
  execSync("tsc --noEmit", { stdio: "inherit" })
  console.log(chalk.green("✓ TypeScript types are valid"))
} catch (error) {
  console.error(chalk.red("✗ TypeScript type check failed"))
  process.exit(1)
}

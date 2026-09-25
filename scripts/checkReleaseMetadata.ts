import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

type ReleaseMetadataInput = {
  baseVersion: string
  currentVersion: string
  changedFiles: string[]
  changelogExists: boolean
}

type VersionParts = [number, number, number]

function parseStableVersion(version: string): VersionParts | null {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null
}

export function validateReleaseMetadata({
  baseVersion,
  currentVersion,
  changedFiles,
  changelogExists,
}: ReleaseMetadataInput): string[] {
  const currentVersionParts = parseStableVersion(currentVersion)
  const changedChangelogs = changedFiles.filter((file) => file.startsWith('changelogs/'))
  const versionChanged = baseVersion !== currentVersion
  const errors: string[] = []

  if (!currentVersionParts) {
    errors.push(
      `package.json version ${currentVersion} must use X.Y.Z with nonnegative integers and no leading zeros.`,
    )
  }

  if (!versionChanged && changedChangelogs.length === 0) return errors

  const expectedChangelog = `changelogs/${currentVersion}/CHANGELOG.md`

  if (versionChanged) {
    const baseVersionParts = parseStableVersion(baseVersion)
    if (!baseVersionParts) {
      errors.push(
        `Base package version ${baseVersion} must use X.Y.Z with nonnegative integers and no leading zeros.`,
      )
    } else if (currentVersionParts) {
      const versionDifference =
        currentVersionParts[0] - baseVersionParts[0] ||
        currentVersionParts[1] - baseVersionParts[1] ||
        currentVersionParts[2] - baseVersionParts[2]
      if (versionDifference <= 0) {
        errors.push(
          `Release version ${currentVersion} must be greater than base version ${baseVersion}.`,
        )
      }
    }
  }

  if (versionChanged && !changedChangelogs.includes(expectedChangelog)) {
    errors.push(`A version change to ${currentVersion} must include ${expectedChangelog}.`)
  }

  for (const file of changedChangelogs) {
    if (file !== expectedChangelog) {
      errors.push(
        `${file} must match package.json version ${currentVersion}; use ${expectedChangelog}.`,
      )
    }
  }

  if (changedChangelogs.includes(expectedChangelog) && !changelogExists) {
    errors.push(`${expectedChangelog} is missing from the working tree.`)
  }

  return errors
}

function runReleaseMetadataCheck(): void {
  const baseBranch = process.env.GITHUB_BASE_REF
  if (!baseBranch) {
    console.error('GITHUB_BASE_REF is required to check release metadata.')
    process.exitCode = 1
    return
  }

  const baseRef = `origin/${baseBranch}`
  const basePackage = JSON.parse(
    execFileSync('git', ['show', `${baseRef}:package.json`], { encoding: 'utf8' }),
  ) as { version: string }
  const currentPackage = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }
  const changedFiles = execFileSync('git', ['diff', '--name-only', `${baseRef}...HEAD`], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
  const currentChangelog = `changelogs/${currentPackage.version}/CHANGELOG.md`
  const errors = validateReleaseMetadata({
    baseVersion: basePackage.version,
    currentVersion: currentPackage.version,
    changedFiles,
    changelogExists: existsSync(currentChangelog),
  })

  if (errors.length > 0) {
    for (const error of errors) console.error(error)
    process.exitCode = 1
    return
  }

  console.log('Release metadata is consistent.')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runReleaseMetadataCheck()
}

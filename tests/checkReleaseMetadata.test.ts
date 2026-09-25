import { describe, expect, it } from 'vitest'
import { validateReleaseMetadata } from '../scripts/checkReleaseMetadata'

describe('validateReleaseMetadata', () => {
  it('allows ordinary changes without release metadata', () => {
    expect(
      validateReleaseMetadata({
        baseVersion: '0.1.0',
        currentVersion: '0.1.0',
        changedFiles: ['src/components/Button.tsx'],
        changelogExists: true,
      }),
    ).toEqual([])
  })

  it.each(['0.2', '0.02.0', '00.1.0'])(
    'rejects %s because package versions must use stable X.Y.Z SemVer without release metadata',
    (version) => {
      expect(
        validateReleaseMetadata({
          baseVersion: version,
          currentVersion: version,
          changedFiles: ['src/components/Button.tsx'],
          changelogExists: false,
        }),
      ).toContain(
        `package.json version ${version} must use X.Y.Z with nonnegative integers and no leading zeros.`,
      )
    },
  )

  it('allows the initial changelog when it matches the existing package version', () => {
    expect(
      validateReleaseMetadata({
        baseVersion: '0.1.0',
        currentVersion: '0.1.0',
        changedFiles: ['changelogs/0.1.0/CHANGELOG.md'],
        changelogExists: true,
      }),
    ).toEqual([])
  })

  it('rejects a changelog for a different package version', () => {
    expect(
      validateReleaseMetadata({
        baseVersion: '0.1.0',
        currentVersion: '0.1.0',
        changedFiles: ['changelogs/0.2.0/CHANGELOG.md'],
        changelogExists: true,
      }),
    ).toContain(
      'changelogs/0.2.0/CHANGELOG.md must match package.json version 0.1.0; use changelogs/0.1.0/CHANGELOG.md.',
    )
  })

  it('requires the matching changelog when the package version changes', () => {
    expect(
      validateReleaseMetadata({
        baseVersion: '0.1.0',
        currentVersion: '0.2.0',
        changedFiles: ['package.json'],
        changelogExists: false,
      }),
    ).toContain('A version change to 0.2.0 must include changelogs/0.2.0/CHANGELOG.md.')
  })

  it('allows a version change with its matching changelog', () => {
    expect(
      validateReleaseMetadata({
        baseVersion: '0.1.0',
        currentVersion: '0.2.0',
        changedFiles: ['package.json', 'changelogs/0.2.0/CHANGELOG.md'],
        changelogExists: true,
      }),
    ).toEqual([])
  })

  it('rejects a release version that is not greater than the base version', () => {
    expect(
      validateReleaseMetadata({
        baseVersion: '0.2.0',
        currentVersion: '0.1.9',
        changedFiles: ['package.json', 'changelogs/0.1.9/CHANGELOG.md'],
        changelogExists: true,
      }),
    ).toContain('Release version 0.1.9 must be greater than base version 0.2.0.')
  })

  it('rejects a matching changelog that is missing from the working tree', () => {
    expect(
      validateReleaseMetadata({
        baseVersion: '0.1.0',
        currentVersion: '0.1.0',
        changedFiles: ['changelogs/0.1.0/CHANGELOG.md'],
        changelogExists: false,
      }),
    ).toContain('changelogs/0.1.0/CHANGELOG.md is missing from the working tree.')
  })
})

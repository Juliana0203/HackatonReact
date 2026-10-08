export type PasswordOptionKey = 'uppercase' | 'lowercase' | 'numbers' | 'symbols'

export type PasswordOptions = Record<PasswordOptionKey, boolean>

export const passwordCharacterSets: Record<PasswordOptionKey, string> = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
}

export const passwordOptionList: ReadonlyArray<{
  key: PasswordOptionKey
  label: string
}> = [
  { key: 'uppercase', label: 'Uppercase' },
  { key: 'lowercase', label: 'Lowercase' },
  { key: 'numbers', label: 'Numbers' },
  { key: 'symbols', label: 'Special characters' },
]

export const defaultPasswordOptions: PasswordOptions = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
}

export const DEFAULT_PASSWORD_LENGTH = 10

// Rejection sampling avoids modulo bias.
function secureRandomInt(max: number): number {
  const range = Math.floor(256 / max) * max
  const value = new Uint8Array(1)

  do {
    globalThis.crypto.getRandomValues(value)
  } while (value[0] >= range)

  return value[0] % max
}

export function generatePassword(
  length: number,
  options: PasswordOptions,
): string {
  const selectedSets = passwordOptionList
    .filter(({ key }) => options[key])
    .map(({ key }) => passwordCharacterSets[key])

  if (selectedSets.length === 0) {
    throw new Error('Select at least one character type.')
  }

  const characters = selectedSets.join('')
  // Guarantees at least one character from every selected set.
  const password = selectedSets.map((set) => set[secureRandomInt(set.length)])

  while (password.length < length) {
    password.push(characters[secureRandomInt(characters.length)])
  }

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1)
    ;[password[index], password[swapIndex]] = [
      password[swapIndex],
      password[index],
    ]
  }

  return password.join('')
}

export type PasswordStrength = 'Débil' | 'Media' | 'Fuerte' | 'Muy fuerte'

export function getPasswordStrength(
  length: number,
  options: PasswordOptions,
): PasswordStrength {
  const selected = Object.values(options).filter(Boolean).length
  const score = selected + Number(length >= 12) + Number(length >= 16)

  if (score <= 2) return 'Débil'
  if (score === 3) return 'Media'
  if (score === 4) return 'Fuerte'
  return 'Muy fuerte'
}

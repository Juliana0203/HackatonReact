import { Suspense } from 'react'
import {
  CharacterGallery,
  CharacterGalleryFallback,
} from '@/components/CharacterGallery'
import { Navbar } from '@/components/Navbar'
import { PasswordGenerator } from '@/components/PasswordGenerator'
import { ProgressBar } from '@/components/ProgressBar'
import { RegistrationForm } from '@/components/RegistrationForm'
import { Timer } from '@/components/Timer'

type SearchParam = string | string[] | undefined

interface HomeProps {
  searchParams: Promise<{ q?: SearchParam; page?: SearchParam }>
}

function first(value: SearchParam): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const query = first(params.q).trim()
  const parsedPage = Number.parseInt(first(params.page), 10)
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

  return (
    <main className="navbar-page">
      <Navbar query={query} />
      <Suspense key={`${query}-${page}`} fallback={<CharacterGalleryFallback />}>
        <CharacterGallery query={query} page={page} />
      </Suspense>
      <ProgressBar />
      <div className="tools-grid" id="tools">
        <Timer />
        <PasswordGenerator />
      </div>
      <RegistrationForm />
    </main>
  )
}

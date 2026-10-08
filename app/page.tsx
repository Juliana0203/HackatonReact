import { Navbar } from '@/components/Navbar'
import { PasswordGenerator } from '@/components/PasswordGenerator'
import { ProgressBar } from '@/components/ProgressBar'
import { RegistrationForm } from '@/components/RegistrationForm'
import { Timer } from '@/components/Timer'

export default function Home() {
  return (
    <main className="navbar-page">
      <Navbar />
      <ProgressBar />
      <div className="tools-grid" id="tools">
        <Timer />
        <PasswordGenerator />
      </div>
      <RegistrationForm />
    </main>
  )
}
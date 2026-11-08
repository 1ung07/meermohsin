import { useEffect } from 'react'
import { initSiteEffects } from './effects/siteEffects'
import ConnectCta from './components/ConnectCta'
import FluidCanvas from './components/FluidCanvas'
import MenuBar from './components/MenuBar'
import NavigationMenu from './components/NavigationMenu'
import SoundWave from './components/SoundWave'
import SoundFollow from './components/SoundFollow'
import ContactModal from './components/ContactModal'
import Logo3D from './components/Logo3D'
import Preloader from './components/Preloader'
import BlogModal from './components/BlogModal'
import StatueViewer from './components/StatueViewer'
import CustomCursor from './components/CustomCursor'
import Nav from './components/Nav'
import BgAudio from './components/BgAudio'
import FixedLedger from './components/FixedLedger'
import Hero from './components/Hero'
import About from './components/About'
import Facts from './components/Facts'
import Services from './components/Services'
import CaseStudySidebar from './components/CaseStudySidebar'
import Work from './components/Work'
import StepsOfWork from './components/StepsOfWork'
import BlogSection from './components/BlogSection'
import Recognitions from './components/Recognitions'
import BeforeFooterCta from './components/BeforeFooterCta'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    // All animations/interactions implemented in React (GSAP/Lenis/Three) — no original bundle mirror.
    const cleanup = initSiteEffects()
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, [])

  return (
    <>
      <ConnectCta />
      <FluidCanvas />
      <MenuBar />
      <NavigationMenu />
      <SoundWave />
      <SoundFollow />
      <ContactModal />
      <Logo3D />
      <Preloader />
      <BlogModal />
      <StatueViewer />
      <CustomCursor />
      <Nav />
      <BgAudio />
      <FixedLedger />
      <Hero />
      <About />
      <Facts />
      <Services />
      <CaseStudySidebar />
      <Work />
      <StepsOfWork />
      <BlogSection />
      <Recognitions />
      <BeforeFooterCta />
      <Footer />
    </>
  )
}

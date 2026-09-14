import About from "@/components/site/About"
import Contact from "@/components/site/Contact"
import Education from "@/components/site/Education"
import Experience from "@/components/site/Experience"
import Hero from "@/components/site/Hero"
import SiteFooter from "@/components/site/SiteFooter"
import SiteHeader from "@/components/site/SiteHeader"
import Work from "@/components/site/Work"

export default function Page() {
    return (
        <>
            <SiteHeader />
            <main>
                <Hero />
                <About />
                <Education />
                <Experience />
                <Work />
                <Contact />
            </main>
            <SiteFooter />
        </>
    )
}

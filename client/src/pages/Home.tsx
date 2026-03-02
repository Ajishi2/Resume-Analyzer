import Header from '@/components/header'
import AnimatedHero from '@/components/AnimatedHero'
import GlowingText from '@/components/glowing-text'

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black overflow-hidden">
      {/* Animated mesh background */}
      <AnimatedHero />

      {/* Fixed Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Glowing Nexus Text */}
          <GlowingText />

          {/* Subtitle */}
          <p className="text-white/50 text-lg tracking-widest max-w-2xl leading-relaxed">
            Experience the future of digital interaction
          </p>

          {/* CTA Button */}
          
          <button className="glowing-btn">
            EXPLORE NOW
          </button>
        </div>
      </section>

      {/* Content Section - extends for scrolling */}
      <section className="relative py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight">About Nexus</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Nexus represents the convergence of innovation and design. Our platform delivers
              cutting-edge experiences through a meticulously crafted interface that blends aesthetics
              with functionality.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
                <p className="text-white/60">
                  We push boundaries with next-generation technology and forward-thinking design principles.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Excellence</h3>
                <p className="text-white/60">
                  Every detail is crafted with precision to deliver an unparalleled experience.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Performance</h3>
                <p className="text-white/60">
                  Optimized for speed and efficiency without compromising on visual quality.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Reliability</h3>
                <p className="text-white/60">
                  Built on robust foundations to ensure consistent, dependable service.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-20">
            <h2 className="text-4xl font-bold text-white tracking-tight">Get Started</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Join thousands of users experiencing the Nexus difference. Explore our platform today
              and discover what&apos;s possible when innovation meets design.
            </p>
            <button className="explore-btn">
              START YOUR JOURNEY
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

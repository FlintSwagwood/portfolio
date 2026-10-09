export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <span className="text-lg font-semibold">Christopher Merrin</span>

        <div className="flex gap-6 text-sm text-neutral-400">
          <a href="#projects" className="hover:text-white">
            Projects
          </a>
          <a href="#skills" className="hover:text-white">
            Skills
          </a>
          <a href="#infrastructure" className="hover:text-white">
            Infrastructure
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center px-6">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
          Web Developer
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          I build web applications and the infrastructure that runs them.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-400">
          Full-stack development, containerised deployment, Linux administration
          and self-hosted web infrastructure.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-white px-5 py-3 font-medium text-black hover:bg-neutral-200"
          >
            View projects
          </a>

          <a
            href="#infrastructure"
            className="rounded-lg border border-neutral-700 px-5 py-3 font-medium hover:border-neutral-500"
          >
            How this site works
          </a>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          Projects
        </p>

        <h2 className="text-4xl font-bold">Selected work</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
            <p className="text-sm text-neutral-500">Project 01</p>
            <h3 className="mt-3 text-2xl font-semibold">Coming soon</h3>
            <p className="mt-4 text-neutral-400">
              A full-stack project will live here with a live demo, source code
              and technical breakdown.
            </p>
          </article>

          <article className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
            <p className="text-sm text-neutral-500">Project 02</p>
            <h3 className="mt-3 text-2xl font-semibold">Coming soon</h3>
            <p className="mt-4 text-neutral-400">
              Additional applications will demonstrate frontend, backend and
              deployment work.
            </p>
          </article>
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          Skills
        </p>

        <h2 className="text-4xl font-bold">Technology</h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {[
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Docker",
            "Linux",
            "Caddy",
            "Cloudflare",
            "Git",
          ].map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-neutral-700 px-4 py-2 text-neutral-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section id="infrastructure" className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 md:p-12">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Infrastructure
          </p>

          <h2 className="text-4xl font-bold">This site is self-hosted.</h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-400">
            christophermerrin.dev runs on my own Ubuntu server. Applications are
            containerised with Docker, routed through Caddy and published
            securely through Cloudflare Tunnel.
          </p>

          <div className="mt-10 font-mono text-sm leading-8 text-neutral-400">
            <div>Cloudflare DNS + HTTPS</div>
            <div>↓</div>
            <div>Cloudflare Tunnel</div>
            <div>↓</div>
            <div>Ubuntu Server</div>
            <div>↓</div>
            <div>Caddy</div>
            <div>↓</div>
            <div>Docker</div>
            <div>↓</div>
            <div>Next.js</div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          Contact
        </p>

        <h2 className="text-4xl font-bold">Get in touch.</h2>

        <p className="mt-6 text-neutral-400">
          Contact details and professional links will be added here.
        </p>
      </section>

      <footer className="border-t border-neutral-900 px-6 py-10 text-center text-sm text-neutral-600">
        christophermerrin.dev
      </footer>
    </main>
  );
}
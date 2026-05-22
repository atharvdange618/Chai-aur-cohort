import { Link } from "react-router-dom";

const projects = [
  {
    id: 1,
    name: "Authentication App",
    description: "FreeAPI - Build an Authentication App",
  },
  {
    id: 2,
    name: "YouTube Videos UI",
    description: "FreeAPI - YouTube Videos Listing UI",
  },
  {
    id: 3,
    name: "Product Listing",
    description: "FreeAPI - Product Listing Interface",
  },
  {
    id: 4,
    name: "Quotes Listing",
    description: "FreeAPI - Quotes Listing Application",
  },
  {
    id: 5,
    name: "Jokes Viewer",
    description: "FreeAPI - Jokes Viewer Application",
  },
  {
    id: 6,
    name: "Random Cat Viewer",
    description: "FreeAPI - Random Cat Viewer",
  },
  {
    id: 7,
    name: "Meals Listing",
    description: "FreeAPI - Meals Listing Interface",
  },
  { id: 8, name: "Random Users UI", description: "FreeAPI - Random Users UI" },
  {
    id: 9,
    name: "Stopwatch & Timer",
    description:
      "Custom - Interactive stopwatch with lap recording and countdown timer",
  },
  {
    id: 10,
    name: "Tic Tac Toe",
    description:
      "Custom - Classic 3x3 game with local PvP and AI (Minimax) modes, score tracking, and retro sounds",
  },
];

const socials = {
  github: "https://github.com/atharvdange618/Chai-aur-cohort",
  twitter: "https://twitter.com/atharvdangedev",
  portfolio: "https://www.atharvdangedev.in",
};

export default function Home() {
  return (
    <div className="min-h-screen p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-[#2d2d2d] mb-2">
          My Projects
        </h1>
        <p className="text-[#6b6b6b] mb-4">Select a project to explore</p>
        <div className="flex justify-center gap-4">
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#2d2d2d] rounded-lg text-sm font-medium text-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href={socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#2d2d2d] rounded-lg text-sm font-medium text-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>
          <a
            href={socials.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#2d2d2d] rounded-lg text-sm font-medium text-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-1 17.5v-5l4-3.5 4 3.5v5h-3v-4l-4-3-4 3v4h-3z" />
            </svg>
            Portfolio
          </a>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl p-8 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2d2d2d] flex flex-col items-start"
          >
            <div className="w-9 h-9 bg-[#e8d5c4] rounded-lg flex items-center justify-center font-semibold text-[#2d2d2d] mb-4">
              {project.id}
            </div>
            <h2 className="text-xl font-semibold text-[#2d2d2d] mb-2">
              {project.name}
            </h2>
            <p className="text-sm text-[#6b6b6b]">{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Every piece of copy on the site lives here.
 * Edit this file to update the portfolio — no component changes needed.
 */

export const profile = {
    name: "Arsh",
    // `role` and `location` are not rendered anywhere at the moment — the hero
    // carries the name alone. Kept here as profile data, and ready if you want
    // a tagline back.
    role: "Computer Science student at UMass Amherst, building AI systems that cite their sources.",
    location: "Amherst, MA",
    email: "aarsh@umass.edu",
    altEmail: "arsh07632@gmail.com",
    github: "https://github.com/uhrshh",
    linkedin: "https://www.linkedin.com/in/arsh127",
    resume: "/resume.pdf",
    // Phone is deliberately NOT published here — see README.
}

export const about: string[] = [
    "I'm Arsh, a Computer Science student at the **University of Massachusetts Amherst**, in the **Manning College of Information and Computer Sciences**, carrying a **3.963/4.00** cumulative GPA.",
    "I build AI systems end to end. Most recently that meant **FinSight**, a React and FastAPI research platform indexing **17,986 SEC and BSE listing records**, with a local retrieval-augmented generation pipeline that answers questions from five retrieved evidence passages and cites every one of them.",
    "**SignSprout** points the same instinct somewhere else: an ASL tutor covering the alphabet, numbers and 24 everyday signs across **71 lessons in 8 units**, reading your hand shape through the webcam with MediaPipe landmark tracking and dynamic time warping against reference sequences. Inference runs **entirely on-device**, so no video ever leaves the browser.",
    "This past summer I was an **AI Market Research Intern at Aadrila Technologies** in Mumbai, identifying U.S. GenAI growth opportunities through market sizing, competitive benchmarking and customer segmentation.",
    "Before university I spent two years as an **Event Management Supervisor at SHISTECH** in Gurugram, leading a 25+ member technical team and running operations for over 1,000 participants.",
    "Right now I'm working through retrieval systems, computer vision and applied machine learning.",
]

export type Entry = {
    title: string
    org: string
    /** organisation website; when set, the org name becomes a link */
    url?: string
    start: string
    end: string
    place: string
    points: string[]
}

export const experience: Entry[] = [
    {
        title: "AI Market Research Intern",
        org: "Aadrila Technologies",
        url: "https://aadrila.com",
        start: "Jun 2025",
        end: "Aug 2025",
        place: "Mumbai, India",
        points: [
            "Identified U.S. GenAI growth opportunities by applying quantitative market analysis, market sizing, competitive benchmarking and customer segmentation.",
            "Accelerated research workflows and generated competitive intelligence by applying and evaluating AI models for market analysis.",
            "Supported go-to-market decisions by translating market and customer data into visual findings and recommendations.",
        ],
    },
    {
        title: "Event Management Supervisor",
        org: "SHISTECH",
        url: "https://www.shistech.com",
        start: "Jun 2023",
        end: "May 2025",
        place: "Gurugram, India",
        points: [
            "Led a 25+ member technical team across 2 editions, coordinating priorities and accountability to deliver successful events.",
            "Managed operations for 1,000+ participants, balancing priorities with organisation and composure under pressure.",
            "Resolved issues under tight deadlines through delegation, collaboration, conflict resolution and time management.",
        ],
    },
]

export const education: Entry[] = [
    {
        title: "B.S. Computer Science",
        org: "University of Massachusetts Amherst",
        start: "Sep 2025",
        end: "Present",
        place: "Amherst, MA",
        points: [
            "Manning College of Information and Computer Sciences — cumulative GPA 3.963/4.00.",
            "Coursework: Data Structures and Algorithms, Object-Oriented Programming, Software Development, Artificial Intelligence, Calculus II, Statistics, Reasoning Under Uncertainty.",
        ],
    },
    {
        title: "Indian School Certificate (ISC)",
        org: "Scottish High International School",
        start: "Graduated",
        end: "May 2025",
        place: "Gurugram, India",
        points: [
            "Percentage score 94.6% — equivalent to a 4.0/4.0 GPA.",
            "Coursework: Computer Science, Mathematics, Physics, Chemistry, English, Spanish, Hindi.",
        ],
    },
]

export type Project = {
    name: string
    kicker: string
    year: string
    desc: string
    stats: { label: string; value: string }[]
    tags: string[]
    links?: { label: string; href: string }[]
}

export const work: Project[] = [
    {
        name: "FinSight",
        kicker: "AI-powered financial research platform",
        year: "2025",
        desc:
            "A full-stack research platform that indexes SEC and BSE listing records behind REST APIs, company search, interactive data visualisation and filing discovery. A local RAG pipeline — neural embeddings, semantic similarity search and cosine distance over Ollama — answers each question from five retrieved evidence passages and cites all of them, so every claim traces back to a filing.",
        stats: [
            { label: "Records indexed", value: "17,986" },
            { label: "Backend tests", value: "33" },
            { label: "Cited passages", value: "5 / answer" },
        ],
        tags: ["React", "FastAPI", "Python", "RAG", "Ollama", "REST APIs"],
        links: [{ label: "GitHub", href: "https://github.com/uhrshh/FinSight" }],
    },
    {
        name: "SignSprout",
        kicker: "Hand-tracking sign language tutor",
        year: "2026",
        desc:
            "An interactive ASL learning application of 71 lessons across 8 units, pairing webcam computer vision with demonstrations, quizzes and progress tracking. Real-time gesture recognition covers 26 letters, 10 numbers and 24 vocabulary signs using MediaPipe landmark tracking and custom pose-and-motion matching — with two-hand recovery and tracking-gap handling, running entirely on-device so no video ever leaves the browser.",
        stats: [
            { label: "Lessons", value: "71" },
            { label: "Signs recognised", value: "60" },
            { label: "Inference", value: "On-device" },
        ],
        tags: ["TensorFlow.js", "MediaPipe", "Computer Vision", "Pose Estimation", "JavaScript"],
        links: [{ label: "GitHub", href: "https://github.com/uhrshh/SignSprout" }],
    },
]

export const skills: string[] = [
    "Python", "SQL", "Java", "C", "TypeScript", "NumPy",
    "TensorFlow", "scikit-learn", "Neural Embeddings", "RAG", "Prompt Engineering",
    "OpenAI API", "Anthropic API", "Google Gemini",
    "FastAPI", "Flask", "REST APIs", "React", "Angular", "HTML", "CSS",
    "Git", "GitHub", "VS Code", "Claude Code", "Codex", "Copilot",
    "Data Analysis", "Data Visualization",
]

export const certifications = [
    {
        name: "Google AI Essentials",
        issuer: "Google",
        url: "https://coursera.org/share/6f9ecd4497dee7d3e7a04dac5743775f",
    },
    {
        name: "Claude 101",
        issuer: "Anthropic",
        url: "https://academy.claude.com/verify/f1483888602f101431427af17297800e",
    },
    {
        name: "Claude Code 101",
        issuer: "Anthropic",
        url: "https://academy.claude.com/verify/6db7186d281463959b72809a0fb9edb9",
    },
]

export const nav = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Work", href: "#work" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
]

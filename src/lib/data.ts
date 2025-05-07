import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Recipe Generator",
    description:
      "Create a web app that generates recipes based on ingredients you have at home. The app should use AI to suggest creative dishes and provide step-by-step instructions.",
    author: "Sarah Johnson",
    date: "2 days ago",
    image: "/placeholder.svg?height=200&width=400&text=Recipe+Generator",
    votes: 42,
    comments: [
      {
        id: "c1",
        author: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        content:
          "This would be super useful! I'd love to see it integrate with a grocery delivery service too.",
        date: "1 day ago",
        replies: [
          {
            id: "r1",
            author: "Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            content:
              "That's a great idea! I was thinking about adding a feature to create shopping lists too.",
            date: "1 day ago",
          },
        ],
      },
      {
        id: "c2",
        author: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        content:
          "I'd be interested in helping build this. I have experience with OpenAI's API.",
        date: "12 hours ago",
        replies: [],
      },
    ],
    resources: [
      {
        type: "API",
        title: "OpenAI API Documentation",
        url: "https://platform.openai.com/docs/api-reference",
      },
      {
        type: "Design",
        title: "UI Mockup",
        url: "#",
      },
    ],
  },
  {
    id: "2",
    title: "Habit Tracker with Social Accountability",
    description:
      "Build a habit tracker that lets friends hold each other accountable. Users can create habit groups, set goals, and cheer each other on. Perfect for learning React and Firebase.",
    author: "Alex Thompson",
    date: "3 days ago",
    image: "/placeholder.svg?height=200&width=400&text=Habit+Tracker",
    votes: 38,
    comments: [
      {
        id: "c3",
        author: "Jordan Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        content:
          "I've been looking for a project to practice React. This sounds perfect!",
        date: "2 days ago",
        replies: [],
      },
    ],
    resources: [
      {
        type: "Tutorial",
        title: "Firebase Authentication Guide",
        url: "https://firebase.google.com/docs/auth",
      },
    ],
  },
  {
    id: "3",
    title: "Freelancer Portfolio Generator",
    description:
      "Create a tool that helps freelancers build beautiful portfolios without coding. Users can input their projects, skills, and contact info to generate a customizable website.",
    author: "David Kim",
    date: "1 week ago",
    image: "/placeholder.svg?height=200&width=400&text=Portfolio+Generator",
    votes: 65,
    comments: [
      {
        id: "c4",
        author: "Sophia Martinez",
        avatar: "/placeholder.svg?height=40&width=40",
        content:
          "As a freelance designer, I would definitely use this! Would love to see template options.",
        date: "5 days ago",
        replies: [],
      },
      {
        id: "c5",
        author: "Ryan Jackson",
        avatar: "/placeholder.svg?height=40&width=40",
        content:
          "I'm working on something similar but for photographers specifically. Maybe we could collaborate?",
        date: "3 days ago",
        replies: [
          {
            id: "r2",
            author: "David Kim",
            avatar: "/placeholder.svg?height=40&width=40",
            content:
              "That sounds interesting! DM me and we can discuss further.",
            date: "2 days ago",
          },
        ],
      },
    ],
    resources: [
      {
        type: "Library",
        title: "Next.js Documentation",
        url: "https://nextjs.org/docs",
      },
      {
        type: "Design",
        title: "Portfolio Templates Inspiration",
        url: "#",
      },
    ],
  },
  {
    id: "4",
    title: "Local Business Discovery Map",
    description:
      "Build an interactive map that helps people discover small, local businesses in their area. Include filters for business type, ratings, and special features like outdoor seating.",
    author: "Olivia Wilson",
    date: "5 days ago",
    image: "/placeholder.svg?height=200&width=400&text=Business+Map",
    votes: 29,
    comments: [
      {
        id: "c6",
        author: "Lucas Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        content:
          "This would be great for supporting local businesses! Have you considered using the Google Maps API?",
        date: "3 days ago",
        replies: [],
      },
    ],
    resources: [
      {
        type: "API",
        title: "Google Maps JavaScript API",
        url: "https://developers.google.com/maps/documentation/javascript",
      },
    ],
  },
  {
    id: "5",
    title: "Markdown Note-Taking App",
    description:
      "Create a simple but powerful note-taking app that supports Markdown formatting. Include features like tags, search, and dark mode. Great for learning state management.",
    author: "James Miller",
    date: "1 week ago",
    image: "/placeholder.svg?height=200&width=400&text=Markdown+Notes",
    votes: 51,
    comments: [
      {
        id: "c7",
        author: "Ava Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "I'd love to see this with cloud sync capabilities!",
        date: "6 days ago",
        replies: [],
      },
    ],
    resources: [
      {
        type: "Library",
        title: "React-Markdown",
        url: "https://github.com/remarkjs/react-markdown",
      },
    ],
  },
  {
    id: "6",
    title: "Personal Finance Dashboard",
    description:
      "Build a dashboard that helps users track expenses, set budgets, and visualize spending habits. Great for practicing data visualization and learning about financial APIs.",
    author: "Emma Davis",
    date: "2 weeks ago",
    image: "/placeholder.svg?height=200&width=400&text=Finance+Dashboard",
    votes: 73,
    comments: [
      {
        id: "c8",
        author: "Noah Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
        content:
          "This would be super helpful! Would you consider adding investment tracking too?",
        date: "10 days ago",
        replies: [
          {
            id: "r3",
            author: "Emma Davis",
            avatar: "/placeholder.svg?height=40&width=40",
            content:
              "That's definitely on the roadmap! I think it would make a great phase 2 feature.",
            date: "9 days ago",
          },
        ],
      },
    ],
    resources: [
      {
        type: "API",
        title: "Plaid API Documentation",
        url: "https://plaid.com/docs/",
      },
      {
        type: "Library",
        title: "Chart.js",
        url: "https://www.chartjs.org/",
      },
    ],
  },
];

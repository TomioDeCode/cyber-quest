import { Bot, SquareTerminal } from "lucide-react";

export const urlNavbarUsers = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john.jpg",
  },
  teams: [
    {
      name: "BootCamp Cyber",
      logo: SquareTerminal,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "#",
        },
        {
          title: "Leaderboard",
          url: "#",
        },
      ],
    },
    {
      title: "Questions",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "All Questions",
          url: "#",
        },
        {
          title: "Favorite Questions",
          url: "#",
        },
      ],
    },
  ],
};

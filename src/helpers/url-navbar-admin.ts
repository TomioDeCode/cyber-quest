import { BookOpen, Bot, Command, SquareTerminal } from "lucide-react";

export const urlNavbarAdmin = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BootCamp Cyber",
      logo: Command,
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
          url: "/admin/dashboard",
        },
        {
          title: "Leaderboard",
          url: "/admin/dashboard/leaderboard",
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
          title: "Create Question",
          url: "#",
        },
        {
          title: "Favorite Questions",
          url: "#",
        },
      ],
    },
    {
      title: "Account Settings",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Edit Profile",
          url: "#",
        },
        {
          title: "Preferences",
          url: "#",
        },
      ],
    },
  ],
};

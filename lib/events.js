export const STATUS = {
  REGISTERED: "Registered",
  SHORTLISTED: "Shortlisted",
  TOP_10: "Top 10",
  FINALIST: "Finalist",
  RUNNERS_UP: "Runners Up",
  CHAMPION: "Champion",
  ABSENT: "Absent",
};

export const EVENTS = [
  {
    id: "1",
    name: "2026 BUP CSE Fest",
    accent: "blue",
    url: "https://fest.bupcopc.tech/hackathon",
    teams: [
      {
        name: "Team Unemployed Folks",
        status: STATUS.REGISTERED,
        members: [
          { github: "saminyasar004" },
          { github: "samihaTasnim" },
          { github: "ProgEuler" },
          { github: "sr-tamim" },
        ],
      },
      {
        name: "Team Pied Pipers",
        status: STATUS.REGISTERED,
        members: [
          { github: "maamspy" },
          { github: "adib-the-noob" },
          { github: "Abir-Bin-Billal" },
          { github: "bishal-elahi-zihad" },
        ],
      },
      {
        name: "Team BakBakum",
        status: STATUS.REGISTERED,
        members: [
          { github: "smabdullah2002" },
          { github: "salehinRifat" },
          { github: "nfornoor" },
        ],
      },
    ],
  },
];

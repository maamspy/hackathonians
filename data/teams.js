export const schema = {
  primaryKey: "id",
  foreignKeys: [
    { column: "eventId", references: "events", on: "id", as: "event" },
    { column: "statuses", references: "statuses", on: "id", as: "status" },
  ],
};

export const TEAMS = [
  {
    id: "team-64",
    eventId: "ai-engineering-hackathon",
    name: "Team 64",
    members: ["adib-the-noob", "maamspy", "Jisan-mia", "alex-pythonista"],
  },
  {
    id: "neuralnomads",
    eventId: "signature-hackathon",
    name: "NeuralNomads",
    statuses: ["TOP_10", "FINALIST"],
    members: [
      "adib-the-noob",
      "samiulbasirfahim",
      "yeasin2002",
      "ImtiazNayeemShawon",
    ],
  },
  {
    id: "hkthns",
    eventId: "infinity-ai-buildfest-2026",
    name: "Hackathonians",
    statuses: ["FINALIST"],
    members: [
      "maamspy",
      "saminyasar004",
      "smabdullah2002",
      "samihaTasnim",
      "salehinRifat",
    ],
  },
  {
    id: "bx",
    eventId: "signature-hackathon",
    name: "BlockX",
    rank: 2,
    statuses: ["TOP_10", "FINALIST"],
    members: ["maamspy", "saminyasar004", "mahiamOmO", "ProgEuler"],
  },
  {
    id: "cb",
    eventId: "signature-hackathon",
    name: "Cerebrum",
    statuses: ["FINALIST"],
    members: ["smabdullah2002", "salehinRifat", "nfornoor"],
  },
  {
    id: "ht-dthn",
    eventId: "data-hackathon",
    name: "HT_DTHN",
    members: ["maamspy", "smabdullah2002"],
  },
  {
    id: "iub-sudo",
    eventId: "smuct",
    name: "IUB_sudo",
    members: ["maamspy"],
    statuses: ["TOP_SCORER", "FINALIST"],
    rank: 4,
  },
];

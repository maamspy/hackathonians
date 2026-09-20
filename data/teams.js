export const schema = {
  primaryKey: "id",
  foreignKeys: [
    { column: "eventId", references: "events", on: "id", as: "event" },
    { column: "status", references: "statuses", on: "id", as: "status" },
  ],
};

export const TEAMS = [
  {
    id: "hkthns",
    eventId: "infinity-ai-buildfest-2026",
    name: "Hackathonians",
    members: [
      "maamspy",
      "saminyasar004",
      "smabdullah2002",
      "samihaTasnim",
      "samiha012",
      "salehinRifat",
    ],
  },
  {
    id: "bx",
    eventId: "signature-hackathon",
    name: "BlockX",
    members: ["maamspy", "saminyasar004", "mahiamOmO", "ProgEuler"],
  },
];

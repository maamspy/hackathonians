export const schema = {
  primaryKey: "id",
  foreignKeys: [
    { column: "teamId", references: "teams", on: "id", as: "team" },
  ],
};

export const PROJECTS = [
  {
    id: "1",
    name: "BehaviourIQ",
    tagline: "Behavior-aware commerce for SMEs.",
    description:
      "Reads live shopper signals and turns them into personalized prices, intent-based search and churn alerts.",
    accent: "blue",
    teamId: "hkthns",
    tags: ["Next.js", "FastAPI", "Pinecone", "PostgreSQL", "Docker"],
    links: {
      github: "https://github.com/maamspy/behaviourIQ",
      demo: "http://biq-web.nxs.bd/",
    },
  },
  {
    id: "2",
    name: "TransparenSee",
    tagline: "Blockchain transparency for Bangladesh",
    description:
      "A blockchain-based transparency platform to track Bangladeshi government projects via tamper-proof records, IPFS document hashing and AI-verified citizen feedback.",
    accent: "purple",
    teamId: "bx",
    tags: ["Hardhat"],
  },
];

const REVALIDATE_SECONDS = 60 * 60 * 24;

const fallbackProfile = (username) => ({
  name: username,
  avatarUrl: `https://github.com/${username}.png`,
});

async function fetchProfile(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    return {
      name: data.name ?? username,
      avatarUrl: data.avatar_url ?? fallbackProfile(username).avatarUrl,
    };
  } catch {
    return fallbackProfile(username);
  }
}

const profiles = new Map();

export function getGitHubProfile(username) {
  let profile = profiles.get(username);
  if (!profile) {
    profile = fetchProfile(username);
    profiles.set(username, profile);
  }
  return profile;
}

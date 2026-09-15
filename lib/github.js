export async function getGitHubProfile(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();
    return {
      name: data.name,
      avatarUrl: data.avatar_url,
    };
  } catch {
    return {
      name: username,
      avatarUrl: `https://avatars.githubusercontent.com/${username}`,
    };
  }
}

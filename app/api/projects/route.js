import { success, error } from "@/lib/response";
import { getProjects } from "@/lib/projects";

export async function GET() {
  try {
    return success({ projects: await getProjects() }, { status: 200 });
  } catch {
    return error("Failed to load projects", { status: 500 });
  }
}

import HomeExperience from "@/components/HomeExperience";
import { getCategories, getSite } from "@/lib/content";

export default function HomePage() {
  // Categories stay off the arc until they have at least one project, so no tile leads to a dead end.
  const categories = getCategories().filter((c) => c.projectCount > 0);
  return <HomeExperience site={getSite()} categories={categories} />;
}

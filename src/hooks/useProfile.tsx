import { useContentValue } from "@/hooks/useSiteContent";

export function useProfile() {
  const { value: name, isLoading: l1 } = useContentValue("profile", "name", "Shishir Kumar Talukder");
  const { value: title, isLoading: l2 } = useContentValue("profile", "title", "Research Microbiologist");
  const { value: subtitle, isLoading: l3 } = useContentValue("profile", "subtitle", "Antimicrobial Resistance Specialist");
  const { value: bio, isLoading: l4 } = useContentValue("profile", "bio", "");
  const { value: profileImage, isLoading: l5 } = useContentValue("profile", "profile_image", "");

  return {
    name,
    title,
    subtitle,
    bio,
    profileImage: profileImage || "",
    isLoading: l1 || l2 || l3 || l4 || l5,
  };
}

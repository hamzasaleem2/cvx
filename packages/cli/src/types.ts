export interface Component {
  slug: string;
  name: string;
  category: string;
  description: string;
  npmPackage: string;
  repoUrl?: string;
  weeklyDownloads?: number;
  installSnippet: string;
}

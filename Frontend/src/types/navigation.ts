import { UserRole } from "./user";

export interface NavItem {
  title: string;
  url: string;
  icon: any; // React.ElementType
  roles: UserRole[];
  description: string;
}

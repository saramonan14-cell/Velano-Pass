import { LucideIcon, Key, FileText, CreditCard, Grid } from "lucide-react";

export const APP_NAME = "Velano Pass";

// We only export the structure now, labels will be handled by the component using translations
export const CATEGORY_IDS = [
  { id: 'all', icon: Grid, labelKey: 'allItems' },
  { id: 'login', icon: Key, labelKey: 'logins' },
  { id: 'card', icon: CreditCard, labelKey: 'cards' },
  { id: 'note', icon: FileText, labelKey: 'notes' },
];

export const PASSWORD_OPTS = {
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
};

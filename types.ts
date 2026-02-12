
export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type ListTheme = 'light' | 'dark';

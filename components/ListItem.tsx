
import React from 'react';
import { ListItem as IListItem } from '../types';

interface ListItemProps {
  item: IListItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ListItem: React.FC<ListItemProps> = ({ item, onToggle, onDelete }) => {
  return (
    <div className={`group flex items-center justify-between p-4 border-b-2 border-black hover:bg-black hover:text-white transition-all duration-300 ${item.completed ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => onToggle(item.id)}>
        <div className={`w-5 h-5 border-2 border-current flex items-center justify-center`}>
          {item.completed && <div className="w-2.5 h-2.5 bg-current" />}
        </div>
        <span className={`text-lg transition-all ${item.completed ? 'line-through decoration-2' : 'font-medium'}`}>
          {item.text}
        </span>
      </div>
      <button 
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 px-2 py-1 border-2 border-current hover:bg-white hover:text-black transition-opacity"
        aria-label="Supprimer"
      >
        Supprimer
      </button>
    </div>
  );
};

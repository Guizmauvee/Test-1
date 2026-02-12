
import React, { useState, useEffect, useCallback } from 'react';
import { ListItem as IListItem } from './types';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { ListItem } from './components/ListItem';
import { generateSmartList } from './services/gemini';

const App: React.FC = () => {
  const [items, setItems] = useState<IListItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('noir-et-blanc-list');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('noir-et-blanc-list', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((text: string) => {
    if (!text.trim()) return;
    const newItem: IListItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
    setInputValue('');
  }, []);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(prev => prev.filter(item => !item.completed));
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const suggestions = await generateSmartList(aiPrompt);
    if (suggestions.length > 0) {
      const newItems = suggestions.map(text => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
      }));
      setItems(prev => [...newItems, ...prev]);
      setAiPrompt('');
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b-4 border-black p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Noir<br/>& Blanc
          </h1>
          <p className="mt-4 font-light text-xl italic">L'essentiel, simplement.</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className="text-sm font-bold uppercase">{items.length} éléments au total</span>
          <span className="text-sm font-medium">{items.filter(i => i.completed).length} terminés</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Simple Input */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4 border-l-4 border-black pl-2">Ajouter manuellement</h2>
          <div className="flex gap-0">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem(inputValue)}
              placeholder="Qu'y a-t-il à faire ?"
            />
            <Button onClick={() => addItem(inputValue)} className="h-full border-l-0">
              AJOUTER
            </Button>
          </div>
        </section>

        {/* AI Generator */}
        <section className="bg-black text-white p-8 border-2 border-black">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4 border-l-4 border-white pl-2">Générateur intelligent</h2>
          <p className="mb-4 text-sm opacity-80 italic">Demandez à l'IA de planifier votre liste (ex: "Mes courses pour un gâteau", "Routine matin")</p>
          <div className="flex gap-0">
            <input 
              className="w-full px-4 py-3 bg-white border-2 border-white focus:outline-none text-black font-medium"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              placeholder="Ex: Liste de voyage pour le Japon"
              disabled={isGenerating}
            />
            <button 
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="bg-black text-white border-2 border-white px-6 font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {isGenerating ? '...' : 'GÉNÉRER'}
            </button>
          </div>
        </section>

        {/* The List */}
        <section className="border-t-4 border-black">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl font-black uppercase opacity-10 select-none">La page est blanche</p>
            </div>
          ) : (
            <div className="divide-y-0">
              {items.map(item => (
                <ListItem 
                  key={item.id}
                  item={item}
                  onToggle={toggleItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          )}
        </section>

        {/* Controls */}
        {items.length > 0 && (
          <div className="flex justify-center pt-8">
            <Button variant="outline" onClick={clearCompleted} className="uppercase tracking-widest">
              Effacer les tâches terminées
            </Button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t-2 border-black p-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest opacity-30">Concept Minimaliste &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import { InventoryItem } from '@aion/shared-types';

export const PantryInventory: React.FC = () => {
  const memoryStore = AionMemoryStore.getInstance();
  const [items, setItems] = useState<InventoryItem[]>(memoryStore.getInventory());
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItemText.trim(),
      amount: 1,
      unit: 'unidad/lata',
      availability: 'DISPONIBLE',
      addedDate: new Date().toISOString(),
      confidence: 'ALTA',
      source: 'USER_CONFIRMED',
    };
    memoryStore.addInventoryItem(newItem);
    setItems(memoryStore.getInventory());
    setNewItemText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="aion-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Despensa / Mercado Inteligente</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', margin: '0.2rem 0 0.8rem 0' }}>
          Registra tus alimentos disponibles por conversación, texto o foto. AION usará esta despensa para sugerirte qué cocinar y generar tu mercado.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="aion-input"
            placeholder="Ej. Tengo atún, tomates y pollo..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 1rem' }} onClick={handleAddItem}>
            + Agregar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map((item) => (
          <div key={item.id} className="aion-card" style={{ padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{item.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--aion-neutral-light)' }}>
                {item.amount} {item.unit} • Ubicación: {item.location || 'despensa'}
              </div>
            </div>
            <span
              className={`badge badge-${
                item.availability === 'DISPONIBLE'
                  ? 'available'
                  : item.availability === 'BAJO'
                  ? 'low'
                  : item.availability === 'PRÓXIMO A VENCER'
                  ? 'expiring'
                  : 'expiring'
              }`}
            >
              {item.availability}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

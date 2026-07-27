import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import { InventoryItem, InventoryAvailability } from '@aion/shared-types';

export const PantryInventory: React.FC = () => {
  const memoryStore = AionMemoryStore.getInstance();
  const [items, setItems] = useState<InventoryItem[]>(memoryStore.getInventory());
  const [newItemText, setNewItemText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    triggerToast(`+ ${newItem.name} agregado a tu Despensa`);
  };

  const handleUpdateAmount = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newAmount = Math.max(0, item.amount + delta);
    const newAvailability: InventoryAvailability = newAmount === 0 ? 'AGOTADO' : newAmount <= 1 ? 'BAJO' : 'DISPONIBLE';

    memoryStore.updateInventoryItem(id, { amount: newAmount, availability: newAvailability });
    setItems(memoryStore.getInventory());
  };

  const handleCycleStatus = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const statuses: InventoryAvailability[] = ['DISPONIBLE', 'BAJO', 'PRÓXIMO A VENCER', 'AGOTADO'];
    const nextIdx = (statuses.indexOf(item.availability) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    memoryStore.updateInventoryItem(id, { availability: nextStatus });
    setItems(memoryStore.getInventory());
    triggerToast(`${item.name} ahora está ${nextStatus}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toastMessage && <div className="aion-toast">{toastMessage}</div>}

      <div className="aion-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Despensa / Mercado Inteligente</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', margin: '0.2rem 0 0.8rem 0' }}>
          Toca la disponibilidad para alternar estado o usa los botones + / - para ajustar existencias.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="aion-input"
            placeholder="Ej. Tengo latas de atún, pollo, verduras..."
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{item.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--aion-neutral-light)' }}>
                Ubicación: {item.location || 'despensa'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Modificador interactivo de cantidad */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.2rem 0.4rem' }}>
                <button
                  onClick={() => handleUpdateAmount(item.id, -1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', fontWeight: 700, cursor: 'pointer', padding: '0 0.3rem' }}
                >
                  -
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                  {item.amount} {item.unit}
                </span>
                <button
                  onClick={() => handleUpdateAmount(item.id, 1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', fontWeight: 700, cursor: 'pointer', padding: '0 0.3rem' }}
                >
                  +
                </button>
              </div>

              {/* Botón de estado interactivo */}
              <button
                onClick={() => handleCycleStatus(item.id)}
                className={`badge badge-${
                  item.availability === 'DISPONIBLE'
                    ? 'available'
                    : item.availability === 'BAJO'
                    ? 'low'
                    : item.availability === 'PRÓXIMO A VENCER'
                    ? 'expiring'
                    : 'expiring'
                }`}
                style={{ cursor: 'pointer', border: 'none' }}
                title="Tocar para cambiar estado"
              >
                {item.availability}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AionMemoryStore } from '@aion/memory';
import { InventoryItem, InventoryAvailability, InventoryTransaction } from '@aion/shared-types';

const INITIAL_CATALOG_SEED: InventoryItem[] = [
  { id: 'inv-prot-1', name: 'Pechuga de Pollo', amount: 500, unit: 'g', location: 'congelador', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-prot-2', name: 'Carne molida magra', amount: 400, unit: 'g', location: 'congelador', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-prot-3', name: 'Atún en lata', amount: 3, unit: 'latas', location: 'despensa', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-emb-1', name: 'Jamón pavo / cerdo', amount: 200, unit: 'g', location: 'refrigerador', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-lac-1', name: 'Queso costeño', amount: 250, unit: 'g', location: 'refrigerador', availability: 'BAJO', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-lac-2', name: 'Leche entera', amount: 1, unit: 'litro', location: 'refrigerador', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-gra-1', name: 'Papas sabaneras', amount: 6, unit: 'unidades', location: 'despensa', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-gra-2', name: 'Arroz blanco', amount: 1000, unit: 'g', location: 'despensa', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
  { id: 'inv-veg-1', name: 'Tomates frescos', amount: 3, unit: 'unidades', location: 'refrigerador', availability: 'PRÓXIMO A VENCER', addedDate: new Date().toISOString(), confidence: 'MEDIA', source: 'VISUAL_ESTIMATE_HIGH' },
  { id: 'inv-veg-2', name: 'Aguacate Hass', amount: 2, unit: 'unidades', location: 'refrigerador', availability: 'DISPONIBLE', addedDate: new Date().toISOString(), confidence: 'ALTA', source: 'USER_CONFIRMED' },
];

export const PantryInventory: React.FC = () => {
  const memoryStore = AionMemoryStore.getInstance();
  let currentInventory = memoryStore.getInventory();

  // Si el inventario está completamente vacío, se inicializa el catálogo realista enriquecido
  if (currentInventory.length === 0) {
    INITIAL_CATALOG_SEED.forEach((item) => memoryStore.addInventoryItem(item));
    currentInventory = memoryStore.getInventory();
  }

  const [items, setItems] = useState<InventoryItem[]>(currentInventory);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddItem = (customName?: string) => {
    const textToAdd = customName || newItemText.trim();
    if (!textToAdd) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: textToAdd,
      amount: 1,
      unit: 'unidad/g',
      availability: 'DISPONIBLE',
      addedDate: new Date().toISOString(),
      confidence: 'ALTA',
      source: 'USER_CONFIRMED',
    };

    memoryStore.addInventoryItem(newItem);
    setItems(memoryStore.getInventory());
    if (!customName) setNewItemText('');
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

  const quickPresets = [
    { label: '+ Pechuga Pollo', name: 'Pechuga de Pollo' },
    { label: '+ Jamón Pavo', name: 'Jamón pavo' },
    { label: '+ Huevos', name: 'Huevos' },
    { label: '+ Queso Costeño', name: 'Queso costeño' },
    { label: '+ Aguacate', name: 'Aguacate Hass' },
    { label: '+ Arroz', name: 'Arroz blanco' },
    { label: '+ Atún', name: 'Atún en lata' },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    const nameLower = item.name.toLowerCase();
    if (selectedCategory === 'proteins') return nameLower.includes('pollo') || nameLower.includes('carne') || nameLower.includes('atún') || nameLower.includes('huevo');
    if (selectedCategory === 'deli') return nameLower.includes('jamón') || nameLower.includes('salchicha') || nameLower.includes('tocineta');
    if (selectedCategory === 'dairy') return nameLower.includes('queso') || nameLower.includes('leche') || nameLower.includes('yogur');
    if (selectedCategory === 'grains') return nameLower.includes('papa') || nameLower.includes('arroz') || nameLower.includes('avena') || nameLower.includes('pan');
    if (selectedCategory === 'veggies') return nameLower.includes('tomate') || nameLower.includes('cebolla') || nameLower.includes('aguacate') || nameLower.includes('manzana');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toastMessage && <div className="aion-toast">{toastMessage}</div>}

      <div className="aion-card" style={{ background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.4) 0%, rgba(26, 22, 37, 0.95) 100%)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Despensa, Refrigerador e Historial</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--aion-sand)', margin: '0.2rem 0 0.8rem 0' }}>
          Inventario inteligente categorizado (Proteínas, Lácteos, Embutidos, Granos). Toca cualquier alimento para ver su historial (*¿Por qué AION cree esto?*).
        </p>

        {/* Paleta de Selección Rápida 1-Tap */}
        <div style={{ fontSize: '0.72rem', color: 'var(--aion-lavender)', fontWeight: 700, marginBottom: '0.3rem' }}>
          ENTRADA RÁPIDA DE ALIMENTOS:
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
          {quickPresets.map((p) => (
            <button
              key={p.label}
              onClick={() => handleAddItem(p.name)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            className="aion-input"
            placeholder="Ej. Pechuga de pollo, huevos, queso, jamón..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button className="aion-btn-primary" style={{ width: 'auto', padding: '0 1rem' }} onClick={() => handleAddItem()}>
            + Agregar
          </button>
        </div>

        {/* Píldoras de Filtro por Categorías Realistas */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'proteins', label: '🍗 Proteínas' },
            { id: 'deli', label: '🥓 Embutidos' },
            { id: 'dairy', label: '🧀 Lácteos' },
            { id: 'grains', label: '🌾 Granos / Tubérculos' },
            { id: 'veggies', label: '🥑 Vegetales / Frutas' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                background: selectedCategory === c.id ? 'var(--aion-lavender)' : 'rgba(255,255,255,0.06)',
                color: selectedCategory === c.id ? '#0F0D15' : 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filteredItems.map((item) => {
          const transactions: InventoryTransaction[] = memoryStore.getInventoryTransactions(item.id);
          const isExpanded = expandedItemId === item.id;

          return (
            <div key={item.id} className="aion-card" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', cursor: 'pointer' }}
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{item.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--aion-lavender)' }}>{isExpanded ? '▲ Ocultar' : '▼ ¿Por qué AION cree esto?'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--aion-neutral-light)' }}>
                    Ubicación: {item.location || 'despensa'} • Certeza: {item.source}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.2rem 0.4rem' }}>
                    <button
                      onClick={() => handleUpdateAmount(item.id, -1)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', fontWeight: 700, cursor: 'pointer', padding: '0 0.3rem' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                      ≈{item.amount} {item.unit}
                    </span>
                    <button
                      onClick={() => handleUpdateAmount(item.id, 1)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--aion-sand)', fontWeight: 700, cursor: 'pointer', padding: '0 0.3rem' }}
                    >
                      +
                    </button>
                  </div>

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
                  >
                    {item.availability}
                  </button>
                </div>
              </div>

              {/* Historial de Movimientos Explicables */}
              {isExpanded && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--aion-lavender)', fontWeight: 700 }}>
                    📜 HISTORIAL DE MOVIMIENTOS RECONSTRUIDO:
                  </span>
                  {transactions.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--aion-sand)' }}>No hay movimientos registrados previamente.</span>
                  ) : (
                    transactions.map((tx) => (
                      <div key={tx.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: tx.quantityDelta && tx.quantityDelta > 0 ? '#34D399' : '#F87171' }}>
                            {tx.quantityDelta && tx.quantityDelta > 0 ? `+${tx.quantityDelta}` : tx.quantityDelta} {tx.unit || item.unit}
                          </span>
                          <span style={{ color: 'var(--aion-sand)', marginLeft: '0.4rem' }}>{tx.explanation || tx.type}</span>
                        </div>
                        <span style={{ color: 'var(--aion-neutral)', fontSize: '0.68rem' }}>
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

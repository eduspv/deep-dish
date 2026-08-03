export const TIPOS_RESTAURANTE = [
    { value: 'brasileira',    label: 'Brasileira'    },
    { value: 'italiana',      label: 'Italiana'      },
    { value: 'japonesa',      label: 'Japonesa'      },
    { value: 'chinesa',       label: 'Chinesa'       },
    { value: 'árabe',         label: 'Árabe'         },
    { value: 'mexicana',      label: 'Mexicana'      },
    { value: 'francesa',      label: 'Francesa'      },
    { value: 'portuguesa',    label: 'Portuguesa'    },
    { value: 'churrasco',     label: 'Churrascaria'  },
    { value: 'frutos do mar', label: 'Frutos do mar' },
    { value: 'vegetariano',   label: 'Vegetariano'   },
    { value: 'vegano',        label: 'Vegano'        },
    { value: 'fast food',     label: 'Fast Food'     },
    { value: 'pizza',         label: 'Pizzaria'      },
    { value: 'hamburguer',    label: 'Hamburgueria'  },
    { value: 'cafeteria',     label: 'Cafeteria'     },
    { value: 'padaria',       label: 'Padaria'       },
    { value: 'comida caseira', label: 'Comida caseira' },
  ];

// value (armazenado no banco) → label amigável para exibição.
export function getTipoLabel(value: string | undefined | null): string {
  if (!value) return '';
  const tipo = TIPOS_RESTAURANTE.find((t) => t.value === value);
  return tipo?.label ?? value;
}
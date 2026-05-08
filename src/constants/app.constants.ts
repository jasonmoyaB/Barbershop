import type { Service } from '../types/services.types';
import type { SocialLink } from '../types/footer.types';

export const SERVICES: Service[] = [
  {
    id: 'cut',
    name: 'Corte',
    description:
      'Corte de precisión adaptado a tu estilo. Técnica de tijera o máquina, con acabado y moldeado incluidos.',
    price: 'desde 4000 ₡',
  },
  {
    id: 'beard',
    name: 'Barba',
    description:
      'Perfilado y arreglo de barba con navaja clásica, vapor caliente y bálsamo hidratante de acabado.',
    price: 'desde 3000 ₡',
  },
  {
    id: 'combo',
    name: 'Corte + Barba',
    description:
      'Servicio completo de corte y arreglo de barba. La experiencia definitiva del cuidado masculino.',
    price: 'desde 4000 ₡',
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
];

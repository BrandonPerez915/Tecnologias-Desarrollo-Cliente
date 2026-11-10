import { IconName } from '../types/icons';
import { Screen } from '../types/navigation';

export interface LandingFeature {
  id: string;
  icon: IconName;
  tone: 'primary' | 'success' | 'warning';
  badge: string;
  title: string;
  description: string;
  highlight: string;
}

export interface LandingModulePreview {
  id: Screen;
  label: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  kpiLabel: string;
  kpiValue: string;
  kpiStatus: string;
  kpiTone: 'success' | 'warning' | 'neutral';
}

export interface LandingWorkflowStep {
  step: string;
  title: string;
  description: string;
  icon: IconName;
  targetScreen: Screen;
  actionLabel: string;
}

export const landingStats = [
  { value: '100%', label: 'Trazabilidad por código IMEI y serie' },
  { value: '< 45 seg', label: 'Arqueo y corte de caja al final del turno' },
  { value: '0 pérdidas', label: 'Control de préstamos entre puestos vecinos' },
  { value: '24/7', label: 'Sincronización de inventario y etiquetas' },
];

export const landingFeatures: LandingFeature[] = [
  {
    id: 'imei-tracking',
    icon: 'scan',
    tone: 'primary',
    badge: 'Control de Serie',
    title: 'Trazabilidad exacta por IMEI',
    description:
      'Registra, busca y verifica cada smartphone, tablet o laptop por su número de serie único antes de vender o prestar.',
    highlight: 'Verificación instantánea de stock y color',
  },
  {
    id: 'cash-control',
    icon: 'cash',
    tone: 'success',
    badge: 'Finanzas',
    title: 'Caja en vivo y corte de turno',
    description:
      'Monitorea ventas en efectivo, transferencias y gastos operativos del día con arqueo guiado al cerrar el puesto.',
    highlight: 'Cálculo automático de diferencias de efectivo',
  },
  {
    id: 'stall-loans',
    icon: 'swap',
    tone: 'warning',
    badge: 'Colaboración',
    title: 'Préstamos entre puestos',
    description:
      'Presta equipos a locales o puestos vecinos sin perder el rastro: registra quién lo llevó, a qué hora y confirma su devolución.',
    highlight: 'Alertas automáticas por tiempo fuera',
  },
  {
    id: 'orders-pos',
    icon: 'receipt',
    tone: 'primary',
    badge: 'Punto de Venta',
    title: 'Órdenes rápidas y facturación',
    description:
      'Gestiona múltiples órdenes abiertas en mostrador, agrega productos con un clic y procesa el cobro sin fricción.',
    highlight: 'Soporte para órdenes simultáneas en cola',
  },
  {
    id: 'thermal-labels',
    icon: 'printer',
    tone: 'success',
    badge: 'Hardware',
    title: 'Impresión de etiquetas térmicas',
    description:
      'Imprime etiquetas de precio, variante y código para tus vitrinas directamente por Bluetooth desde cualquier dispositivo.',
    highlight: 'Plantillas listas para impresoras de 58mm y 80mm',
  },
  {
    id: 'multi-variant',
    icon: 'box',
    tone: 'warning',
    badge: 'Catálogo',
    title: 'Inventario multi-variante',
    description:
      'Agrupa modelos por capacidad y acabado (Grafito, Azul Sierra, Plata, Medianoche) con indicadores de bajo stock.',
    highlight: 'Filtros inteligentes por precio y existencia',
  },
];

export const landingModules: LandingModulePreview[] = [
  {
    id: 'home',
    label: 'Panel Principal',
    icon: 'home',
    eyebrow: 'Vista General del Puesto',
    title: 'Todo el pulso de tu negocio en una sola pantalla',
    description:
      'Visualiza el efectivo esperado en caja, las ventas acumuladas del día, los gastos registrados y ejecuta acciones rápidas en un toque.',
    bullets: [
      'Tarjeta principal con efectivo esperado en tiempo real y desglose de base inicial',
      'Métricas comparativas de entradas (ventas) vs. salidas (gastos)',
      'Accesos directos a Nueva Venta, Gasto, Préstamo, Órdenes e Impresión de etiquetas',
    ],
    kpiLabel: 'Efectivo esperado hoy',
    kpiValue: '24,580.00',
    kpiStatus: 'Caja abierta · Puesto A-18',
    kpiTone: 'success',
  },
  {
    id: 'inventory',
    label: 'Inventario IMEI',
    icon: 'box',
    eyebrow: 'Catálogo y Variantes',
    title: 'Consulta existencias, variantes de color y precios al instante',
    description:
      'Encuentra cualquier equipo con autocompletado inteligente, filtra por categoría o nivel de stock y edita existencias sin salir de la tabla.',
    bullets: [
      'Chips visuales con acabados reales (Grafito, Azul Sierra, Oro, Medianoche, Plata)',
      'Alertas automáticas de bajo stock cuando quedan 2 unidades o menos',
      'Vista detallada de producto con historial y alta rápida de nuevos equipos',
    ],
    kpiLabel: 'Valor en exhibición',
    kpiValue: '318,450.00',
    kpiStatus: '24 equipos verificados',
    kpiTone: 'neutral',
  },
  {
    id: 'orders',
    label: 'Órdenes y Cobro',
    icon: 'receipt',
    eyebrow: 'Mostrador Multi-Orden',
    title: 'Atiende a varios clientes al mismo tiempo sin perder ninguna venta',
    description:
      'Mantén una cola de órdenes activas, ajusta cantidades, selecciona variantes y completa el checkout con datos de cliente y método de pago.',
    bullets: [
      'Cambio instantáneo entre órdenes en espera, en pago o listas para entregar',
      'Selector rápido de productos con búsqueda en tiempo real',
      'Flujo de checkout dedicado con resumen de artículos e impuestos',
    ],
    kpiLabel: 'Ticket promedio de orden',
    kpiValue: '14,290.00',
    kpiStatus: '3 órdenes activas en cola',
    kpiTone: 'success',
  },
  {
    id: 'loans',
    label: 'Préstamos',
    icon: 'swap',
    eyebrow: 'Control entre Locales',
    title: 'Cero equipos extraviados al compartir mercancía con otros puestos',
    description:
      'Registra cada préstamo indicando el puesto solicitante, responsable y número de serie. Marca devoluciones con confirmación de seguridad.',
    bullets: [
      'Semáforo de estado: En préstamo, Vence hoy o Atrasado',
      'Contador de tiempo fuera para detectar equipos retenidos más de 3 horas',
      'Confirmación en dos pasos al recibir el equipo de vuelta en vitrina',
    ],
    kpiLabel: 'Equipos prestados hoy',
    kpiValue: '42,800.00',
    kpiStatus: '4 activos · 1 por vencer',
    kpiTone: 'warning',
  },
  {
    id: 'cash',
    label: 'Movimientos y Corte',
    icon: 'cash',
    eyebrow: 'Auditoría Financiera',
    title: 'Libro mayor de movimientos y cierre de caja transparente',
    description:
      'Consulta cada entrada y salida por hora, exporta reportes por rango de fechas y realiza el cierre de turno cuadrando el efectivo físico.',
    bullets: [
      'Filtro instantáneo por Todos los movimientos, Entradas o Salidas',
      'Exportación de movimientos y selector de calendario integrado',
      'Pantalla de Cierre de Caja con cálculo de diferencia en vivo',
    ],
    kpiLabel: 'Ventas brutas del turno',
    kpiValue: '23,196.00',
    kpiStatus: '12 ventas · 6 gastos',
    kpiTone: 'success',
  },
];

export const landingWorkflowSteps: LandingWorkflowStep[] = [
  {
    step: '01',
    title: 'Crea tu cuenta o inicia sesión',
    description:
      'Configura los datos de tu tienda o ingresa con el acceso rápido de demostración como propietaria.',
    icon: 'user',
    targetScreen: 'login',
    actionLabel: 'Ir al Login',
  },
  {
    step: '02',
    title: 'Registra tu catálogo e imprime etiquetas',
    description:
      'Da de alta tus equipos con variantes de color, precios en MXN y genera etiquetas térmicas para vitrina.',
    icon: 'box',
    targetScreen: 'inventory',
    actionLabel: 'Ver Inventario',
  },
  {
    step: '03',
    title: 'Opera ventas, órdenes y préstamos',
    description:
      'Levanta órdenes en mostrador, registra gastos del día y controla los préstamos con puestos vecinos.',
    icon: 'receipt',
    targetScreen: 'orders',
    actionLabel: 'Abrir Órdenes',
  },
  {
    step: '04',
    title: 'Haz tu arqueo y cierra la caja',
    description:
      'Al finalizar la jornada, ingresa el efectivo contado, revisa el resumen financiero y confirma el cierre.',
    icon: 'check',
    targetScreen: 'close',
    actionLabel: 'Probar Cierre',
  },
];

export interface ToastMessage {
  id: string;
  message: string;
  icon: string;
  type?: 'success' | 'info' | 'error';
  duration?: number;
}

declare module '*.vue' {
  const component: any
  export default component
}

declare module 'vue-router' {
  export interface RouteRecordRaw {
    path: string;
    name?: string;
    component?: any;
    components?: Record<string, any>;
    redirect?: string | { name: string };
    meta?: Record<string, any>;
    children?: RouteRecordRaw[];
  }
  export function createRouter(options: any): any
  export function createWebHistory(base?: string): any
  export function useRouter(): any
  export function useRoute(): any
}

declare module 'vue' {
  export function ref<T>(value: T): { value: T }
  export function reactive<T>(obj: T): T
  export function computed<T>(getter: () => T): { value: T }
  export function watch(source: any, callback: any, options?: any): void
  export function onMounted(callback: () => void): void
  export function onUnmounted(callback: () => void): void
  export function createApp(component: any): any
  export function defineProps<T>(props: T): T
  export function defineEmits<T>(emits: T): T
}

declare module 'pinia' {
  export function defineStore(id: string, options: any): any
  export function createPinia(): any
}

declare module 'ant-design-vue' {
  const Antd: any
  export default Antd
  export const message: any
}

declare module '@ant-design/icons-vue' {
  export const HomeOutlined: any
  export const UserOutlined: any
  export const ShoppingOutlined: any
  export const FileTextOutlined: any
  export const AreaChartOutlined: any
  export const GiftOutlined: any
  export const InboxOutlined: any
  export const SettingOutlined: any
  export const MenuUnfoldOutlined: any
  export const MenuFoldOutlined: any
  export const BellOutlined: any
  export const FullscreenOutlined: any
  export const LogoutOutlined: any
  export const NotificationOutlined: any
  export const MessageOutlined: any
  export const ShoppingCartOutlined: any
  export const UserAddOutlined: any
  export const PlusOutlined: any
  export const DeleteOutlined: any
} 
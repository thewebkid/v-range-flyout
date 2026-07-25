import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // lit-movable registers <lit-movable> / <movable-el> custom elements.
          isCustomElement: (tag) => tag === 'lit-movable' || tag === 'movable-el',
        },
      },
    }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'VRangeFlyout',
      fileName: 'v-range-flyout',
    },
    rollupOptions: {
      external: ['vue', 'lit', 'lit-movable'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          lit: 'lit',
          'lit-movable': 'LitMovable',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'v-range-flyout.css';
          return assetInfo.name;
        },
      },
    },
  },
});

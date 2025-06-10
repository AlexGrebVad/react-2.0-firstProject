import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import eslint from 'vite-plugin-eslint'
import { visualizer } from 'rollup-plugin-visualizer'
import tsconfigPaths from 'vite-tsconfig-paths'
import vitePluginImp from 'vite-plugin-imp' // Добавляем плагин

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		// Добавляем плагин для Ant Design (должен быть ДО visualizer)
		vitePluginImp({
			libList: [
				{
					libName: 'antd',
					style: (name) => `antd/es/${name}/style`,
				},
			],
		}),
		eslint({
			fix: true,
			lintOnStart: true,
			include: ['src/**/*.{js,jsx,ts,tsx}'],
			exclude: ['**/node_modules/**', '**/dist/**'],
			cache: true,
		}),
		visualizer({
			open: process.env.NODE_ENV === 'production',
			gzipSize: true,
			brotliSize: true,
		}),
	],

	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: true,
		minify: 'terser',
		rollupOptions: {
			output: {
				manualChunks: {
					react: ['react', 'react-dom'],
					vendor: ['lodash', 'date-fns'],
					antd: ['antd'],
				},
				entryFileNames: 'assets/[name].[hash].js',
				chunkFileNames: 'assets/[name].[hash].js',
				assetFileNames: 'assets/[name].[hash][extname]',
			},
		},
		chunkSizeWarningLimit: 2000,
		terserOptions: {
			compress: {
				drop_console: process.env.NODE_ENV === 'production',
			},
		},
	},

	esbuild: {
		jsx: 'automatic',
		target: 'es2022',
	},

	server: {
		port: 3000,
		open: true,
		host: true,
		strictPort: true,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				secure: false,
			},
		},
	},

	preview: {
		port: 3000,
		host: true,
		strictPort: true,
	},
})

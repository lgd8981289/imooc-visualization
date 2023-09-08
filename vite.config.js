import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	// 为 ./src 提供别名 @
	resolve: {
		alias: {
			'@': './src'
		}
	},
	// 主动开启热更新
	server: {
		hmr: true
	}
})

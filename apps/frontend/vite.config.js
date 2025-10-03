import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// https://vitejs.dev/config/
export default defineConfig(({ command: _command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      react({
        // Enable React Fast Refresh in development
        fastRefresh: !isProduction,
        // Optimize JSX runtime for production
        jsxRuntime: 'automatic',
        // Enable babel plugins for production optimization
        babel: isProduction ? {
          plugins: [
            ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }],
          ],
        } : undefined,
      }),
    ],
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    server: {
      port: 3000,
      host: true, // Allow external connections
      cors: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
      // Enable HTTP/2 for better performance
      https: false,
    },
    
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: isProduction ? false : true,
      minify: isProduction ? "terser" : false,
      target: "es2020", // Modern browsers support
      cssCodeSplit: true, // Split CSS into separate files
      
      // Terser options for production optimization
      terserOptions: isProduction ? {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false, // Remove comments
        },
      } : {},
      
      rollupOptions: {
        output: {
          // Advanced code splitting strategy
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // React ecosystem
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              // Router
              if (id.includes('react-router')) {
                return 'router';
              }
              // UI libraries
              if (id.includes('@radix-ui') || id.includes('lucide-react')) {
                return 'ui-vendor';
              }
              // Utility libraries
              if (id.includes('clsx') || id.includes('class-variance-authority') || id.includes('tailwind-merge')) {
                return 'utils';
              }
              // Other vendor libraries
              return 'vendor';
            }
            
            // App chunks
            if (id.includes('/src/pages/admin/')) {
              return 'admin';
            }
            if (id.includes('/src/pages/user/')) {
              return 'user';
            }
            if (id.includes('/src/components/ui/')) {
              return 'ui-components';
            }
            if (id.includes('/src/locales/')) {
              return 'locales';
            }
          },
          
          // Optimize chunk naming for caching
          chunkFileNames: (chunkInfo) => {
            const _facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^/.]+$/, "") : "chunk";
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `css/[name]-[hash].${ext}`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `fonts/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
        },
        
        // External dependencies (if using CDN)
        external: isProduction ? [] : [],
      },
      
      // Performance optimizations
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: isProduction,
      
      // Asset optimization
      assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    },
    
    // CSS optimization
    css: {
      devSourcemap: !isProduction,
      postcss: {
        plugins: isProduction ? [
          autoprefixer,
          cssnano({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
            }],
          }),
        ] : [autoprefixer],
      },
    },
    
    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/react-slot',
        'lucide-react',
        'clsx',
        'tailwind-merge',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },
    
    // Performance and caching
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    
    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
      cors: true,
    },
    
    // Test configuration
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.test.{js,jsx}',
          '**/*.spec.{js,jsx}',
        ],
      },
    },
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});
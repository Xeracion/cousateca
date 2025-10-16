import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Plugin to make CSS non-render-blocking
    {
      name: 'async-css-loading',
      transformIndexHtml: {
        order: 'post' as const,
        handler(html: string) {
          // Only apply in production builds
          if (mode === 'production') {
            // Transform CSS links to load asynchronously using media query technique
            // This prevents render blocking while maintaining all styles
            return html.replace(
              /<link\s+([^>]*?\s+)?rel=["']stylesheet["']([^>]*)>/gi,
              (match, before = '', after = '') => {
                // Don't transform if already has media="print" or onload
                if (match.includes('media="print"') || match.includes('onload=')) {
                  return match;
                }
                return `<link ${before}rel="stylesheet"${after} media="print" onload="this.media='all';this.onload=null;"><noscript>${match}</noscript>`;
              }
            );
          }
          return html;
        }
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

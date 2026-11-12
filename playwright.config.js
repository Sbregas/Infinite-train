import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'./tests',testMatch:'browser.spec.js',timeout:20000,expect:{timeout:5000},
  use:{baseURL:'http://127.0.0.1:4173/Infinite-train/',screenshot:'only-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
  webServer:{command:'npm start',url:'http://127.0.0.1:4173/src/model.js',reuseExistingServer:!process.env.CI}
});

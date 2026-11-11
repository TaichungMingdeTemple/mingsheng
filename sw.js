// 升級快取版本為 v3，強制手機抓取最新檔案
const CACHE_NAME = 'mingsheng-cache-v3';

// 宣告需要強制存入手機離線使用的檔案清單 (已更新為 v6)
const urlsToCache = [
    './明聖經_1107_recycle_v6.html',
    './manifest.json',
    './icon-192.jpg',
    './icon-512.jpg'
];

// 1. 安裝階段：將上述檔案全部下載並快取到手機儲存空間
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('離線快取已建立');
            return cache.addAll(urlsToCache);
        })
    );
});

// 2. 攔截請求階段 (快取優先策略 Cache-First)
// 當 App 要求資料時，先找手機裡有沒有，有的話就直接給手機裡的檔案，完全不耗網路流量！
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

// 3. 啟動與清理階段：把舊的快取垃圾 (例如舊版的 html) 清掉
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
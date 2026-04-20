// Quick API Test Script for Womencypedia
// Run this in browser console to test API endpoints directly

const APITest = {
    baseURL: 'https://womencypedia-cms.onrender.com/api',

    async testEndpoint(endpoint, description) {
        console.log(`🧪 Testing ${description}...`);
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            const data = await response.json();

            console.log(`📊 Status: ${response.status}`);
            console.log(`📄 Response:`, data);

            if (response.ok && data.data) {
                console.log(`✅ Success: Found ${Array.isArray(data.data) ? data.data.length : 1} items`);
                return { success: true, data: data.data, count: Array.isArray(data.data) ? data.data.length : 1 };
            } else {
                console.log(`❌ Error: ${data.error?.message || 'Unknown error'}`);
                return { success: false, error: data.error?.message };
            }
        } catch (error) {
            console.log(`❌ Network Error: ${error.message}`);
            return { success: false, error: error.message };
        }
    },

    async runFullTest() {
        console.log('🚀 Starting Womencypedia API Full Test\n');

        const tests = [
            ['/biographies?pagination[pageSize]=3', 'Biographies (featured check)'],
            ['/biographies?filters[featured][$eq]=true&pagination[pageSize]=3', 'Featured Biographies'],
            ['/collections?pagination[pageSize]=3', 'Collections'],
            ['/collections?filters[featured][$eq]=true&pagination[pageSize]=3', 'Featured Collections'],
            ['/education-modules?pagination[pageSize]=3', 'Education Modules'],
            ['/homepage', 'Homepage Content']
        ];

        const results = {};

        for (const [endpoint, desc] of tests) {
            results[desc] = await this.testEndpoint(endpoint, desc);
            console.log(''); // Spacer
        }

        console.log('📋 SUMMARY:');
        Object.entries(results).forEach(([desc, result]) => {
            const status = result.success ? '✅' : '❌';
            const detail = result.success ? `${result.count} items` : result.error;
            console.log(`${status} ${desc}: ${detail}`);
        });

        return results;
    }
};

// Make it globally available
window.APITest = APITest;
console.log('💡 API Test loaded! Run APITest.runFullTest() to test all endpoints');
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div v-if="error === '404'">
        <h1 class="text-9xl font-bold text-blue-600">404</h1>
        <h2 class="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p class="text-gray-600 mt-2">The page you're looking for doesn't exist or has been moved.</p>
      </div>

      <div v-else-if="error === '403'">
        <h1 class="text-9xl font-bold text-yellow-600">403</h1>
        <h2 class="text-2xl font-bold text-gray-900 mt-4">Access Denied</h2>
        <p class="text-gray-600 mt-2">You don't have permission to access this page.</p>
      </div>

      <div v-else-if="error === '500'">
        <h1 class="text-9xl font-bold text-red-600">500</h1>
        <h2 class="text-2xl font-bold text-gray-900 mt-4">Server Error</h2>
        <p class="text-gray-600 mt-2">Something went wrong on our end. Please try again later.</p>
      </div>

      <div class="mt-8">
        <button
          @click="$router.push('/')"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Return to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPages',
  props: {
    error: {
      type: String,
      required: true,
      validator: value => ['403', '404', '500'].includes(value)
    }
  }
};
</script> 
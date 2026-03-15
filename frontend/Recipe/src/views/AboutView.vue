<template>
  <div class="min-h-screen bg-surface-50 pb-24">
    <!-- Hero Section -->
    <section class="relative h-[60vh] min-h-[500px] bg-surface-900 overflow-hidden flex items-center pt-16">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2070&q=80" class="w-full h-full object-cover opacity-40">
        <div class="absolute inset-0 bg-gradient-to-b from-surface-900/60 via-surface-900/40 to-surface-50"></div>
      </div>

      <div class="container-app relative z-10 text-center">
        <div class="max-w-3xl mx-auto stagger-children">
          <span class="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
            Our Story
          </span>
          <h1 class="text-fluid-h1 font-display font-black text-white mb-8 tracking-tight leading-tight">
            We're on a Mission to <span class="text-gradient">Unite</span> Every Kitchen
          </h1>
          <p class="text-lg text-surface-300 leading-relaxed mb-12">
            RecipeShare was born from a simple idea: that the best meals aren't just about ingredients, but the stories and connections shared around the table.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" to="/signup" class="rounded-2xl px-10 shadow-elevation-3">Join the Community</Button>
            <Button variant="ghost" size="lg" to="/explore" class="rounded-2xl px-10 text-white hover:bg-white/10">Explore Recipes</Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Values -->
    <section class="container-app -mt-20 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(item, index) in values" :key="index" class="bg-white p-10 rounded-[3rem] border border-surface-200 shadow-soft hover:shadow-elevation-3 transition-all duration-500 group">
          <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3', item.bg]">
            <component :is="item.icon" :class="['w-8 h-8', item.color]" />
          </div>
          <h3 class="text-2xl font-display font-black text-surface-900 mb-4">{{ item.title }}</h3>
          <p class="text-surface-500 leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- Detailed Content -->
    <section class="container-app py-24">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="flex-1 space-y-8">
            <h2 class="text-4xl font-display font-black text-surface-900 tracking-tight">Founded by Foodies, <br>For the World.</h2>
            <div class="space-y-6 text-surface-600 leading-relaxed text-lg">
              <p>
                In 2024, a small group of home cooks and professional chefs came together with a common frustration: the digital world of recipes had become cluttered, commercialized, and disconnected.
              </p>
              <p>
                We wanted a place where the focus remained on the food and the people who make it. A platform that celebrates cultural heritage while embracing modern dietary needs and sustainable practices.
              </p>
              <p>
                Today, RecipeShare serves over a million enthusiasts globally, providing tools to organize, discover, and showcase the art of cooking without the noise.
              </p>
            </div>
            <div class="pt-4 flex items-center gap-8">
              <div>
                <div class="text-3xl font-black text-brand-600">1.2M+</div>
                <div class="text-xs font-bold text-surface-400 uppercase tracking-widest mt-1">Active Users</div>
              </div>
              <div class="w-px h-12 bg-surface-200"></div>
              <div>
                <div class="text-3xl font-black text-brand-600">500K+</div>
                <div class="text-xs font-bold text-surface-400 uppercase tracking-widest mt-1">Shared Recipes</div>
              </div>
              <div class="w-px h-12 bg-surface-200"></div>
              <div>
                <div class="text-3xl font-black text-brand-600">180+</div>
                <div class="text-xs font-bold text-surface-400 uppercase tracking-widest mt-1">Countries</div>
              </div>
            </div>
          </div>
          <div class="flex-1 relative">
            <div class="relative z-10 rounded-[3rem] overflow-hidden shadow-elevation-5 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1556910110-ad5b4a884ee7?auto=format&fit=crop&w=1000&q=80" class="w-full h-full object-cover">
            </div>
            <div class="absolute -top-8 -right-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl z-0"></div>
            <div class="absolute -bottom-8 -left-8 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container-app py-12">
      <div class="bg-brand-600 rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-elevation-5">
        <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div class="relative z-10 max-w-2xl mx-auto">
          <h2 class="text-4xl lg:text-5xl font-display font-black text-white mb-8 tracking-tight">Ready to Share Your First Masterpiece?</h2>
          <p class="text-brand-100 text-lg mb-12">Join our community today and start building your digital cookbook.</p>
          <Button variant="accent" size="lg" to="/signup" class="rounded-2xl px-12 py-5 font-black text-xl shadow-elevation-4">Get Started Free</Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { markRaw } from 'vue';
import Button from '@/components/ui/Button.vue';

const HeartIcon = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>` };
const GlobeIcon = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` };
const SparklesIcon = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>` };

const values = [
  {
    title: 'Passion First',
    description: 'We believe cooking is a form of expression. Every recipe shared here is a piece of someone\'s story.',
    icon: markRaw(HeartIcon),
    bg: 'bg-red-50',
    color: 'text-red-500'
  },
  {
    title: 'Global Unity',
    description: 'Food transcends borders. We aim to connect kitchens from Tokyo to Toronto through shared flavors.',
    icon: markRaw(GlobeIcon),
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  {
    title: 'Pure Innovation',
    description: 'Whether it\'s a 5-minute snack or a 5-hour feast, we provide the tools to make every meal special.',
    icon: markRaw(SparklesIcon),
    bg: 'bg-brand-50',
    color: 'text-brand-600'
  }
];
</script>

<style scoped>
.stagger-children > * {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}
.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import components from '@/components/UI/index';

const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component)
});

app
    .mount('#app');

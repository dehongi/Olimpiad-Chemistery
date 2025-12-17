import DefaultTheme from 'vitepress/theme'
import './style.css'
import ProblemForm from './components/ProblemForm.vue'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('ProblemForm', ProblemForm)
    }
}

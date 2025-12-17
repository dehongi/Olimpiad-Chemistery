import DefaultTheme from 'vitepress/theme'
import './style.css'
import ProblemForm from './components/ProblemForm.vue'
import ProblemEditor from './components/ProblemEditor.vue'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('ProblemForm', ProblemForm)
        app.component('ProblemEditor', ProblemEditor)
    }
}

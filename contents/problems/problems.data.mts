import { createContentLoader } from 'vitepress'

export default createContentLoader('problems/*.md', {
    includeSrc: false,
    render: true,
    transform(rawData) {
        return rawData
            .filter((page) => page.url !== '/problems/')
            .sort((a, b) => {
                return +b.frontmatter.year - +a.frontmatter.year
            })
    }
})

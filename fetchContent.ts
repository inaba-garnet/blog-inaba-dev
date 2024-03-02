import contentful, { type Entry } from 'contentful'

import * as fs from 'fs'
import dayjs from 'dayjs'

import 'dotenv/config'


const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space:  process.env.CONTENTFUL_SPACE || '',
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.CONTENTFUL_TOKEN || ''
})

const contentDir = './src/content/posts'

async function fetchData() {
    try {
        //コンテンツフォルダ 削除 & 作成
        await fs.promises.rm(contentDir, { recursive: true, force: true });
        await fs.promises.mkdir(contentDir, { recursive: true })

        //エントリの取得
        const contentfulData = await client.getEntries({})
        let entries:Entry[] = []
        entries.push(...contentfulData.items)

        // 2024年2月時点 contentfulData.limit = 100 
        // 1回で全件取得できない場合はループを回す
        if(contentfulData.total >= contentfulData.limit) {            
            let skip = 0

            while(entries.length < contentfulData.total) {
                skip += contentfulData.limit
                const contentfulSkipedData = await client.getEntries({skip, limit:1})
                entries.push(...contentfulSkipedData.items)
            }

        }

        for await (const entry of entries) {
            //使用不可文字を除去
            const fileName = String(entry.fields.slug).replace(/[\\\/:\*\?\"<>\|]/,'_')
            const writePath = contentDir + '/' + fileName + '.mdx'

            const frontmatterArray:string[] = []

            if(typeof(entry.fields.title) === 'string' && entry.fields.title !== '')
                frontmatterArray.push('title: ' +  entry.fields.title)

            if(typeof(entry.fields.description) === 'string' && entry.fields.description !== '')
                frontmatterArray.push('description: ' +  entry.fields.description)

            const createdAt = entry.sys.createdAt
            frontmatterArray.push('created_at: \'' +  dayjs(createdAt).format('YYYY-MM-DD') + '\'')
            const updatedAt = entry.sys.updatedAt
            frontmatterArray.push('updated_at: \'' +  dayjs(updatedAt).format('YYYY-MM-DD')+ '\'')

            const frontmatter = '---\n'+
                                frontmatterArray.join('\n') + '\n' + 
                                '---\n'


            const needComponentsArray:string[] = []

            const componentsMatches = String(entry.fields.body).match(/<[A-Z][A-Za-z]+\s/)
            componentsMatches?.forEach(componentMatchStr => {
                const componentName = componentMatchStr.slice(1,-1)
                needComponentsArray.push(`import ${componentName} from '/src/components/content/${componentName}.astro'\n`)
            });

            console.log(needComponentsArray)

            await fs.promises.writeFile(writePath,(frontmatter + needComponentsArray + '\n' + entry.fields.body))
        }
        
    } catch(err) {
        console.error(err)
    }
}

fetchData() 
